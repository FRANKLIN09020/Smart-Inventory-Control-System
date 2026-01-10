import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const permit = (...requiredPermissions: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.permissions) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const hasPermission = requiredPermissions.every((permission) =>
            req.user!.permissions!.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                message: "Insufficient permissions",
            });
        }

        next();
    };
};
