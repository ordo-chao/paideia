import {
  createTermRepository,
  getTermByIdRepository,
  updateTermRepository,
  getAllTermRepository,
  deleteTermRepository,
searchTermRepository,
} from '../Repositories/Terms.repository.js';

import {getAcademicYearByIdRepository} from '../Repositories/Academic_Years.repository.js'

export const createTermService = async (data) => {

    const {name , start_date , end_date , is_current , academic_year_id
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

    // check if Academic exists
    const academicyearexists = await getAcademicYearByIdRepository(academic_year_id);
    if(!academicyearexists) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    // Create Admin if user does exist
    const terms = await createTermRepository({name , start_date , end_date , is_current , academic_year_id});

    return terms;
}


export const getTermByIdService = async (id) => {

    const academicyear = await getTermByIdRepository(id);

    if(!academicyear) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    return academicyear;
}

export const updateTermService = async (id , data) => {
  const {name , start_date , end_date , is_current , academic_year_id} = data

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
    if( academic_year_id !== undefined) {
      const academicyearexists = await getAcademicYearByIdRepository(academic_year_id);
    if(!academicyearexists) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // check if Academic exists
    const termexist = await getTermByIdRepository(id);
    if(!termexist) {
      const err = new Error('Term not found');
      err.statusCode = 404;
      throw err;
    }

    const academicyear = await updateTermRepository(id , {name , start_date , end_date , is_current , academic_year_id});
    return academicyear;
}

export const getAllTermService = async () => {

    const academicyear = await getAllTermRepository();
    return academicyear;
}

export const deleteTermService = async (id) => {

  // check if Academic exists
  const termexist = await getTermByIdRepository(id);
  if(!termexist) {
    const err = new Error('Term not found');
    err.statusCode = 404;
    throw err;
  }

  const academicyear = await deleteTermRepository(id);
  return academicyear;
}

export const searchTermService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const academicyear = await searchTermRepository(query);
  return academicyear;
}
