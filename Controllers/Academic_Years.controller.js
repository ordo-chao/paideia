import {
  createAcademicYearService,
  getAcademicYearByIdService,
  updateAcademicYearService,
  getAllAcademicYearService,
  deleteAcademicYearService,
  searchAcademicYearService
} from '../Services/Academic_Years.service.js';


export const createAcademicYearController = async (req, res) => {
  
  try {
    const academicyear = await createAcademicYearService(req.body);

    req.log.info({ userId: req.user.id }, 'Created Academic Year');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


export const getAcademicYearByIdController = async (req, res) => {
  

  try {
    const id  = req.params.id
    const academicyear = await getAcademicYearByIdService(id);

    req.log.info({ userId: req.user.id }, 'Academic Year fetched');
    res.status(200).json(academicyear);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}


export const updateAcademicYearController = async (req, res) => {
  

  try {
    const id = req.params.id;
    const academicyear = await updateAcademicYearService(id, req.body);

    req.log.info({ userId: req.user.id }, 'Academic Year updated');
    res.status(200).json(academicyear);

  } catch (error) {
   req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



export const getAllAcademicYearController = async (req, res) => {
  

  try {
    const academicyears = await getAllAcademicYearService();

    req.log.info({ userId: req.user.id }, 'Academic Years fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteAcademicYearController = async (req, res) => {
  

  try {
    const id = req.params.id
    const academicyears = await deleteAcademicYearService(id);

    req.log.info({ userId: req.user.id }, 'Academic Year deleted');
    res.status(200).json({ message: 'Academic Year deleted successfully' });

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchAcademicYearController = async (req, res) => {

  try {
    const query = req.query.name
    const academicyears = await searchAcademicYearService(query);

    req.log.info({ userId: req.user.id }, 'Academic Years fetched');
    res.status(200).json(academicyears);

  } catch (error) {
    req.log.error({ err: error })
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}