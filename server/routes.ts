import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertGuestSchema } from "@shared/schema";
import { parse } from "csv-parse";
import { sendRsvpNotification } from "./mail";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Guest management routes
  app.get("/api/guests", async (_req, res) => {
    const guests = await storage.getGuests();
    res.json(guests);
  });

  app.post("/api/guests", async (req, res) => {
    const validatedGuest = insertGuestSchema.parse(req.body);
    const guest = await storage.createGuest({
      ...validatedGuest,
      rsvpDate: new Date(),
    });

    // Send email notifications
    await sendRsvpNotification(guest);

    res.status(201).json(guest);
  });

  app.patch("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = insertGuestSchema.partial().parse(req.body);
    const guest = await storage.updateGuest(id, updates);
    res.json(guest);
  });

  app.delete("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteGuest(id);
    res.sendStatus(204);
  });

  app.post("/api/guests/upload", async (req, res) => {
    const records: any[] = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
    });

    parser.on("readable", async () => {
      let record;
      while ((record = parser.read())) {
        records.push(record);
      }
    });

    parser.on("end", async () => {
      for (const record of records) {
        const guest = insertGuestSchema.parse({
          name: record.name,
          email: record.email,
          plusOne: record.plusOne === "true",
          tableNumber: record.tableNumber ? parseInt(record.tableNumber) : null,
        });
        await storage.createGuest(guest);
      }
      res.status(201).json({ message: `Imported ${records.length} guests` });
    });

    parser.write(req.body.csv);
    parser.end();
  });

  const httpServer = createServer(app);
  return httpServer;
}