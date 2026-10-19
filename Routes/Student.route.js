import express from "express";
import {
  getStudentByIdController,
  getStudentProfileController,
  updateStudentController,
  getStudentsController , 
  getParentsController
} from "../Controllers/Students.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.get("/profile", getStudentProfileController);
router.get("/get/:id", getStudentByIdController);
router.put("/", updateStudentController);
router.get("/all", getStudentsController);

router.get("/parents/:student_id", getParentsController);


export default router;