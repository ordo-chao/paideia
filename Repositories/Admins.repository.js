import {Admins as Admin  , Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createAdminRepository = async (data) => {
  try {
    const admin = await Admin.create(data);
    return admin;
  } catch (error) {
    throw error;
  }
}

export const getAdminByIdRepository = async (id) => {
  try {
    const admin = await Admin.findByPk(id , {
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
    return admin;
  } catch (error) {
    throw error;
  }
}

export const updateAdminRepository = async (id, data) => {
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      throw new Error('admin not found');
    }

    await admin.update(data);
    
    return admin;
  } catch (error) {
    throw error;
  }
}

export const getAllAdminRepository = async () => {
  try {
    const  admins = await Admin.findAll({
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
      attributes: { exclude: ['user_id' , 'permissions'] },
      raw: true
    });
    return  admins;
  } catch (error) {
    throw error;
  }
}

export const deleteAdminRepository = async (id) => {
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      throw new Error('admin not found');
    }

    await admin.destroy();
    
    return admin;
  } catch (error) {
    throw error;
  }
}



export const searchAdminRepository = async (query) => {
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
      role: 'admin'
    },
    include: {
      model: Admin,
      as: 'Admin',
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