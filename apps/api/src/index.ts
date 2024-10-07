import { Hono } from "hono";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { cors } from "hono/cors";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import { serve } from "@hono/node-server";
import { decode, sign, verify } from "hono/jwt";

import pkg from "pg";
const { Pool } = pkg;

const app = new Hono();
const PORT = Number(process.env.PORT) || 8787;

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use("*", cors());

app.route("/api/users", userRoutes);
app.route("/api/todos", todoRoutes);
app.route("/api/collections", collectionRoutes);

async function startServer() {
    try {
        await prisma.$connect();
        console.log("DB connected🚀");
        serve(app);
    } catch (error) {
        console.error("Error starting server or connecting to database:", error);
        process.exit(1);
    }
}
startServer();

export default app;
