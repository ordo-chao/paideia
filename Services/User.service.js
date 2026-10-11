import {
  createUserRepository,
  getUserByIdRepository,
  updateUserRepository,
  deleteUserRepository,
  getUserPasswordRepository,
  checkDeletedUserRepository,
  searchuserRepository,
  getUsersRepository
} from '../Repositories/User.repository.js';

import { comparePassword , hashPassword } from '../Utils/bcrypt.js';

export const createUserService = async (data) => {

    const {email , first_name ,last_name , phone , password , role , gender } = data


    // verify email 
    if (!email || !email.includes('@')) {
      const err =  new Error('Invalid email');
      err.statusCode = 400;
      throw err;
    }

    // verify gender 
    if (gender !== 'male' && gender !== 'female') {
      const err =  new Error('Invalid gender');
      err.statusCode = 400;
      throw err;
    }

    // verify role 
    if (role !== 'admin' && role !== 'teacher' && role !== 'student' && role !== 'parent' && role !== 'staff') {
      const err =  new Error('Invalid role');
      err.statusCode = 400;
      throw err;
    }

        // verify if a user exists
    const existing = await checkDeletedUserRepository(email);
  if (existing) {
    if (existing.deleted_at === null) {
      const err = new Error('User already exists');
      err.statusCode = 400;
      throw err;
    }

    // Strategy A: reject (simplest)
    const err = new Error('This email belongs to a deactivated account. Contact support.');
    err.statusCode = 409;
    throw err;

  //  TODO Strategy B: reactivate account
  }

    console.log(existing)

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user if user does not exist
    const user = await createUserRepository({email , first_name ,last_name , phone , password:hashedPassword , role , gender });

    // TODO: Send email to user

      const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
}

export const updateUserService = async (id, data) => {

    const {email , first_name ,last_name , phone   } = data

    // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err = new Error('User not found');
      err.statusCode = 400;
      throw err;
    }

    // Update user Details
    const user = await updateUserRepository(id, {email , first_name ,last_name , phone });

    // TODO: Send email to user
    return user;
}

export const deleteUserService = async (id) => {


      // verify if a user exists
    const existingUser = await getUserByIdRepository(id);
    if (!existingUser) {
      const err =  new Error('User already deleted');
      err.statusCode = 400;
      throw err;
    }

    // Delete user
    const user = await deleteUserRepository(id);

    // TODO: Send email to user
    return user;
}

export const loginUserService = async (email , password) => {

    const user = await getUserPasswordRepository(email);
     // 1. Check if user exists
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if password is not set and user is inactive
  if (user.password === null && user.active === false) {
    const error = new Error("Password not set up");
    error.statusCode = 400;
    throw error;
  }

  // 3. Verify password
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // 4. Mark user as active (and optionally update last_seen)
  if (!user.active) {
    user.active = true;
  }
  user.last_seen = new Date();
  await user.save({ hooks: false }); // skip hooks to avoid recursion/side-effects

  const { password: _, ...userWithoutPassword } = user.toJSON();

  return userWithoutPassword;
}

export const searchUserService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const users = await searchuserRepository(query);
  return users;
}

export const getUserService = async (id) => {
  const user = await getUserByIdRepository(id);
  return user;
}

export const getUsersService = async () => {

  // TODO: Add pagination
  const users = await getUsersRepository();
  return users;
}