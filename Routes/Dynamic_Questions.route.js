import express from "express";
import {
  createDynamicQuestionController,
  getDynamicQuestionByIdController,
  updateDynamicQuestionController,
  getAllDynamicQuestionController,
  deleteDynamicQuestionController,
  searchDynamicQuestionController,
  getAllDynamicQuestionByAssignmentIdController
} from "../Controllers/Dynamic_Questions.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createDynamicQuestionController);
router.get("/get/:id", getDynamicQuestionByIdController);
router.put("/update/:id", updateDynamicQuestionController);
router.get("/all", getAllDynamicQuestionController);
router.delete("/delete/:id", deleteDynamicQuestionController);
router.get("/search", searchDynamicQuestionController);
router.get("/assignment/:assignment_id", getAllDynamicQuestionByAssignmentIdController);


export default router;