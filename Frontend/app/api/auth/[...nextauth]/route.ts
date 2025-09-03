import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";
import { prisma } from "../../../../lib/prisma";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const MONGO_URI = process.env.MONGO;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO environment variable");
}

// Module augmentation for custom JWT and session fields
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Missing credentials");
          }

          await connectToDatabase();

          const user = await User.findOne({ email: credentials.email }).exec() as { _id: string; email: string; password: string; firstName: string; lastName: string };

          if (!user || !user.password) {
            throw new Error("User not found or missing password");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email ?? undefined,
        name: token.name ?? undefined,
      };
      return session;
    },
    async signIn({ profile }) {
      console.log("Profile:", profile);
      if (!profile || !profile.email) {
        throw new Error("Email not found in profile");
      }
      

      const existingUser = await User.findOne({ email: profile.email }).exec();

      if (existingUser) {
        // User already exists, link Google login with existing user
        return true;
      } else {
        // User does not exist, create a new user
        await prisma.user.upsert({
          where: { email: profile.email },
          update: { name: profile.name ?? "" },
          create: {
            email: profile.email,
            name: profile.name ?? "",
          },
        });
        console.log("New user created:", profile.email);
      }

      return true;
    },
  },
  pages: {
    signIn: "/services",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
