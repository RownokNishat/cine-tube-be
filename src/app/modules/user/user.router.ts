import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { UserController } from "./user.controller.js";
import { createAdminZodSchema, updateMeZodSchema } from "./user.validation.js";

const router = Router();

// ---- Self (authenticated user) ----
router.get(
    "/me",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getMe,
);

router.patch(
    "/me",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateMeZodSchema),
    UserController.updateMe,
);

// ---- Admin actions ----
router.post(
    "/create-admin",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(createAdminZodSchema),
    UserController.createAdmin,
);

router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getAllUsers,
);

router.patch(
    "/:userId/status",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.updateUserStatus,
);

export const UserRoutes = router;
