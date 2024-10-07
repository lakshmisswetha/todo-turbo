import { Hono } from "hono";
import {
    createCollection,
    deleteCollection,
    getCollections,
} from "../controllers/collectionController.js";

const router = new Hono();

router.get("/getCollections/:userId", getCollections);
router.post("/create", createCollection);
router.delete("/delete", deleteCollection);

export default router;
