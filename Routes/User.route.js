import express from "express";
import {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUserProfileController,
  getUsersController
} from "../Controllers/User.controller.js";

const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

// router.use(verifyToken);

router.post("/login", loginUserController);
router.get("/profile", verifyToken, getUserProfileController);

router.post("/register", createUserController);
router.get("/get/:id", verifyToken, getUserByIdController);
router.put("/", verifyToken, updateUserController);
router.delete("/", verifyToken, deleteUserController);
router.get("/all", verifyToken, getUsersController);


export default router;