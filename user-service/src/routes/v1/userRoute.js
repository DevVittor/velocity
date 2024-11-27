import { Router } from "express";

const router = Router();

import { createUser, loginUser } from "../../controller/userController.js";

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
