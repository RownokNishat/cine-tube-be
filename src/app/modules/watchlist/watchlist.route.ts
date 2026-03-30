import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { WatchlistController } from "./watchlist.controller.js";

const router = Router();

// All watchlist routes require authentication
router.get("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.getMyWatchlist);
router.delete("/clear", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.clearWatchlist);
router.post("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.addToWatchlist);
router.delete("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.removeFromWatchlist);
router.get("/:mediaId/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.checkWatchlistStatus);

export const WatchlistRoutes = router;
