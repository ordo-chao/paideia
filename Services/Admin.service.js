import {
  createAdminRepository,
  getAdminByIdRepository,
  updateAdminRepository,
  getAllAdminRepository,
  deleteAdminRepository,
searchAdminRepository,
} from '../Repositories/Admins.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';

import {POSITIONS} from '../Config/permissions.js'


export const createAdminService = async (data) => {

    const {user_id , position  , office_number , date_of_birth , address , photo_url,
      start_date , end_date , qualification , specialization , employment_type , status
     } = data


     const permissions = POSITIONS[position].permissions

    // verify dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth) || !dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      const err = new Error('Invalid date format');
      err.statusCode = 400;
      throw err;
    }

    // if(qualification.Typeof !== 'string' || specialization.Typeof !== 'string' || employment_type.Typeof !== 'string' || position.Typeof !== 'string') {
    //   const err = new Error('Invalid data');
    //   err.statusCode = 400;
    //   throw err;
    // }

    // dates must be older than today and not future
    const today = new Date();
    const birthDate = new Date(date_of_birth);
    const startDate = new Date(start_date)
    if (birthDate > today || startDate > today) {
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

    // Create Admin if user does exist
    const Admin = await createAdminRepository({user_id , position:POSITIONS[position].label , permissions , office_number , date_of_birth , address , photo_url,
      start_date , end_date , qualification , specialization , employment_type , status});

    return Admin;
}

export const updateAdminService = async (id, data) => {

    const {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes  } = data

    // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err = new Error('Admin not found');
      err.statusCode = 400;
      throw err;
    }

    // Update user Details
    const Admin = await updateAdminRepository(id, {date_of_birth ,nationality , address , photo_url , enrollment_date , current_grade , status,
      allergies , medical_notes});

    // TODO: Send email to Admin
    return Admin;
}

export const deleteAdminService = async (id) => {


      // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err =  new Error('Admin already deleted');
      err.statusCode = 400;
      throw err;
    }

    // Delete user
    const Admin = await deleteAdminRepository(id);

    // TODO: Send email to user
    return Admin;
}

export const searchAdminService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const Admins = await searchAdminRepository(query);
  return Admins;
}

export const getAdminService = async (id) => {
  const Admin = await getAdminByIdRepository(id);
  return Admin;
}

export const getAdminsService = async () => {

  // TODO: Add pagination
  const Admins = await getAllAdminRepository();
  return Admins;
}