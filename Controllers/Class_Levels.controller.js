import {
  createClassLevelsService,
  getClassLevelsByIdService,
  updateClassLevelsService,
  getAllClassLevelsService,
  deleteClassLevelsService,
  searchClassLevelsService
} from '../Services/Class_Levels.service.js';


export const createClassLevelsController = async (req, res) => {
  
  try {
    const academicyear = await createClassLevelsService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Class Level');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getClassLevelsByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const academicyear = await getClassLevelsByIdService(id);

    req.log.info({ userId: req.user.id }, 'Class Level fetched');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateClassLevelsController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const academicyear = await updateClassLevelsService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Class Level updated');
    res.status(200).json(academicyear);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllClassLevelsController = async (req, res) => {
  

  try {
    const academicyears = await getAllClassLevelsService();

    req.log.info({ userId: req.user.id }, 'Class levels fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteClassLevelsController = async (req, res) => {
  

  try {
    const id = req.params.id
    const academicyears = await deleteClassLevelsService(id);

    req.log.info({ userId: req.user.id }, 'Class Level deleted');
    res.status(200).json({ message: 'Class Level deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchClassLevelsController = async (req, res) => {

  try {
    const query = req.query.query
    const academicyears = await searchClassLevelsService(query);

    req.log.info({ userId: req.user.id }, 'Class levels fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}