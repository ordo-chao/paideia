import {
  createEnrollmentsService,
  getEnrollmentsByIdService,
  updateEnrollmentsService,
  getAllEnrollmentsService,
  deleteEnrollmentsService,
  searchEnrollmentsService,
  getEnrollmentsByClassStreamService,
  getEnrollmentsByStudentService
} from '../Services/Enrollments.service.js';


export const createEnrollmentsController = async (req, res) => {
  
  try {
    const enrollment = await createEnrollmentsService(req.body);

    req.log.info({ userId: req.user.id }, 'Created enrollment');
    res.status(200).json(enrollment);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getEnrollmentsByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const enrollment = await getEnrollmentsByIdService(id);

    req.log.info({ userId: req.user.id }, 'enrollment fetched');
    res.status(200).json(enrollment);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateEnrollmentsController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const enrollment = await updateEnrollmentsService(id, req.body);

    req.log.info({ userId: req.user.id }, 'enrollment updated');
    res.status(200).json(enrollment);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllEnrollmentsController = async (req, res) => {
  

  try {
    const enrollment = await getAllEnrollmentsService();

    req.log.info({ userId: req.user.id }, 'enrollment fetched');
    res.status(200).json(enrollment);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteEnrollmentsController = async (req, res) => {
  

  try {
    const id = req.params.id
    const enrollments = await deleteEnrollmentsService(id);

    req.log.info({ userId: req.user.id }, 'enrollment deleted');
    res.status(200).json({ message: 'enrollment deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchEnrollmentsController = async (req, res) => {

  try {
    const query = req.query.query
    const enrollments = await searchEnrollmentsService(query);

    req.log.info({ userId: req.user.id }, 'enrollments fetched');
    res.status(200).json(enrollments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const getEnrollmentsByClassStreamController = async (req, res) => {

  try {
    const id = req.params.class_stream_id
    const enrollments = await getEnrollmentsByClassStreamService(id);

    req.log.info({ userId: req.user.id }, 'enrollments fetched');
    res.status(200).json(enrollments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export const getEnrollmentsByStudentController = async (req, res) => {

  try {
    const id = req.params.student_id
    const enrollments = await getEnrollmentsByStudentService(id);

    req.log.info({ userId: req.user.id }, 'enrollments fetched');
    res.status(200).json(enrollments);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}