import {
  updatePasswordService,
  validateTokenService,
  getVerificationCodeService,
  verifyVerificationService
} from '../Services/Password.service.js';


export const updatePasswordController = async (req, res) => {
  

  try {
    await updatePasswordService(req.body);

    req.log.info({  }, 'User password updated created');
    res.status(201).json({message: "User password updated"});

  } catch (error) {
    if(error.statusCode === 400 || error.statusCode === 409){
      req.log.warn({ err: error })
    }else{
      req.log.error({ err: error })
    }
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const validateTokenController = async (req, res) => {
  

  try {
    const token = req.body.token;
    await validateTokenService(token);

    req.log.info({}, 'token validated');
    res.status(200).json({message: "Token validated"});

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getVerificationCodeController = async (req, res) => {
  

  try {
    const email = req.body.email;
    
    const token = await getVerificationCodeService(email);

    req.log.info({ userId: token.dataValues.user_id }, 'Verification code fetched');
    res.status(200).json(token);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const verifyVerificationController = async (req, res) => {
  

  try {
    const code = req.body.code;
    const token = await verifyVerificationService(code);

    req.log.info({ userId: token.dataValues.user_id }, 'verfication code validated');
    res.status(200).json(token);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
