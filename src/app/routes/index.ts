import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { GenreRoutes } from "../modules/genre/genre.route.js";
import { MediaRoutes } from "../modules/media/media.route.js";
import { PurchaseRoutes } from "../modules/purchase/purchase.route.js";
import { ReviewRoutes } from "../modules/review/review.route.js";
import { UserRoutes } from "../modules/user/user.router.js";
import { WatchlistRoutes } from "../modules/watchlist/watchlist.route.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/media", MediaRoutes);
router.use("/media", PurchaseRoutes);
router.use("/genres", GenreRoutes);
router.use("/watchlist", WatchlistRoutes);
router.use("/reviews", ReviewRoutes);

export const IndexRoutes = router;
