import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { decode, sign, verify } from "hono/jwt";

const prisma = new PrismaClient();

export const signup = async (c: any) => {
    try {
        const { email, password, name } = c.req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return c.json({ status: false, error: "Email already exists!" }, 409);
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        return c.json({ status: true, user: newUser, message: "User created!" }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};

export const login = async (c: any) => {
    try {
        const { email, password } = c.req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = sign(
                { id: user.id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET!,
                "HS256"
            );

            return c.json({ status: true, token, message: "Login successful" });
        } else {
            return c.json({ status: false, error: "Incorrect email or password" }, 401);
        }
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};
