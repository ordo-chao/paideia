import express from "express";
import {
  getParentByIdController,
  getParentProfileController,
  updateParentController,
  getParentsController
} from "../Controllers/Parents.controller.js";


const router = express.Router();
import {verifyToken} from "../Utils/JWT.js";

router.use(verifyToken);

router.get("/profile", getParentProfileController);
router.get("/get/:id", getParentByIdController);
router.put("/", updateParentController);
router.get("/all", getParentsController);


export default router;