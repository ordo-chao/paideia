import {Parents as Parent , Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createParentRepository = async (data) => {
  try {
    const parent = await Parent.create(data);
    return parent;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getParentByIdRepository = async (id) => {
  try {
    const parent = await Parent.findByPk(id , {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { 
            exclude: ['password'],
            include: ['email']
           },
        },
      ],
      attributes: { exclude: ['user_id'] },
      raw: true
    });
    return parent;
  } catch (error) {
    throw error;
  }
}


export const updateParentRepository = async (id, data) => {
  try {
    const parent = await Parent.findByPk(id);
    if (!Parent) {
      throw new Error('Parent not found');
    }

    await parent.update(data);
    
    return parent;
  } catch (error) {
    throw error;
  }
}

export const getParentsRepository = async () => {
  try {
    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: { 
            exclude: ['password'],
            include: ['email']
           },
        },
      ],
      attributes: { exclude: ['user_id'] },
      raw: true
    });
    return parents;
  } catch (error) {
    throw error;
  }
}

export const deleteParentRepository = async (id) => {
  try {
    const parent = await Parent.findByPk(id);
    if (!Parent) {
      throw new Error('Parent not found');
    }

    await Parent.destroy();
    
    return parent;
  } catch (error) {
    throw error;
  }
}



export const searchParentRepository = async (query) => {
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
      role: 'Parent'
    },
    include: {
      model: Parent,
      as: 'Parent',
    },
  });

  return users;
};

// export const checkDeletedUserRepository = async (email) => {
//   try {
//     const user = await User.unscoped().findOne({
//       where: { email },
//       attributes: { include: ['password'] },
//       paranoid: false              // ✅ THIS is what includes soft-deleted rows
//     });
//     return user;
//   } catch (error) {
//     const err = new Error(error.message);
//     throw err;
//   }
// };