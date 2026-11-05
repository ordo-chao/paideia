import {
  createSubmissionService,
  getSubmissionByIdService,
  updateSubmissionService,
  getAllSubmissionService,
  deleteSubmissionService,
  searchSubmissionService
} from '../Services/Submissions.service.js';


export const createSubmissionController = async (req, res) => {
  
  try {
    const submission = await createSubmissionService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Submission');
    res.status(200).json(submission);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getSubmissionByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const submission = await getSubmissionByIdService(id);

    req.log.info({ userId: req.user.id }, 'Submission fetched');
    res.status(200).json(submission);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateSubmissionController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const submission = await updateSubmissionService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Submission updated');
    res.status(200).json(submission);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllSubmissionController = async (req, res) => {
  

  try {
    const submissions = await getAllSubmissionService();

    req.log.info({ userId: req.user.id }, 'Submissions fetched');
    res.status(200).json(submissions);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteSubmissionController = async (req, res) => {
  

  try {
    const id = req.params.id
    const submission = await deleteSubmissionService(id);

    req.log.info({ userId: req.user.id }, 'Submission deleted');
    res.status(200).json({ message: 'Submission deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchSubmissionController = async (req, res) => {

  try {
    const query = req.query.name
    const submission = await searchSubmissionService(query);

    req.log.info({ userId: req.user.id }, 'Submissions fetched');
    res.status(200).json(submission);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}