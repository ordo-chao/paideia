import {
  createTermService,
  getTermByIdService,
  updateTermService,
  getAllTermService,
  deleteTermService,
  searchTermService
} from '../Services/Term.service.js';


export const createTermController = async (req, res) => {
  
  try {
    const term = await createTermService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Term');
    res.status(200).json(term);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getTermByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const term = await getTermByIdService(id);

    req.log.info({ userId: req.user.id }, 'Term fetched');
    res.status(200).json(term);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateTermController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const term = await updateTermService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Term updated');
    res.status(200).json(term);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllTermController = async (req, res) => {
  

  try {
    const terms = await getAllTermService();

    req.log.info({ userId: req.user.id }, 'Terms fetched');
    res.status(200).json(terms);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteTermController = async (req, res) => {
  

  try {
    const id = req.params.id
    const terms = await deleteTermService(id);

    req.log.info({ userId: req.user.id }, 'Term deleted');
    res.status(200).json({ message: 'Term deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchTermController = async (req, res) => {

  try {
    const query = req.query.name
    const terms = await searchTermService(query);

    req.log.info({ userId: req.user.id }, 'Terms fetched');
    res.status(200).json(terms);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}