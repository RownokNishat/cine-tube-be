import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { seedSuperAdmin } from "./app/utils/seed.js";
import 'dotenv/config';
let server;
const bootstrap = async () => {
    try {
        await seedSuperAdmin();
        server = app.listen(envVars.PORT, () => {
            console.log(`CineTube server running on http://localhost:${envVars.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    if (server) {
        server.close(() => { process.exit(0); });
    }
    else {
        process.exit(0);
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down...");
    if (server) {
        server.close(() => { process.exit(0); });
    }
    else {
        process.exit(0);
    }
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    if (server) {
        server.close(() => { process.exit(1); });
    }
    else {
        process.exit(1);
    }
});
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    if (server) {
        server.close(() => { process.exit(1); });
    }
    else {
        process.exit(1);
    }
});
bootstrap();
//# sourceMappingURL=server.js.map