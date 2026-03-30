import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { WatchlistController } from "./watchlist.controller.js";

const router = Router();

// All watchlist routes require authentication
router.get("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.getMyWatchlist);

// Compatibility routes: allow sending mediaId in body/query instead of path param
router.post("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.addToWatchlist);
router.delete("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.removeFromWatchlist);

// Clear BEFORE delete /:id to prevent route collision
router.delete("/clear", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.clearWatchlist);

// Check status BEFORE generic :mediaId delete
router.get("/:mediaId/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.checkWatchlistStatus);
router.get("/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.checkWatchlistStatus);

// Add and remove (generic)
router.post("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.addToWatchlist);
router.delete("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.removeFromWatchlist);

export const WatchlistRoutes = router;
