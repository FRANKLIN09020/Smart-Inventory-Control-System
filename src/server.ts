import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/database/db";

dotenv.config();

const PORT = process.env.PORT || 5000;
// Connect MongoDB
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
