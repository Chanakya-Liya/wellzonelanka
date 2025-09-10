// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { dbService } from '@/lib/database';

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string;
      isVerified?: boolean;
      profileComplete?: boolean;
    };
  }
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    isVerified?: boolean;
    profileComplete?: boolean;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          const firebaseUser = userCredential.user;

          // Get user profile from Firestore
          const userProfile = await dbService.getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            return null;
          }

          return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            role: userProfile.role,
            isVerified: userProfile.isVerified,
            profileComplete: userProfile.profileComplete,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists in our database
          const existingUser = await dbService.getUserByEmail(user.email!);
          
          if (!existingUser) {
            // Create new user profile for Google sign-in users
            await dbService.createUserProfile(user.id!, {
              firstName: (profile as any)?.givenName || user.name?.split(' ')[0] || '',
              lastName: (profile as any)?.familyName || user.name?.split(' ')[1] || '',
              email: user.email!,
              role: 'user',
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error handling Google sign-in:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };