import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { PurchaseController } from "./purchase.controller.js";

const router = Router();

// GET /api/v1/admin/payments/dashboard
router.get(
    "/dashboard",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PurchaseController.getDashboardAnalytics,
);

// GET /api/v1/admin/payments/transactions?page=1&limit=20
router.get(
    "/transactions",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PurchaseController.getPaymentTransactions,
);

export const AdminPaymentRoutes = router;
