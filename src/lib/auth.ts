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
          role: {
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
  database: mongodbAdapter(db, {
    client,
  }),
});