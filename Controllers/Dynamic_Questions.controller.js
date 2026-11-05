import {
  createDynamicQuestionService,
  getDynamicQuestionByIdService,
  updateDynamicQuestionService,
  getAllDynamicQuestionService,
  deleteDynamicQuestionService,
  searchDynamicQuestionService,
  getAllDynamicQuestionByAssignmentIdService
} from '../Services/Dynamic_Questions.service.js';


export const createDynamicQuestionController = async (req, res) => {
  
  try {
    const academicyear = await createDynamicQuestionService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Dynamic Question');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getDynamicQuestionByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const academicyear = await getDynamicQuestionByIdService(id);

    req.log.info({ userId: req.user.id }, 'Dynamic Question fetched');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateDynamicQuestionController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const academicyear = await updateDynamicQuestionService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Dynamic Question updated');
    res.status(200).json(academicyear);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllDynamicQuestionController = async (req, res) => {
  

  try {
    const academicyears = await getAllDynamicQuestionService();

    req.log.info({ userId: req.user.id }, 'Dynamic Questions fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteDynamicQuestionController = async (req, res) => {
  

  try {
    const id = req.params.id
    const academicyears = await deleteDynamicQuestionService(id);

    req.log.info({ userId: req.user.id }, 'Dynamic Question deleted');
    res.status(200).json({ message: 'Dynamic Question deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchDynamicQuestionController = async (req, res) => {

  try {
    const query = req.query.query
    const academicyears = await searchDynamicQuestionService(query);

    req.log.info({ userId: req.user.id }, 'Dynamic Questions fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const getAllDynamicQuestionByAssignmentIdController = async (req, res) => {
  

  try {
    const id = req.params.assignment_id
    const academicyears = await getAllDynamicQuestionByAssignmentIdService(id);

    req.log.info({ userId: req.user.id }, 'Dynamic Questions fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};