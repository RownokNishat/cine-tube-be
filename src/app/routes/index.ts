import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { UserRoutes } from "../modules/user/user.router.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);

export const IndexRoutes = router;
