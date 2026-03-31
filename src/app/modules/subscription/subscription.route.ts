import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { SubscriptionController } from "./subscription.controller.js";

const router = Router();

router.get("/plans", SubscriptionController.getSubscriptionPlans);
router.get("/me", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.getMySubscription);
router.post("/checkout", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.createCheckoutSession);
router.post("/cancel", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.cancelSubscription);

export const SubscriptionRoutes = router;
