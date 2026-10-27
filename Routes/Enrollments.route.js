import express from "express";
import {
  createEnrollmentsController,
  getEnrollmentsByIdController,
  updateEnrollmentsController,
  getAllEnrollmentsController,
  deleteEnrollmentsController,
  searchEnrollmentsController,
  getEnrollmentsByClassStreamController,
  getEnrollmentsByStudentController
} from "../Controllers/Enrollments.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createEnrollmentsController);
router.get("/get/:id", getEnrollmentsByIdController);
router.put("/update/:id", updateEnrollmentsController);
router.get("/all", getAllEnrollmentsController);
router.delete("/delete/:id", deleteEnrollmentsController);
router.get("/search", searchEnrollmentsController);

router.get("/class_stream/:class_stream_id", getEnrollmentsByClassStreamController);
router.get("/student/:student_id", getEnrollmentsByStudentController);


export default router;