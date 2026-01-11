import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

/* Health Check */
app.get("/", (req: Request, res: Response) => {
    res.send("API is running 🚀");
});

/* API Routes */
app.use(routes);

/* 404 Handler */
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

/* Global Error Handler */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;
