import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["darksider4666@gmail.com"];

export const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
};

const handler = NextAuth(authOption);

export async function isAdminRequest() {
  const session = await getServerSession(authOption);
  if (!adminEmails.includes(session?.user?.email)) {
    throw "not admin";
  }
}
export { handler as GET, handler as POST };
