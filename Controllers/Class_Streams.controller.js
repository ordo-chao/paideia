import {
  createClassStreamsService,
  getClassStreamsByIdService,
  updateClassStreamsService,
  getAllClassStreamsService,
  deleteClassStreamsService,
  searchClassStreamsService
} from '../Services/Class_Streams.service.js';


export const createClassStreamsController = async (req, res) => {
  
  try {
    const classstream = await createClassStreamsService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Class Stream');
    res.status(200).json(classstream);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getClassStreamsByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const classstream = await getClassStreamsByIdService(id);

    req.log.info({ userId: req.user.id }, 'Class Stream fetched');
    res.status(200).json(classstream);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateClassStreamsController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const classstream = await updateClassStreamsService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Class Stream updated');
    res.status(200).json(classstream);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllClassStreamsController = async (req, res) => {
  

  try {
    const classstreams = await getAllClassStreamsService();

    req.log.info({ userId: req.user.id }, 'Class Streams fetched');
    res.status(200).json(classstreams);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteClassStreamsController = async (req, res) => {
  

  try {
    const id = req.params.id
    const classstreams = await deleteClassStreamsService(id);

    req.log.info({ userId: req.user.id }, 'Class Stream deleted');
    res.status(200).json({ message: 'Class Stream deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchClassStreamsController = async (req, res) => {

  try {
    const query = req.query.query
    const classstreams = await searchClassStreamsService(query);

    req.log.info({ userId: req.user.id }, 'Class Streams fetched');
    res.status(200).json(classstreams);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}