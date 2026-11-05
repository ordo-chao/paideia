import {Submissions as Submission} from "../Models/index.js";
import { Op } from "sequelize";

export const createSubmissionRepository = async (data) => {
  try {
    const submission = await Submission.create(data);
    return submission;
  } catch (error) {
    throw error;
  }
}

export const getSubmissionByIdRepository = async (id) => {
  try {
    const submission = await Submission.findByPk(id , {
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
    return submission;
  } catch (error) {
    throw error;
  }
}

export const updateSubmissionRepository = async (id, data) => {
  try {
    const submission = await Submission.findByPk(id);
    if (!submission) {
      throw new Error('submission not found');
    }

    await submission.update(data);
    
    return submission;
  } catch (error) {
    throw error;
  }
}

export const getAllSubmissionRepository = async () => {
  try {
    const  submission = await Submission.findAll({
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
    return  submission;
  } catch (error) {
    throw error;
  }
}

export const deleteSubmissionRepository = async (id) => {
  try {
    const submission = await Submission.findByPk(id);
    if (!submission) {
      throw new Error('submission not found');
    }

    await submission.destroy();
    
    return submission;
  } catch (error) {
    throw error;
  }
}



export const searchSubmissionRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const submission = await Submission.findAll({
    where: {
      [Op.or]: [
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
    },
  });

  return submission;
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