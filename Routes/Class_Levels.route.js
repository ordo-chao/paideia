import express from "express";
import {
  createClassLevelsController,
  getClassLevelsByIdController,
  updateClassLevelsController,
  getAllClassLevelsController,
  deleteClassLevelsController,
  searchClassLevelsController
} from "../Controllers/Class_Levels.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.post("/create", createClassLevelsController);
router.get("/get/:id", getClassLevelsByIdController);
router.put("/update/:id", updateClassLevelsController);
router.get("/all", getAllClassLevelsController);
router.delete("/delete/:id", deleteClassLevelsController);
router.get("/search", searchClassLevelsController);


export default router;