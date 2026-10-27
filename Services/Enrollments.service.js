import {
  createEnrollmentsRepository,
  getEnrollmentsByIdRepository,
  updateEnrollmentsRepository,
  getAllEnrollmentsRepository,
  deleteEnrollmentsRepository,
  searchEnrollmentsRepository,
  getEnrollmentsByClassStreamRepository,
  getEnrollmentsByStudentRepository
} from '../Repositories/Enrollments.repository.js';

import { getStudentByIdRepository} from '../Repositories/Students.repository.js';
import { getClassStreamsByIdRepository} from '../Repositories/Class_Streams.repository.js';

export const createEnrollmentsService = async (data) => {

    const {student_id , class_stream_id
     } = data

     const checkstudentexists = await getStudentByIdRepository(student_id);
     if(!checkstudentexists) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }


    const checkclassstreamexists = await getClassStreamsByIdRepository(class_stream_id);
    if(!checkclassstreamexists) {
      const err = new Error('Class Stream not found');
      err.statusCode = 404;
      throw err;
    }
   

    // Create subject
    const enrollment = await createEnrollmentsRepository({student_id , class_stream_id});

    return enrollment;
}


export const getEnrollmentsByIdService = async (id) => {

    const enrollment = await getEnrollmentsByIdRepository(id);

    if(!enrollment) {
      const err = new Error('enrollment not found');
      err.statusCode = 404;
      throw err;
    }

    return enrollment;
}

export const updateEnrollmentsService = async (id , data) => {

         const {student_id , class_stream_id , status
     } = data

     if(student_id !== undefined) {
      const checkstudentexists = await getStudentByIdRepository(student_id);
     if(!checkstudentexists) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }
     }


    if( class_stream_id !== undefined) {
      const checkclassstreamexists = await getClassStreamsByIdRepository(class_stream_id);
    if(!checkclassstreamexists) {
      const err = new Error('Class Stream not found');
      err.statusCode = 404;
      throw err;
    }
    }

    if( status !== undefined &&  status !== 'active' && status !== 'inactive' && status !== 'completed' ) {
      const err = new Error('Invalid status');
      err.statusCode = 400;
      throw err;
    }

    console.log(data);

    const enrollment = await updateEnrollmentsRepository(id , {student_id , class_stream_id , status});
    return enrollment;
}

export const getAllEnrollmentsService = async () => {

    const enrollmentS = await getAllEnrollmentsRepository();
    return enrollmentS;
}

export const deleteEnrollmentsService = async (id) => {

  // check if class stream exists
    const enrollmentexists = await getEnrollmentsByIdRepository(id);

    if(!enrollmentexists) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }

  const enrollment = await deleteEnrollmentsRepository(id);
  return enrollment;
}

export const searchEnrollmentsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const classlevel = await searchEnrollmentsRepository(query);
  return classlevel;
}

export const getEnrollmentsByClassStreamService = async (id) => {

      const checkclassstreamexists = await getClassStreamsByIdRepository(id);
    if(!checkclassstreamexists) {
      const err = new Error('Class Stream not found');
      err.statusCode = 404;
      throw err;
    }
  const classlevel = await getEnrollmentsByClassStreamRepository(id);
  return classlevel;
}

export const getEnrollmentsByStudentService = async (id) => {

       const checkstudentexists = await getStudentByIdRepository(id);
     if(!checkstudentexists) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }

  const classlevel = await getEnrollmentsByStudentRepository(id);
  return classlevel;
}