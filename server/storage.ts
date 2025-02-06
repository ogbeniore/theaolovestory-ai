import { InsertUser, User, InsertGuest, Guest, users, guests } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Guest management
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest>;
  deleteGuest(id: number): Promise<void>;

  sessionStore: ReturnType<typeof PostgresSessionStore>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: ReturnType<typeof PostgresSessionStore>;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, isAdmin: false })
      .returning();
    return user;
  }

  async getGuests(): Promise<Guest[]> {
    return await db.select().from(guests);
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest;
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const [newGuest] = await db
      .insert(guests)
      .values({
        ...guest,
        email: guest.email ?? null,
        isAttending: guest.isAttending ?? null,
        dietaryRestrictions: guest.dietaryRestrictions ?? null,
        plusOne: guest.plusOne ?? false,
        tableNumber: guest.tableNumber ?? null,
        rsvpDate: guest.rsvpDate ?? null,
      })
      .returning();
    return newGuest;
  }

  async updateGuest(id: number, updates: Partial<InsertGuest>): Promise<Guest> {
    const [updatedGuest] = await db
      .update(guests)
      .set(updates)
      .where(eq(guests.id, id))
      .returning();

    if (!updatedGuest) {
      throw new Error("Guest not found");
    }

    return updatedGuest;
  }

  async deleteGuest(id: number): Promise<void> {
    await db.delete(guests).where(eq(guests.id, id));
  }
}

export const storage = new DatabaseStorage();