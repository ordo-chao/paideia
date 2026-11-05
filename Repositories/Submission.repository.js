import {Submissions as Submission , Assignments as Assignment , Users as User , Students as Student , ClassSubjects as ClassSubject , ClassStreams as ClassStream , Subjects as Subject , Teachers as Teacher} from "../Models/index.js";
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
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at' , 'id'] },
            }
          ]
        },
        {
          model: Assignment,
          as: 'assignment',
          attributes: { exclude: ['term_id' , 'teacher_id' , 'deleted_at'] },
          include: [
            {
              model: ClassSubject,
              as: 'classSubjects',
              attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
              include: [
                {
                  model: ClassStream,
                  as: 'classStream',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                },
                {
                  model: Subject,
                  as: 'subject',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                },
                {
                  model: Teacher,
                  as: 'teacher',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at' , 'id'] },
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
      attributes: { exclude: ['assignment_id' , 'student_id'] }
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
    const  submission = await Submission.findAll();
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
        { content: { [Op.iLike]: `%${query}%` } },
        { external_url: { [Op.iLike]: `%${query}%` } }
      ],
    },
  });

  return submission;
};

export const getAllSubmissionByAssignmentIdRepository = async (id) => {
  try {
    const submission = await Submission.findAll({
      where: {
        assignment_id: id
      },
            include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at' , 'id'] },
            }
          ]
        }
      ],
      attributes: { exclude: ['assignment_id' , 'student_id'] }
    });
    return submission;
  } catch (error) {
    throw error;
  }
}

export const getAllSubmissionByStudentIdRepository = async (id) => {
  try {
    const submission = await Submission.findAll({
      where: {
        student_id: id
      },
            include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: { exclude: ['term_id' , 'teacher_id' , 'deleted_at'] },
          include: [
            {
              model: ClassSubject,
              as: 'classSubjects',
              attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
              include: [
                {
                  model: ClassStream,
                  as: 'classStream',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                },
                {
                  model: Subject,
                  as: 'subject',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                },
                {
                  model: Teacher,
                  as: 'teacher',
                  attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] },
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at' , 'id'] },
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
      attributes: { exclude: ['assignment_id' , 'student_id'] }
    });
    return submission;
  } catch (error) {
    throw error;
}}

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