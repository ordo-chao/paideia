import {
  createSubjectsService,
  getSubjectsByIdService,
  updateSubjectsService,
  getAllSubjectsService,
  deleteSubjectsService,
  searchSubjectsService
} from '../Services/Subjects.service.js';


export const createSubjectsController = async (req, res) => {
  
  try {
    const subject = await createSubjectsService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Subject');
    res.status(200).json(subject);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getSubjectsByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const subject = await getSubjectsByIdService(id);

    req.log.info({ userId: req.user.id }, 'Subject fetched');
    res.status(200).json(subject);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateSubjectsController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const subject = await updateSubjectsService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Subject updated');
    res.status(200).json(subject);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllSubjectsController = async (req, res) => {
  

  try {
    const subjects = await getAllSubjectsService();

    req.log.info({ userId: req.user.id }, 'Subjects fetched');
    res.status(200).json(subjects);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteSubjectsController = async (req, res) => {
  

  try {
    const id = req.params.id
    const subjects = await deleteSubjectsService(id);

    req.log.info({ userId: req.user.id }, 'Subject deleted');
    res.status(200).json({ message: 'Subject deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchSubjectsController = async (req, res) => {

  try {
    const query = req.query.query
    const subjects = await searchSubjectsService(query);

    req.log.info({ userId: req.user.id }, 'Subjects fetched');
    res.status(200).json(subjects);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}