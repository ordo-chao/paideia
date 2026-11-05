import express from "express";
import {
  createSubmissionController,
  getSubmissionByIdController,
  updateSubmissionController,
  getAllSubmissionController,
  deleteSubmissionController,
  searchSubmissionController
} from "../Controllers/Submissions.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createSubmissionController);
router.get("/get/:id", getSubmissionByIdController);
router.put("/update/:id", updateSubmissionController);
router.get("/all", getAllSubmissionController);
router.delete("/delete/:id", deleteSubmissionController);
router.get("/search", searchSubmissionController);


export default router;