import express from "express";
import {
  getAdminByIdController,
  getAdminProfileController,
  updateAdminController,
  getAdminsController,
} from "../Controllers/Admins.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.get("/profile", getAdminProfileController);
router.get("/get/:id", getAdminByIdController);

router.put("/", updateAdminController);
router.get("/all", getAdminsController);


export default router;