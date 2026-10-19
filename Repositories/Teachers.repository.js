import {Teachers as Teacher , Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createTeacherRepository = async (data) => {
  try {
    const teacher = await Teacher.create(data);
    return teacher;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getTeacherByIdRepository = async (id) => {
  try {
    const teacher = await Teacher.findByPk(id , {
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
    return teacher;
  } catch (error) {
    throw error;
  }
}

export const getTeacherByTSCRepository = async (tsc) => {
  try {
    const teacher = await Teacher.findOne({
      where: {
        employee_id: tsc
      }
    });
    return teacher;
  } catch (error) {
    throw error;
  }
}


export const updateTeacherRepository = async (id, data) => {
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    await teacher.update(data);
    
    return teacher;
  } catch (error) {
    throw error;
  }
}

export const getTeachersRepository = async () => {
  try {
    const teachers = await Teacher.findAll({
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
    return teachers;
  } catch (error) {
    throw error;
  }
}

export const deleteTeacherRepository = async (id) => {
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    await teacher.destroy();
    
    return teacher;
  } catch (error) {
    throw error;
  }
}



export const searchTeacherRepository = async (query) => {
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
      role: 'teacher'
    },
    include: {
      model: Teacher,
      as: 'Teacher',
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