import { Request, Response, NextFunction } from "express";
import { UserService } from "./users.service";

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || "";

        const result = await UserService.getUsers({
            page,
            limit,
            search,
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
};


export const getUserById = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.json({ message: "User updated", user });
    } catch (err) {
        next(err);
    }
};

export const deactivateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await UserService.deactivateUser(req.params.id);
        res.json({ message: "User deactivated" });
    } catch (err) {
        next(err);
    }
};
