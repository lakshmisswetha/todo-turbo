import { Hono } from "hono";
import { addTodo, getTodo, updateTodo, deleteTodo } from "../controllers/todoController.js";

const router = new Hono();

router.post("/add", addTodo);
router.get("/get", getTodo);
router.put("/update", updateTodo);
router.delete("/delete", deleteTodo);

export default router;
