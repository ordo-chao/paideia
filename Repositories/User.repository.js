import {Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createUserRepository = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    throw error;
  }
}

export const getUserByIdRepository = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw error;
  }
}


export const updateUserRepository = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(data);
    
    return user;
  } catch (error) {
    throw error;
  }
}

export const getUsersRepository = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}

export const deleteUserRepository = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    
    return user;
  } catch (error) {
    throw error;
  }
}


  export const getUserPasswordRepository = async (email) => {
  try {
    const user = await User.scope('withPassword').findOne({
    where: { email },
  });
  return user
  } catch (error) {
    throw error;    
  }
};

export const searchuserRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
    },
  });

  return users;
};

export const checkDeletedUserRepository = async (email) => {
  try {
    const user = await User.unscoped().findOne({ where: { email } }, { attributes: { include: ['password'] } })
  return user
  } catch (error) {
          const err =  new Error(error.message);
    throw err;
  }
}