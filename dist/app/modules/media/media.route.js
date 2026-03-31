import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { multerUpload } from "../../config/multer.config.js";
import { checkAuth } from "../../middleware/auth.js";
import { MediaController } from "./media.controller.js";
const router = Router();
router.get("/", MediaController.getAllMedia);
router.get("/:id", MediaController.getMediaById);
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("poster"), MediaController.createMedia);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("poster"), MediaController.updateMedia);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), MediaController.deleteMedia);
// GET /api/v1/media/:id/access — check if authenticated user can access this media
router.get("/:id/access", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), MediaController.checkAccess);
export const MediaRoutes = router;
//# sourceMappingURL=media.route.js.map