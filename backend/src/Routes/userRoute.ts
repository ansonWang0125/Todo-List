import { Router } from 'express';
import { login, allUsers } from '../Controllers/userController';

const router = Router();
router.post("/login", login)
router.get("/getUsers", allUsers)

export default router