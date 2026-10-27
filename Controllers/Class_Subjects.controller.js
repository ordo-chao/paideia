import {
  createClassSubjectsService,
  getClassSubjectsByIdService,
  updateClassSubjectsService,
  getAllClassSubjectsService,
  deleteClassSubjectsService,
  searchClassSubjectsService
} from '../Services/Class_Subjects.service.js';


export const createClassSubjectsController = async (req, res) => {
  
  try {
    const classsubject = await createClassSubjectsService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Class subject');
    res.status(200).json(classsubject);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getClassSubjectsByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const classsubject = await getClassSubjectsByIdService(id);

    req.log.info({ userId: req.user.id }, 'Class subject fetched');
    res.status(200).json(classsubject);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateClassSubjectsController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const classsubject = await updateClassSubjectsService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Class subject updated');
    res.status(200).json(classsubject);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllClassSubjectsController = async (req, res) => {
  

  try {
    const ClassSubjects = await getAllClassSubjectsService();

    req.log.info({ userId: req.user.id }, 'Class subjects fetched');
    res.status(200).json(ClassSubjects);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteClassSubjectsController = async (req, res) => {
  

  try {
    const id = req.params.id
    const ClassSubjects = await deleteClassSubjectsService(id);

    req.log.info({ userId: req.user.id }, 'Class subject deleted');
    res.status(200).json({ message: 'Class subject deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchClassSubjectsController = async (req, res) => {

  try {
    const query = req.query.query
    const ClassSubjects = await searchClassSubjectsService(query);

    req.log.info({ userId: req.user.id }, 'Class subjects fetched');
    res.status(200).json(ClassSubjects);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}