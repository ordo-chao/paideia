import { Router } from "express";
import {updatePasswordController , validateTokenController , getVerificationCodeController , verifyVerificationController } from '../Controllers/Password.controller.js'

const router = Router();


router.post('/update', updatePasswordController);
router.post('/validate', validateTokenController);
router.post('/code', getVerificationCodeController);

router.post('/verify', verifyVerificationController);



export default router