import {Students as Student , Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createStudentRepository = async (data) => {
  try {
    const student = await Student.create(data);
    return student;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getStudentByIdRepository = async (id) => {
  try {
    const student = await Student.findByPk(id , {
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
    return student;
  } catch (error) {
    throw error;
  }
}


export const updateStudentRepository = async (id, data) => {
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      throw new Error('Student not found');
    }

    await student.update(data);
    
    return student;
  } catch (error) {
    throw error;
  }
}

export const getStudentsRepository = async () => {
  try {
    const students = await Student.findAll({
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
    return students;
  } catch (error) {
    throw error;
  }
}

export const deleteStudentRepository = async (id) => {
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      throw new Error('Student not found');
    }

    await student.destroy();
    
    return student;
  } catch (error) {
    throw error;
  }
}



export const searchStudentRepository = async (query) => {
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
      role: 'student'
    },
    include: {
      model: Student,
      as: 'student',
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