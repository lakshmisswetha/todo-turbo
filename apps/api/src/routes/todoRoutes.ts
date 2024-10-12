import { Hono } from "hono";
import {
    addTodo,
    getTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
} from "../controllers/todoController.js";

const router = new Hono();

router.post("/add", addTodo);
router.get("/get", getTodo);
router.put("/update", updateTodo);
router.delete("/delete", deleteTodo);
router.put("/status", updateTodoStatus);

export default router;
