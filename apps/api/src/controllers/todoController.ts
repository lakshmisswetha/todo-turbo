import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTodo = async (c: any) => {
    try {
        const userId = c.req.query("userId");
        const collectionId = c.req.query("collectionId");

        const todoItems = await prisma.todo.findMany({
            where: {
                collection: {
                    userId: Number(userId),
                    id: Number(collectionId),
                },
            },
            select: { id: true, title: true, isCompleted: true },
            orderBy: { createdAt: "desc" },
        });

        return c.json(
            {
                status: true,
                data: { todoItems },
                message: "Successfully Fetched",
            },
            200
        );
    } catch (err) {
        console.error(err);

        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};

export const addTodo = async (c: any) => {
    try {
        const { title, collectionId } = await c.req.json();
        //const userId = c.req.user?.id;

        const newTodo = await prisma.todo.create({
            data: {
                title,
                collectionId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return c.json(
            {
                status: true,
                todo: newTodo,
                message: "Todo item added successfully",
            },
            200
        );
    } catch (error) {
        console.error(error);
        return c.json(
            {
                status: false,
                message: "Internal Server Error",
            },
            500
        );
    }
};

export const updateTodo = async (c: any) => {
    try {
        const { id, title, collectionId } = await c.req.json();

        const userId = c.req.query("userId");

        const todo = await prisma.todo.findFirst({
            where: { id: Number(id), collectionId: Number(collectionId) },
        });

        if (todo) {
            const updatedTodo = await prisma.todo.update({
                where: { id: Number(id) },
                data: { title, updatedAt: new Date() },
            });

            return c.json(
                {
                    status: true,
                    todo: updatedTodo,
                    message: "Todo updated successfully",
                },
                200
            );
        } else {
            return c.json(
                {
                    status: false,
                    message: "Unauthorized",
                },
                401
            );
        }
    } catch (error) {
        console.error(error);
        return c.json(
            {
                status: false,
                message: "Internal Server Error",
            },
            500
        );
    }
};

export const deleteTodo = async (c: any) => {
    try {
        const { taskId } = await c.req.json();
        const id = Number(taskId);

        await prisma.todo.delete({
            where: { id: id },
        });

        return c.json({ status: true, message: "Todo deleted successfully" }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};
export const updateTodoStatus = async (c: any) => {
    try {
        const { taskId, isCompleted } = await c.req.json();

        const todo = await prisma.todo.findFirst({
            where: { id: Number(taskId) },
        });

        if (todo) {
            const updatedTodo = await prisma.todo.update({
                where: { id: Number(taskId) },
                data: { isCompleted: Boolean(isCompleted), updatedAt: new Date() },
            });

            return c.json(
                {
                    status: true,
                    todo: updatedTodo,
                    message: "Todo status updated successfully",
                },
                200
            );
        } else {
            return c.json(
                {
                    status: false,
                    message: "Todo not found",
                },
                404
            );
        }
    } catch (error) {
        console.error(error);
        return c.json(
            {
                status: false,
                message: "Internal Server Error",
            },
            500
        );
    }
};
