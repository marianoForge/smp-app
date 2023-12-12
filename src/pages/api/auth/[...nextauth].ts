import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import { mongodbUserFinder } from "@/libs/mongodbUserFinder";

import clientPromise from "@/libs/clientPromise";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Aquí conectas a tu MongoDB y buscas al usuario
        const existingUser = await mongodbUserFinder(user.email);
        if (existingUser) {
          // Si el usuario existe, permites el inicio de sesión
          return true;
        } else {
          // Si no existe, puedes rechazar el inicio de sesión o crear un nuevo usuario
          return true;
        }
      }
      return true; // Para otros proveedores o casos
    },
  },
};

export default NextAuth(authOptions);
