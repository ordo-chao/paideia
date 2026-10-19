import {
  updateParentService,
  getParentService,
  getParentsService,
  assignChildrenService,
  getChildrenService
} from '../Services/Parent.service.js';


export const getParentByIdController = async (req, res) => {

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

  try {
    const users = await getParentsService();

    req.log.info({ userId: req.params.id }, 'Parents fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const assignChildrenController = async (req, res) => {

  try {
    const user = await assignChildrenService(req.body);

    req.log.info({ userId: req.params.id }, 'Child assigned');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getChildrenController = async (req, res) => {

  try {
    const parent_id = req.params.parent_id;
    const users = await getChildrenService(parent_id);

    req.log.info({ userId: req.params.id }, 'Children fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};