import { Router } from 'express';
import { showAllTask, searchByCreator, searchByTask, searchByTime, createTask, deleteTask, completeTask, updateTask } from '../Controllers/taskController';
import { checkUser } from '../Middleware/userAuth';

const router = Router();
router.get("/showTask", showAllTask)
router.get("/searchByCreator", searchByCreator)
router.get("/searchByTask", searchByTask)
router.get("/searchByTime", searchByTime)
router.post("/createTask", checkUser, createTask)
router.patch("/completeTask", completeTask)
router.delete("/deleteTask", deleteTask)
router.patch("/updateTask", updateTask)


export default router