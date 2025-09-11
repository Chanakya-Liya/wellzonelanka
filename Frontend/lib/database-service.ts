// Real database service using JSON file storage (can be easily replaced with MongoDB/PostgreSQL)
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'trainer' | 'doctor';
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
  createdAt: string;
  isApproved: boolean;
}

class DatabaseService {
  private dbPath: string;

  constructor() {
    // Store data in a JSON file (in production, use a real database)
    this.dbPath = path.join(process.cwd(), 'data', 'users.json');
  }

  private async ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(this.dbPath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private async readUsers(): Promise<User[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  private async writeUsers(users: User[]): Promise<void> {
    await this.ensureDataDirectory();
    await fs.writeFile(this.dbPath, JSON.stringify(users, null, 2));
  }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'trainer' | 'doctor';
    licenseNumber?: string;
    experience?: number;
    specialization?: string;
  }): Promise<User> {
    const users = await this.readUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash,
      role: userData.role,
      ...(userData.licenseNumber && { licenseNumber: userData.licenseNumber }),
      ...(userData.experience && { experience: userData.experience }),
      ...(userData.specialization && { specialization: userData.specialization }),
      createdAt: new Date().toISOString(),
      isApproved: userData.role === 'user' // Auto-approve regular users
    };

    users.push(newUser);
    await this.writeUsers(users);

    console.log('User saved to database:', { id: newUser.id, email: newUser.email, role: newUser.role });
    return newUser;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const users = await this.readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('User not found in database:', email);
      return null;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return null;
    }

    console.log('User authenticated successfully:', { id: user.id, email: user.email });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find(user => user.email === email) || null;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.readUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find(user => user.id === id) || null;
  }
}

export const databaseService = new DatabaseService();