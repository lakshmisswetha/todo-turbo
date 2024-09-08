import { Hono } from "hono";
import { addTodo, getTodo, updateTodo, deleteTodo } from "../controllers/todoController";

const router = new Hono();

router.post("/todos", addTodo);
router.get("/todos", getTodo);
router.put("/todos", updateTodo);
router.delete("/todos", deleteTodo);

export default router;
