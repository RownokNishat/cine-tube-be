import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { SubscriptionController } from "./subscription.controller.js";
import { updateSubscriptionPlanSchema } from "./subscription.validation.js";
const router = Router();
router.get("/plans", SubscriptionController.getSubscriptionPlans);
router.patch("/plans/:plan", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateSubscriptionPlanSchema), SubscriptionController.updateSubscriptionPlan);
router.get("/me", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.getMySubscription);
router.post("/checkout", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.createCheckoutSession);
router.get("/verify", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.verifyCheckoutSession);
router.post("/cancel", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.cancelSubscription);
export const SubscriptionRoutes = router;
//# sourceMappingURL=subscription.route.js.map