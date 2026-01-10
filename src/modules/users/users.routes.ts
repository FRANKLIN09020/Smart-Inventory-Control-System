import { Router } from "express";
import {getUsers,getUserById,createUser,updateUser, deactivateUser,} from "./users.controller";
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// router.use(authenticate);
//
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deactivateUser);
// feature implementation of the middleware
// router.delete("/:id", authorize("ADMIN"), deactivateUser);

export default router;
