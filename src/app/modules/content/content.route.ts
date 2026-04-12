import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ContentController } from "./content.controller.js";
import { createContactMessageSchema, subscribeNewsletterSchema } from "./content.validation.js";

const router = Router();

router.get("/about", ContentController.getAbout);
router.get("/faq", ContentController.getFaq);
router.post("/contact", validateRequest(createContactMessageSchema), ContentController.createContactMessage);

router.get(
    "/contact-messages",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ContentController.getContactMessages,
);

router.patch(
    "/contact-messages/:id/read",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ContentController.markContactMessageRead,
);

router.post("/newsletter/subscribe", validateRequest(subscribeNewsletterSchema), ContentController.subscribeNewsletter);

router.get(
    "/newsletter/subscribers",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ContentController.getNewsletterSubscribers,
);

export const ContentRoutes = router;
