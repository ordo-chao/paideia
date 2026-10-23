import {
  createUserService,
  updateUserService,
  deleteUserService,
  loginUserService,
  getUserService,
  getUsersService,
} from '../Services/User.service.js';
import {generateToken} from '../Utils/JWT.js'


export const createUserController = async (req, res) => {
  

  try {
    const user = await createUserService(req.body);

    req.log.info({ userId: req.params.id }, 'User created');
    res.status(201).json(user);

  } catch (error) {
    if(error.statusCode === 400 || error.statusCode === 409){
      req.log.warn({ err: error })
    }else{
      req.log.error({ err: error })
    }
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getUserByIdController = async (req, res) => {
  

  try {
    const userId = req.params.id;
    const user = await getUserService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching user');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getUserProfileController = async (req, res) => {
  

  try {
    const userId = req.user.id;
    const user = await getUserService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching user profile');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateUserController = async (req, res) => {
  

  try {
    const userId = req.user.id;
    const user = await updateUserService(userId, req.body);

    req.log.info({ userId: req.params.id }, 'User updated');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  

  try {
    const userId = req.user.id;
    await deleteUserService(userId);

    req.log.info({ userId: req.params.id }, 'User deleted');
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const loginUserController = async (req, res) => {
  

  try {
    const { email, password } = req.body;
    
    const user = await loginUserService(email, password );
    const JWTToken = await generateToken(user);

    req.log.info({ userId: req.params.id }, 'User logged in');
    res.status(200).json({...user  , token: JWTToken});

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getUsersController = async (req, res) => {
  

  try {
    const users = await getUsersService();

    req.log.info({ userId: req.params.id }, 'Users fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};