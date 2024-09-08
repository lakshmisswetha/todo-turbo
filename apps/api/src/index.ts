import { Hono } from "hono";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { cors } from "hono/cors";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import { signup } from "./controllers/userController";
import { login } from "./controllers/userController";

const app = new Hono();
const PORT = Number(process.env.PORT) || 8787;

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
import bcrypt from "bcrypt";

app.use("*", cors());

// app.route("/api/users", userRoutes);
// app.route("/api/todos", todoRoutes);

// app.post("/signup", signup);
app.post("/signup", async (c) => {
    try {
        const { email, password, name } = await c.req.json();

        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: password,
                name,
            },
        });
        return c.json({ status: true, user: newUser, message: "User created!" }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
});

async function startServer() {
    try {
        await prisma.$connect();
        console.log("DB connected🚀");
        app.fire();
        console.log(`Server is listening on port ${PORT}`);
    } catch (error) {
        console.error("Error starting server or connecting to database:", error);
        process.exit(1);
    }
}
startServer();

export default app;
