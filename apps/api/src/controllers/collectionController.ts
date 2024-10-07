import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

const prisma = new PrismaClient();

export const createCollection = async (c: Context) => {
    try {
        const { name, userId } = await c.req.json();
        const newCollection = await prisma.collection.create({
            data: {
                name,
                userId,
            },
        });
        return c.json(
            { status: true, collection: newCollection, message: "Collection created!" },
            201
        );
    } catch (error) {
        console.error("Error creating collection:", error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};
export const getCollections = async (c: Context) => {
    try {
        const userId = c.req.param("userId");

        const collections = await prisma.collection.findMany({
            where: {
                userId: Number(userId),
            },
        });

        return c.json({ status: true, collections }, 200);
    } catch (error) {
        console.error("Error fetching collections:", error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};

export const deleteCollection = async (c: Context) => {
    try {
        const { collectionId } = await c.req.json();
        const id = Number(collectionId);
        await prisma.collection.delete({
            where: { id: id },
        });
        return c.json({ status: true, message: "Collection deleted!" }, 200);
    } catch (error) {
        console.error("Error deleting collection:", error);
        return c.json({ status: false, message: "Internal Server Error" }, 500);
    }
};
