import {
  updateStudentService,
  getStudentService,
  getStudentsService,
  getParentsService
} from '../Services/Student.service.js';


export const getStudentByIdController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.params.id;
    const user = await getStudentService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching student');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getStudentProfileController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await getStudentService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching student profile');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateStudentController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await updateStudentService(userId, req.body);

    req.log.info({ userId: req.params.id }, 'Student updated');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getStudentsController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const users = await getStudentsService();

    req.log.info({ userId: req.params.id }, 'Students fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getParentsController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const student_id = req.params.student_id
    const users = await getParentsService(student_id);

    req.log.info({ userId: req.params.id }, 'Parents fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};