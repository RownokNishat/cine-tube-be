import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { GenreController } from "./genre.controller.js";
const router = Router();
router.get("/", GenreController.getAllGenres);
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GenreController.createGenre);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GenreController.deleteGenre);
export const GenreRoutes = router;
//# sourceMappingURL=genre.route.js.map