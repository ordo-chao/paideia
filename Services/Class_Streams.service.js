import {
  createClassStreamsRepository,
  getClassStreamsByIdRepository,
  updateClassStreamsRepository,
  getAllClassStreamsRepository,
  deleteClassStreamsRepository,
  searchClassStreamsRepository,
} from '../Repositories/Class_Streams.repository.js';

import { getAcademicYearByIdRepository} from '../Repositories/Academic_Years.repository.js'
import {getClassLevelsByIdRepository} from '../Repositories/Class_Levels.repository.js'
import {getTeacherByIdRepository} from '../Repositories/Teachers.repository.js'

export const createClassStreamsService = async (data) => {

    const {class_level_id , academic_year_id , name , full_name , capacity , class_teacher_id , room_number
     } = data


    // make sure name is a string and is less than 55
    if (typeof name !== 'string' || name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if (typeof room_number !== 'string' || room_number.length > 55) {
      const err = new Error('Invalid room number');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 55
            if (typeof full_name !== 'string' || full_name.length > 255) {
      const err = new Error('Invalid full name');
      err.statusCode = 400;
      throw err;
    }

    // make sure level_order is a number
                if (typeof capacity !== 'number') {
      const err = new Error('Invalid capacity');
      err.statusCode = 400;
      throw err;
    }

    // check if class level exists
    const classlevelexists = await getClassLevelsByIdRepository(class_level_id);

    if(!classlevelexists) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }

    // check if academic level exists
    const academicyearexists = await getAcademicYearByIdRepository(academic_year_id);

    if(!academicyearexists) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    const checkteacher = await getTeacherByIdRepository(class_teacher_id);
    if(!checkteacher) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }



    // Create Class level
    const classstream = await createClassStreamsRepository({class_level_id , academic_year_id , name , full_name , capacity , class_teacher_id , room_number});

    return classstream;
}


export const getClassStreamsByIdService = async (id) => {

    const classstream = await getClassStreamsByIdRepository(id);

    if(!classstream) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }

    return classstream;
}

export const updateClassStreamsService = async (id , data) => {

      const {class_level_id , academic_year_id , name , full_name , capacity , class_teacher_id , room_number
     } = data


    // make sure name is a string and is less than 55
    if ( name !== undefined && typeof name !== 'string' && name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if ( room_number !== undefined && typeof room_number !== 'string' && room_number.length > 55) {
      const err = new Error('Invalid room number');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 55
            if ( full_name !== undefined && typeof full_name !== 'string' && full_name.length > 255) {
      const err = new Error('Invalid full name');
      err.statusCode = 400;
      throw err;
    }

    // make sure level_order is a number
                if ( capacity !== undefined && typeof capacity !== 'number') {
      const err = new Error('Invalid capacity');
      err.statusCode = 400;
      throw err;
    }

    // check if class level exists
    if(class_level_id !== undefined) {
      const classlevelexists = await getClassLevelsByIdRepository(class_level_id);
    if(!classlevelexists) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // check if academic level exists
    if(academic_year_id !== undefined) {
      const academicyearexists = await getAcademicYearByIdRepository(academic_year_id);
    if(!academicyearexists) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }
    }

    if(class_teacher_id !== undefined) {
          const checkteacher = await getTeacherByIdRepository(class_teacher_id);
    if(!checkteacher) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }
    }

    const classstream = await updateClassStreamsRepository(id , {class_level_id , academic_year_id , name , full_name , capacity , class_teacher_id , room_number});
    return classstream;
}

export const getAllClassStreamsService = async () => {

    const classstream = await getAllClassStreamsRepository();
    return classstream;
}

export const deleteClassStreamsService = async (id) => {

  // check if class stream exists
    const classstramexists = await getClassStreamsByIdRepository(id);

    if(!classstramexists) {
      const err = new Error('class stream not found');
      err.statusCode = 404;
      throw err;
    }

  const classstream = await deleteClassStreamsRepository(id);
  return classstream;
}

export const searchClassStreamsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const classlevel = await searchClassStreamsRepository(query);
  return classlevel;
}
