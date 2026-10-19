import express from "express";
import {
  getTeacherByIdController,
  getTeacherProfileController,
  updateTeacherController,
  getTeachersController,
  getTeacherByTSCController
} from "../Controllers/Teachers.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.get("/profile", getTeacherProfileController);
router.get("/get/:id", getTeacherByIdController);
router.get("/tsc/:tsc", getTeacherByTSCController);

router.put("/", updateTeacherController);
router.get("/all", getTeachersController);


export default router;