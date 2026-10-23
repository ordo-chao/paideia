import {
  createAcademicYearRepository,
  getAcademicYearByIdRepository,
  updateAcademicYearRepository,
  getAllAcademicYearRepository,
  deleteAcademicYearRepository,
searchAcademicYearRepository,
} from '../Repositories/Academic_Years.repository.js';

export const createAcademicYearService = async (data) => {

    const {name , start_date , end_date , is_current
     } = data

    // verify dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      const err = new Error('Invalid date format');
      err.statusCode = 400;
      throw err;
    }


    // dates must be older than today and not future
    const today = new Date();
    const startDate = new Date(start_date)
    if (startDate > today) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }

    // make sure name is a string and is less than 55
    if (typeof name !== 'string' || name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

        // make sure is_current is a boolean
    if (typeof is_current !== 'boolean') {
      const err = new Error('Invalid is_current');
      err.statusCode = 400;
      throw err;
    }


    // Create Admin if user does exist
    const academicyear = await createAcademicYearRepository({name , start_date , end_date , is_current});

    return academicyear;
}


export const getAcademicYearByIdService = async (id) => {

    const academicyear = await getAcademicYearByIdRepository(id);

    if(!academicyear) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    return academicyear;
}

export const updateAcademicYearService = async (id , data) => {
  const {name , start_date , end_date , is_current} = data

      // verify dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if ( start_date !== undefined && end_date !== undefined &&  !dateRegex.test(start_date) &&  !dateRegex.test(end_date)) {
      const err = new Error('Invalid date format');
      err.statusCode = 400;
      throw err;
    }


    // dates must be older than today and not future
    const today = new Date();
    const startDate = new Date(start_date)
    if (startDate !== undefined && startDate > today) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }

    // make sure name is a string and is less than 55
    if (name !== undefined && typeof name !== 'string' && name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure is_current is a boolean
    if ( is_current !== undefined && typeof is_current !== 'boolean') {
      const err = new Error('Invalid is_current');
      err.statusCode = 400;
      throw err;
    }

    // check if user exists
    const academicyearexists = await getAcademicYearByIdRepository(id);
    if(!academicyearexists) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    const academicyear = await updateAcademicYearRepository(id , {name , start_date , end_date , is_current});
    return academicyear;
}

export const getAllAcademicYearService = async () => {

    const academicyear = await getAllAcademicYearRepository();
    return academicyear;
}

export const deleteAcademicYearService = async (id) => {

  // check if Academic exists
  const academicyearexists = await getAcademicYearByIdRepository(id);
  if(!academicyearexists) {
    const err = new Error('Academic Year not found');
    err.statusCode = 404;
    throw err;
  }

  const academicyear = await deleteAcademicYearRepository(id);
  return academicyear;
}

export const searchAcademicYearService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const academicyear = await searchAcademicYearRepository(query);
  return academicyear;
}
