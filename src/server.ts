import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import app from "./app";
import { connectPrisma } from "./config/database/prisma";

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectPrisma();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

startServer();
