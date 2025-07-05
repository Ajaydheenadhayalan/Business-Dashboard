import { users, businesses, type User, type InsertUser, type Business, type InsertBusiness } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Business methods
  createBusiness(business: InsertBusiness & { rating: number; reviews: number; headline: string }): Promise<Business>;
  getBusinessByNameAndLocation(name: string, location: string): Promise<Business | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businesses: Map<number, Business>;
  private currentUserId: number;
  private currentBusinessId: number;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.currentUserId = 1;
    this.currentBusinessId = 1;
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

  async createBusiness(businessData: InsertBusiness & { rating: number; reviews: number; headline: string }): Promise<Business> {
    const id = this.currentBusinessId++;
    const business: Business = { ...businessData, id };
    this.businesses.set(id, business);
    return business;
  }

  async getBusinessByNameAndLocation(name: string, location: string): Promise<Business | undefined> {
    return Array.from(this.businesses.values()).find(
      (business) => business.name === name && business.location === location,
    );
  }
}

export const storage = new MemStorage();
