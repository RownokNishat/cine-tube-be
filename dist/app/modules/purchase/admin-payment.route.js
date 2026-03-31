import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { PurchaseController } from "./purchase.controller.js";
const router = Router();
// GET /api/v1/admin/payments/dashboard
router.get("/dashboard", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PurchaseController.getDashboardAnalytics);
export const AdminPaymentRoutes = router;
//# sourceMappingURL=admin-payment.route.js.map