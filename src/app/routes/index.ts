import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { GenreRoutes } from "../modules/genre/genre.route.js";
import { MediaRoutes } from "../modules/media/media.route.js";
import { UserRoutes } from "../modules/user/user.router.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/media", MediaRoutes);
router.use("/genres", GenreRoutes);

export const IndexRoutes = router;
