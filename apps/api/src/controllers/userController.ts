import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import bcryptjs from "bcryptjs";
import { sign } from "hono/jwt";
import pkg from "pg";
const { Pool } = pkg;
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const signup = async (c: Context) => {
    try {
        const { email, password, name } = await c.req.json();

        const hashedPassword = await bcryptjs.hashSync(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const defaultCollections = ["Work", "Personal", "Fitness", "Grocery"];

        await prisma.collection.createMany({
            data: defaultCollections.map((collectionName) => ({
                name: collectionName,
                userId: newUser.id,
            })),
        });

        return c.json({ status: true, user: newUser, message: "User created!" }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};

export const login = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcryptjs.compare(password, user.password))) {
            const token = sign(
                { id: user.id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET!,
                "HS256"
            );

            return c.json({ status: true, user, token, message: "Login successful" });
        } else {
            return c.json({ status: false, error: "Incorrect email or password" }, 401);
        }
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};
