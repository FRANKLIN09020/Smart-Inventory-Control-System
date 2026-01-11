import { Router } from "express";
import {getUsers,getUserById,createUser,updateUser, deactivateUser,} from "./users.controller";
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// router.use(authenticate);
//
router.get("/getUsers", getUsers);
router.post("/insertUser", createUser);
router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deactivateUser);

// feature implementation of the middleware
// router.delete("/:id", authorize("ADMIN"), deactivateUser);

export default router;
