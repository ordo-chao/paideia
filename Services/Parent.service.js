import {
  createParentRepository,
  getParentByIdRepository,
  updateParentRepository,
  getParentsRepository,
  deleteParentRepository,
searchParentRepository
} from '../Repositories/Parents.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';


export const createParentService = async (data) => {

    const {user_id , relationship ,alternate_phone , occupation , alternate_email, address
     } = data

    // verify email 
    if (!alternate_email || !alternate_email.includes('@')) {
      const err =  new Error('Invalid email');
      err.statusCode = 400;
      throw err;
    }

    // verify status 
    if (relationship !== 'father' && relationship !== 'mother' && relationship !== 'guardian' ) {
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

    // Create Parent if user does exist
    const parent = await createParentRepository({user_id , relationship ,alternate_phone , occupation , alternate_email, address});

    return parent;
}

export const updateParentService = async (id, data) => {

    const {elationship ,alternate_phone , occupation , alternate_email, address  } = data

    // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err = new Error('Parent not found');
      err.statusCode = 400;
      throw err;
    }

    // Update user Details
    const parent = await updateParentRepository(id, {elationship ,alternate_phone , occupation , alternate_email, address});

    // TODO: Send email to Parent
    return parent;
}

export const deleteParentService = async (id) => {


      // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err =  new Error('Parent already deleted');
      err.statusCode = 400;
      throw err;
    }

    // Delete user
    const parent = await deleteParentRepository(id);

    // TODO: Send email to user
    return parent;
}

export const searchParentService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const parents = await searchParentRepository(query);
  return parents;
}

export const getParentService = async (id) => {
  const parent = await getParentByIdRepository(id);
  return parent;
}

export const getParentsService = async () => {

  // TODO: Add pagination
  const parents = await getParentsRepository();
  return parents;
}