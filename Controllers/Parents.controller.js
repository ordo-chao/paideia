import {
  updateParentService,
  getParentService,
  getParentsService
} from '../Services/Parent.service.js';


export const getParentByIdController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.params.id;
    const user = await getParentService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Parent');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getParentProfileController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await getParentService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Parent profile');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateParentController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await updateParentService(userId, req.body);

    req.log.info({ userId: req.params.id }, 'Parent updated');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getParentsController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const users = await getParentsService();

    req.log.info({ userId: req.params.id }, 'Parents fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};