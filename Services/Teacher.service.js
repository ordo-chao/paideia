import {
  createTeacherRepository,
  getTeacherByIdRepository,
  updateTeacherRepository,
  getTeachersRepository,
  deleteTeacherRepository,
searchTeacherRepository,
getTeacherByTSCRepository
} from '../Repositories/Teachers.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';


export const createTeacherService = async (data) => {

    const {user_id , employee_id , date_of_birth , address , photo_url,
      start_date , end_date , qualification , specialization , employment_type , status
     } = data

    // verify dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth) || !dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      const err = new Error('Invalid date format');
      err.statusCode = 400;
      throw err;
    }

    // if(qualification.Typeof !== 'string' || specialization.Typeof !== 'string' || employment_type.Typeof !== 'string' || employee_id.Typeof !== 'string') {
    //   const err = new Error('Invalid data');
    //   err.statusCode = 400;
    //   throw err;
    // }

    // dates must be older than today and not future
    const today = new Date();
    const birthDate = new Date(date_of_birth);
    const startDate = new Date(start_date)
    const endDate = new Date(end_date);
    if (birthDate > today || endDate > today || startDate > today) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }

    // verify status 
    if (status !== 'active' && status !== 'transferred' && status !== 'retired' && status !== 'fired') {
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

    // Create Teacher if user does exist
    const Teacher = await createTeacherRepository({user_id , employee_id , date_of_birth , address , photo_url,
      start_date , end_date , qualification , specialization , employment_type , status});

    return Teacher;
}

export const updateTeacherService = async (id, data) => {

    const {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes  } = data

    // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err = new Error('Teacher not found');
      err.statusCode = 400;
      throw err;
    }

    // Update user Details
    const teacher = await updateTeacherRepository(id, {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes});

    // TODO: Send email to Teacher
    return teacher;
}

export const deleteTeacherService = async (id) => {


      // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err =  new Error('Teacher already deleted');
      err.statusCode = 400;
      throw err;
    }

    // Delete user
    const teacher = await deleteTeacherRepository(id);

    // TODO: Send email to user
    return teacher;
}

export const searchTeacherService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const teachers = await searchTeacherRepository(query);
  return teachers;
}

export const getTeacherService = async (id) => {
  const teacher = await getTeacherByIdRepository(id);
  return teacher;
}

export const getTeacherByTSCService = async (tsc) => {
  const teacher = await getTeacherByTSCRepository(tsc);
  return teacher;
}

export const getTeachersService = async () => {

  // TODO: Add pagination
  const teachers = await getTeachersRepository();
  return teachers;
}