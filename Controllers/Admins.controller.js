import {
  updateAdminService,
  getAdminService,
  getAdminsService,
} from '../Services/Admin.service.js';


export const getAdminByIdController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.params.id;
    const user = await getAdminService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Admin');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getAdminProfileController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await getAdminService(userId);

    req.log.info({ userId: req.params.id }, 'Fetching Admin profile');
    res.status(200).json(user);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateAdminController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const userId = req.user.id;
    const user = await updateAdminService(userId, req.body);

    req.log.info({ userId: req.params.id }, 'Admin updated');
    res.status(200).json(user);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAdminsController = async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const users = await getAdminsService();

    req.log.info({ userId: req.params.id }, 'Admins fetched');
    res.status(200).json(users);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};