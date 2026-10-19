import {
  createStudentRepository,
  getStudentByIdRepository,
  updateStudentRepository,
  getStudentsRepository,
  deleteStudentRepository,
searchStudentRepository,
  getParentsRepository
} from '../Repositories/Students.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';


export const createStudentService = async (data) => {

    const {user_id , date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes
     } = data


    // verify dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth) || !dateRegex.test(enrollment_date)) {
      const err = new Error('Invalid date format');
      err.statusCode = 400;
      throw err;
    }

    // dates must be older than today and not future
    const today = new Date();
    const birthDate = new Date(date_of_birth);
    const enrollmentDate = new Date(enrollment_date);
    if (birthDate > today || enrollmentDate > today) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }

    // verify status 
    if (status !== 'active' && status !== 'suspended' && status !== 'graduated' && status !== 'transferred' && status !== 'dropped') {
      const err =  new Error('Invalid status');
      err.statusCode = 400;
      throw err;
    }

    // verify user_id
    const check_user = await getUserByIdRepository(user_id);
    if (!check_user) {
      const err = new Error('User not found');
      err.statusCode = 400;
      throw err;
    }

    // Create student if user does exist
    const student = await createStudentRepository({user_id , date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes});

    return student;
}

export const updateStudentService = async (id, data) => {

    const {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes  } = data

    // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err = new Error('Student not found');
      err.statusCode = 400;
      throw err;
    }

    // Update user Details
    const student = await updateStudentRepository(id, {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes});

    // TODO: Send email to student
    return student;
}

export const deleteStudentService = async (id) => {


      // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err =  new Error('Student already deleted');
      err.statusCode = 400;
      throw err;
    }

    // Delete user
    const student = await deleteStudentRepository(id);

    // TODO: Send email to user
    return student;
}

export const searchStudentService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const students = await searchStudentRepository(query);
  return students;
}

export const getStudentService = async (id) => {
  const student = await getStudentByIdRepository(id);
  return student;
}

export const getStudentsService = async () => {

  // TODO: Add pagination
  const students = await getStudentsRepository();
  return students;
}

export const getParentsService = async (id) => {
  const parents = await getParentsRepository(id);
  return parents;
}