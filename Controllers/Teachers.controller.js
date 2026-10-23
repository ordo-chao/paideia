import {
  updateTeacherService,
  getTeacherService,
  getTeachersService,
  getTeacherByTSCService
} from '../Services/Teacher.service.js';


export const getTeacherByIdController = async (req, res) => {
  

  try {
    const userId = req.params.id;
    const user = await getTeacherService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Teacher');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTeacherByTSCController = async (req, res) => {
  

  try {
    const tsc = req.params.tsc;
    const user = await getTeacherByTSCService(tsc);

    req.log.info({ userId: req.params.id }, 'Fetching Teacher');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTeacherProfileController = async (req, res) => {
  

  try {
    const userId = req.user.id;
    const user = await getTeacherService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Teacher profile');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateTeacherController = async (req, res) => {
  

  try {
    const userId = req.user.id;
    const user = await updateTeacherService(userId, req.body);

    req.log.info({ userId: req.params.id }, 'Teacher updated');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getTeachersController = async (req, res) => {
  

  try {
    const users = await getTeachersService();

    req.log.info({ userId: req.params.id }, 'Teachers fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};