import { MongoClient } from "mongodb";
import { AuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

const uri = process.env.MONGODB_URI ?? "";

async function addUserToDB(user: User | AdapterUser) {
  const client = new MongoClient(uri);
  const db = client.db();
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({ email: user.email });
  if (existingUser) return;
  await usersCollection.insertOne({
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: new Date(),
  });
  client.close();
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async signIn({ user }) {
      await addUserToDB(user);
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
} as AuthOptions;
