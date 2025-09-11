// Unified mock authentication service
export interface MockUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'trainer' | 'doctor';
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
}

interface UserRecord {
  user: MockUser;
  password: string;
}

class UnifiedMockAuth {
  private static instance: UnifiedMockAuth;
  private users: Map<string, UserRecord> = new Map();

  private constructor() {}

  static getInstance(): UnifiedMockAuth {
    if (!UnifiedMockAuth.instance) {
      UnifiedMockAuth.instance = new UnifiedMockAuth();
    }
    return UnifiedMockAuth.instance;
  }

  async createUser(email: string, password: string, userData: any): Promise<MockUser> {
    console.log('Creating user:', { email, userData });
    
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('Email already in use');
    }

    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }

    const user: MockUser = {
      uid: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      ...(userData.licenseNumber && { licenseNumber: userData.licenseNumber }),
      ...(userData.experience && { experience: userData.experience }),
      ...(userData.specialization && { specialization: userData.specialization }),
    };

    // Store user with password
    this.users.set(email, { user, password });
    console.log('User created successfully:', { uid: user.uid, email: user.email, role: user.role });
    console.log('Total users in system:', this.users.size);
    
    return user;
  }

  async signIn(email: string, password: string): Promise<MockUser> {
    console.log('Attempting login for:', email);
    console.log('Total users in system:', this.users.size);
    console.log('Available emails:', Array.from(this.users.keys()));
    
    const userRecord = this.users.get(email);
    
    if (!userRecord) {
      console.log('User not found for email:', email);
      throw new Error('User not found');
    }

    if (userRecord.password !== password) {
      console.log('Invalid password for user:', email);
      throw new Error('Invalid password');
    }

    console.log('Login successful for:', { uid: userRecord.user.uid, email: userRecord.user.email });
    return userRecord.user;
  }

  async emailExists(email: string): Promise<boolean> {
    const exists = this.users.has(email);
    console.log('Email exists check:', { email, exists });
    return exists;
  }

  async getUser(email: string): Promise<MockUser | null> {
    const userRecord = this.users.get(email);
    return userRecord ? userRecord.user : null;
  }

  // Debug method to see all users
  getAllUsers(): string[] {
    return Array.from(this.users.keys());
  }
}

export const unifiedMockAuth = UnifiedMockAuth.getInstance();