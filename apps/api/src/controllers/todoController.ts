import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTodo = async (c: any) => {
    try {
        const userId = c.req.user?.id;

        const todoItems = await prisma.todo.findMany({
            where: { collection: { userId } },
            select: { id: true, title: true },
            orderBy: { createdAt: "desc" },
        });

        return c.res.status(200).json({
            status: true,
            data: { todoItems },
            message: "Successfully Fetched",
        });
    } catch (err) {
        console.error(err);

        return c.res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const addTodo = async (c: any) => {
    try {
        const { title, collectionId, collectionName } = await c.req.json();
        const userId = c.req.user?.id;

        let collection = await prisma.collection.findUnique({
            where: { id: collectionId },
        });

        if (!collection) {
            collection = await prisma.collection.create({
                data: {
                    name: collectionName,
                    userId: userId!,
                },
            });
        } else if (collection.userId !== userId) {
            return c.res.status(401).json({
                status: false,
                message: "Unauthorized or invalid collection",
            });
        }

        const newTodo = await prisma.todo.create({
            data: {
                title,
                collectionId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return c.res.status(201).json({
            status: true,
            todo: newTodo,
            message: "Todo item added successfully",
        });
    } catch (error) {
        console.error(error);
        return c.res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const updateTodo = async (c: any) => {
    try {
        const { id, title } = await c.req.json();

        const userId = c.req.user?.id;

        const todo = await prisma.todo.findUnique({
            where: { id },
            include: { collection: true },
        });

        if (todo && todo.collection.userId === userId) {
            const updatedTodo = await prisma.todo.update({
                where: { id },
                data: { title, updatedAt: new Date() },
            });

            return c.res.status(200).json({
                status: true,
                todo: updatedTodo,
                message: "Todo updated successfully",
            });
        } else {
            return c.res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }
    } catch (error) {
        console.error(error);
        return c.res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteTodo = async (c: any) => {
    try {
        const userId = c.req.user?.id;
        const { todoId } = c.req.body;

        const todo = await prisma.todo.findUnique({
            where: { id: todoId },
            include: { collection: true },
        });

        if (!todo || todo.collection.userId !== userId) {
            return c.res.status(401).json({ status: false, message: "Unauthorized" });
        }

        await prisma.todo.delete({
            where: { id: todoId },
        });

        return c.res.status(200).json({ status: true, message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        return c.res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};
