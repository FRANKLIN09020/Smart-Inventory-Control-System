import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
};
