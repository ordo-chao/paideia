import express from "express";
import {
  createAssignmentController,
  getAssignmentByIdController,
  updateAssignmentController,
  getAllAssignmentController,
  deleteAssignmentController,
  searchAssignmentsController,
  getAllAssignmentsByTeacherIdController,
  getAllAssignmentsByClassSubjectIdController
} from "../Controllers/Assignments.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createAssignmentController);
router.get("/get/:id", getAssignmentByIdController);
router.put("/update/:id", updateAssignmentController);
router.get("/all", getAllAssignmentController);
router.delete("/delete/:id", deleteAssignmentController);
router.get("/search", searchAssignmentsController);
router.get("/teacher/:teacher_id", getAllAssignmentsByTeacherIdController);
router.get("/class_subject/:class_subject_id", getAllAssignmentsByClassSubjectIdController);


export default router;