import {
  createQuestionResponseService,
  getQuestionResponseByIdService,
  updateQuestionResponseService,
  getAllQuestionResponseService,
  deleteQuestionResponseService,
  searchQuestionResponseService
} from '../Services/Question_Responses.service.js';


export const createQuestionResponseController = async (req, res) => {
  
  try {
    const questionresponse = await createQuestionResponseService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Question Response');
    res.status(200).json(questionresponse);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getQuestionResponseByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const questionresponse = await getQuestionResponseByIdService(id);

    req.log.info({ userId: req.user.id }, 'Question Response fetched');
    res.status(200).json(questionresponse);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateQuestionResponseController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const questionresponse = await updateQuestionResponseService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Question Response updated');
    res.status(200).json(questionresponse);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllQuestionResponseController = async (req, res) => {
  

  try {
    const questionresponses = await getAllQuestionResponseService();

    req.log.info({ userId: req.user.id }, 'Question Responses fetched');
    res.status(200).json(questionresponses);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteQuestionResponseController = async (req, res) => {
  

  try {
    const id = req.params.id
    const questionresponses = await deleteQuestionResponseService(id);

    req.log.info({ userId: req.user.id }, 'Question Response deleted');
    res.status(200).json({ message: 'Question Response deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchQuestionResponseController = async (req, res) => {

  try {
    const query = req.query.name
    const questionresponses = await searchQuestionResponseService(query);

    req.log.info({ userId: req.user.id }, 'Question Responses fetched');
    res.status(200).json(questionresponses);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}