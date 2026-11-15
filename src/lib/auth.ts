import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGO_DB_CLIENT_URI as string);
export const db = client.db('HireLoop');

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 

user: {
       additionalFields: {
          userRole: {
              type: ['seeker', 'recruiter', 'admin'],
              input: true,
              defaultValue: 'seeker'
            } 
        }
    },

  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
      admin(),
    ],

    // Keep Better Auth's own `role` field (read by the admin plugin's API
    // gates, e.g. listUsers) mirrored from our `userRole` whenever an account
    // is created — so sign-ups as admin actually pass those gates.
    databaseHooks: {
      user: {
        create: {
          before: async (user) => ({
            data: { ...user, role: (user.userRole as string | undefined) ?? "seeker" },
          }),
        },
      },
    },

  database: mongodbAdapter(db, {
    client,
  }),
});