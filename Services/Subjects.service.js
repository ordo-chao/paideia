import {
  createSubjectsRepository,
  getSubjectsByIdRepository,
  updateSubjectsRepository,
  getAllSubjectsRepository,
  deleteSubjectsRepository,
  searchSubjectsRepository,
} from '../Repositories/Subjects.repository.js';

export const createSubjectsService = async (data) => {

    const {code , description , name , type
     } = data


    // make sure name is a string and is less than 55
    if (typeof name !== 'string' || name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if (typeof code !== 'string' || code.length > 15) {
      const err = new Error('Invalid code');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 255
            if (typeof description !== 'string' || description.length > 255) {
      const err = new Error('Invalid description');
      err.statusCode = 400;
      throw err;
    }

    if(type !== 'core' && type !== 'elective') {
      const err = new Error('Invalid type');
      err.statusCode = 400;
      throw err;
    }

    // Create subject
    const subject = await createSubjectsRepository({code , description , name , type});

    return subject;
}


export const getSubjectsByIdService = async (id) => {

    const subject = await getSubjectsByIdRepository(id);

    if(!subject) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }

    return subject;
}

export const updateSubjectsService = async (id , data) => {

      const {code , description , name , type
     } = data


    // make sure name is a string and is less than 55
    if ( name !== undefined && typeof name !== 'string' && name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if ( code !== undefined && typeof code !== 'string' && code.length > 15) {
      const err = new Error('Invalid code');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 55
            if ( description !== undefined && typeof description !== 'string' && description.length > 255) {
      const err = new Error('Invalid description');
      err.statusCode = 400;
      throw err;
    }

    // make sure type is either core or elective
        if( type !== undefined && type !== 'core' && type !== 'elective') {
      const err = new Error('Invalid type');
      err.statusCode = 400;
      throw err;
    }

    const subject = await updateSubjectsRepository(id , {code , description , name , type});
    return subject;
}

export const getAllSubjectsService = async () => {

    const subject = await getAllSubjectsRepository();
    return subject;
}

export const deleteSubjectsService = async (id) => {

  // check if class stream exists
    const classstramexists = await getSubjectsByIdRepository(id);

    if(!classstramexists) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }

  const classstream = await deleteSubjectsRepository(id);
  return classstream;
}

export const searchSubjectsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const classlevel = await searchSubjectsRepository(query);
  return classlevel;
}
