import {
  createAssignmentService,
  getAssignmentByIdService,
  updateAssignmentService,
  getAllAssignmentService,
  deleteAssignmentService,
  searchAssignmentsService,
  getAllAssignmentsByTeacherIdService,
  getAllAssignmentsByClassSubjectIdService
} from '../Services/Assignments.service.js';


export const createAssignmentController = async (req, res) => {
  
  try {
    const assignment = await createAssignmentService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Assignment');
    res.status(200).json(assignment);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getAssignmentByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const assignment = await getAssignmentByIdService(id);

    req.log.info({ userId: req.user.id }, 'Assignment fetched');
    res.status(200).json(assignment);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateAssignmentController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const assignment = await updateAssignmentService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Assignment updated');
    res.status(200).json(assignment);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllAssignmentController = async (req, res) => {
  

  try {
    const assignments = await getAllAssignmentService();

    req.log.info({ userId: req.user.id }, 'Assignments fetched');
    res.status(200).json(assignments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteAssignmentController = async (req, res) => {
  

  try {
    const id = req.params.id
    const assignments = await deleteAssignmentService(id);

    req.log.info({ userId: req.user.id }, 'Assignment deleted');
    res.status(200).json({ message: 'Assignment deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchAssignmentsController = async (req, res) => {

  try {
    const query = req.query.query
    const assignments = await searchAssignmentsService(query);

    req.log.info({ userId: req.user.id }, 'Assignments fetched');
    res.status(200).json(assignments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const getAllAssignmentsByTeacherIdController = async (req, res) => {
  

  try {
    const id = req.params.teacher_id
    const assignments = await getAllAssignmentsByTeacherIdService(id);

    req.log.info({ userId: req.user.id }, 'Assignments fetched');
    res.status(200).json(assignments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getAllAssignmentsByClassSubjectIdController = async (req, res) => {
  

  try {
    const id = req.params.class_subject_id
    const assignments = await getAllAssignmentsByClassSubjectIdService(id);

    req.log.info({ userId: req.user.id }, 'Assignments fetched');
    res.status(200).json(assignments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};