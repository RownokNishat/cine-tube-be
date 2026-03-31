import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { PurchaseController } from "./purchase.controller.js";

const router = Router();

// POST /api/v1/media/purchase/checkout
router.post(
    "/purchase/checkout",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    PurchaseController.createCheckoutSession,
);

// GET /api/v1/media/purchases/my-purchases
router.get(
    "/purchases/my-purchases",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    PurchaseController.getMyPurchases,
);

// GET /api/v1/media/purchases/verify?sessionId=xxx  (called on success page)
router.get(
    "/purchases/verify",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    PurchaseController.verifyPaymentSuccess,
);

export const PurchaseRoutes = router;
