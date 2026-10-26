import {
  createClassSubjectsRepository,
  getClassSubjectsByIdRepository,
  updateClassSubjectsRepository,
  getAllClassSubjectsRepository,
  deleteClassSubjectsRepository,
  searchClassSubjectsRepository,
} from '../Repositories/Class_Subjects.repository.js';

import { getSubjectsByIdRepository} from '../Repositories/Subjects.repository.js'
import {getClassStreamsByIdRepository} from '../Repositories/Class_Streams.repository.js'
import {getTeacherByIdRepository} from '../Repositories/Teachers.repository.js'

export const createClassSubjectsService = async (data) => {

    const {class_stream_id , subject_id , periods_per_week , teacher_id , minutes_per_period
     } = data

     console.log(data)

    // make sure level_order is a number
      if (typeof periods_per_week !== 'number') {
      const err = new Error('Invalid periods_per_week');
      err.statusCode = 400;
      throw err;
    }

    if (typeof minutes_per_period !== 'number') {
      const err = new Error('Invalid minutes_per_period');
      err.statusCode = 400;
      throw err;
    }

    // check if class level exists
    const classsteamexists = await getClassStreamsByIdRepository(class_stream_id);

    if(!classsteamexists) {
      const err = new Error('class stream not found');
      err.statusCode = 404;
      throw err;
    }

    console.log(classsteamexists)

    // check if academic level exists
    const subjectexist = await getSubjectsByIdRepository(subject_id);

    if(!subjectexist) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }
    console.log(subjectexist)

    const checkteacher = await getTeacherByIdRepository(teacher_id);
    if(!checkteacher) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }

    console.log(checkteacher)

    // Create Class level
    const classsubject = await createClassSubjectsRepository({class_stream_id , subject_id , periods_per_week , teacher_id , minutes_per_period });

    return classsubject;
}


export const getClassSubjectsByIdService = async (id) => {

    const classsubject = await getClassSubjectsByIdRepository(id);

    if(!classsubject) {
      const err = new Error('class subject not found');
      err.statusCode = 404;
      throw err;
    }

    return classsubject;
}

export const updateClassSubjectsService = async (id , data) => {

         const {class_stream_id , subject_id , periods_per_week , teacher_id 
     } = data


    // make sure level_order is a number
      if ( class_stream_id !== undefined && typeof periods_per_week !== 'number') {
      const err = new Error('Invalid periods_per_week');
      err.statusCode = 400;
      throw err;
    }

    // check if class level exists
    if(class_stream_id !== undefined) {
      const classsteamexists = await getClassStreamsByIdRepository(class_stream_id);

    if(!classsteamexists) {
      const err = new Error('class stream not found');
      err.statusCode = 404;
      throw err;
    }
    }

    if( subject_id !== undefined) {
      // check if academic level exists
    const subjectexist = await getSubjectsByIdRepository(subject_id);

    if(!subjectexist) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }
    }

    if(teacher_id !== undefined) {
          const checkteacher = await getTeacherByIdRepository(teacher_id);
    if(!checkteacher) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }
    }

    const classsubject = await updateClassSubjectsRepository(id , {class_stream_id , subject_id , periods_per_week , teacher_id });
    return classsubject;
}

export const getAllClassSubjectsService = async () => {

    const classsubject = await getAllClassSubjectsRepository();
    return classsubject;
}

export const deleteClassSubjectsService = async (id) => {

  // check if class stream exists
    const classsubjectexists = await getClassSubjectsByIdRepository(id);

    if(!classsubjectexists) {
      const err = new Error('class stream not found');
      err.statusCode = 404;
      throw err;
    }

  const classsubject = await deleteClassSubjectsRepository(id);
  return classsubject;
}

export const searchClassSubjectsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const classlevel = await searchClassSubjectsRepository(query);
  return classlevel;
}
