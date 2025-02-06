import { InsertUser, User, InsertGuest, Guest } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private guests: Map<number, Guest>;
  private currentUserId: number;
  private currentGuestId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.guests = new Map();
    this.currentUserId = 1;
    this.currentGuestId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin",
      isAdmin: true,
    } as InsertUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const id = this.currentGuestId++;
    const newGuest: Guest = { ...guest, id };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, updates: Partial<InsertGuest>): Promise<Guest> {
    const guest = this.guests.get(id);
    if (!guest) {
      throw new Error("Guest not found");
    }
    const updatedGuest = { ...guest, ...updates };
    this.guests.set(id, updatedGuest);
    return updatedGuest;
  }

  async deleteGuest(id: number): Promise<void> {
    this.guests.delete(id);
  }
}

export const storage = new MemStorage();
