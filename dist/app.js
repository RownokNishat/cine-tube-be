import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import qs from "qs";
import { envVars } from "./app/config/env.js";
import { auth } from "./lib/auth.js";
import { PurchaseController } from "./app/modules/purchase/purchase.controller.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { notFound } from "./app/middleware/notFound.js";
import { IndexRoutes } from "./app/routes/index.js";
const app = express();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));
app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/auth", toNodeHandler(auth));
// Stripe webhook MUST be before express.json() — requires raw body
app.post("/api/v1/stripe/webhook", express.raw({ type: "application/json" }), PurchaseController.stripeWebhook);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoutes);
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "CineTube API is running",
    });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
//# sourceMappingURL=app.js.map