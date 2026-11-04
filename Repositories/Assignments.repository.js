import {Assignments as Assignment , ClassSubjects as ClassSubject , Terms as Term , Teachers as Teacher , Users as User , ClassStreams as ClassStream , Subjects as Subject} from "../Models/index.js";
import { Op } from "sequelize";

export const createAssignmentRepository = async (data) => {
  try {
    const assignment = await Assignment.create(data);
    return assignment;
  } catch (error) {
    throw error;
  }
}

export const getAssignmentByIdRepository = async (id) => {
  try {
    const assignment = await Assignment.findByPk(id,{
      include: [
        { 
          model: ClassSubject, as: 'classSubjects',
            include: [
              { model: ClassStream, as: 'classStream', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
              { model: Subject, as: 'subject', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
            ],
          attributes: { exclude: ['teacher_id' , 'updated_at' , 'deleted_at'] }
         },
        { 
          model: Term, as: 'term' , 
          attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
        },
        {
         model: Teacher, as: 'teacher', 
          include: [
            { model: User, as: 'user'
              , attributes: { exclude: ['password' , 'id' , 'deleted_at'] }
             },
          ]
         },
      ],
      attributes: { exclude: ['class_subject_id' , 'term_id' , 'teacher_id'] }
    });
    return assignment;
  } catch (error) {
    throw error;
  }
}

export const updateAssignmentRepository = async (id, data) => {
  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      throw new Error('assignment not found');
    }

    await assignment.update(data);
    
    return assignment;
  } catch (error) {
    throw error;
  }
}

export const getAllAssignmentRepository = async () => {
  try {
    const  assignment = await Assignment.findAll({
      include: [
        { 
          model: ClassSubject, as: 'classSubjects',
            include: [
              { model: ClassStream, as: 'classStream', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
              { model: Subject, as: 'subject', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
            ],
          attributes: { exclude: ['teacher_id' , 'updated_at' , 'deleted_at'] }
         },
        { 
          model: Term, as: 'term' , 
          attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
        },
        {
         model: Teacher, as: 'teacher', 
          include: [
            { model: User, as: 'user'
              , attributes: { exclude: ['password' , 'id' , 'deleted_at'] }
             },
          ]
         },
      ],
      attributes: { exclude: ['class_subject_id' , 'term_id' , 'teacher_id'] }
    });
    return  assignment;
  } catch (error) {
    throw error;
  }
}

export const deleteAssignmentRepository = async (id) => {
  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      throw new Error('assignment not found');
    }

    await assignment.destroy();
    
    return assignment;
  } catch (error) {
    throw error;
  }
}



export const searchAssignmentRepository = async (query) => {
  if (!query) {
    const error = new Error('Search query is required');
    error.statusCode = 400;
    throw error;
  }

  const like = `%${query}%`;

  return Assignment.findAll({
    where: {
      [Op.or]: [
        { title:       { [Op.iLike]: like } },
        { description: { [Op.iLike]: like } },
        { instructions:{ [Op.iLike]: like } },
        { '$classSubjects.subject.name$': { [Op.iLike]: like } },
        { '$teacher.user.first_name$':    { [Op.iLike]: like } },
        { '$teacher.user.last_name$':     { [Op.iLike]: like } },
      ],
    },
    include: [
      {
        model: ClassSubject,
        as: 'classSubjects',
        required: false,              // LEFT JOIN — don't drop rows with no match
        include: [
          { model: Subject, as: 'subject', required: false,
            attributes: { exclude: ['created_at','updated_at','deleted_at'] } },
          { model: ClassStream, as: 'classStream', required: false,
            attributes: { exclude: ['created_at','updated_at','deleted_at'] } },
        ],
        attributes: { exclude: ['teacher_id','updated_at','deleted_at'] },
      },
      {
        model: Term, as: 'term', required: false,
        attributes: { exclude: ['created_at','updated_at','deleted_at'] },
      },
      {
        model: Teacher, as: 'teacher', required: false,
        include: [
          { model: User, as: 'user', required: false,
            attributes: { exclude: ['password','id','deleted_at'] } },
        ],
      },
    ],
    attributes: { exclude: ['class_subject_id','term_id','teacher_id'] },
    subQuery: false,                  // ✅ REQUIRED when filtering on nested columns
  });
};

export const getAllAssignmentsByTeacherId = async (teacherId) => {
  try {
    const assignments = await Assignment.findAll({
      where: { teacher_id: teacherId },
      include: [
        { 
          model: ClassSubject, as: 'classSubjects',
            include: [
              { model: ClassStream, as: 'classStream', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
              { model: Subject, as: 'subject', 
                attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
              },
            ],
          attributes: { exclude: ['teacher_id' , 'updated_at' , 'deleted_at'] }
         },
        { 
          model: Term, as: 'term' , 
          attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
        },
      ],
      attributes: { exclude: ['class_subject_id' , 'term_id' , 'teacher_id'] }
    });
    return  assignments;
  } catch (error) {
    throw error;
}}

export const getAllAssignmentsByClassSubjectId = async (classSubjectId) => {
  try {
    const assignments = await Assignment.findAll({
      where: { class_subject_id: classSubjectId },
      include: [
        { 
          model: Term, as: 'term' , 
          attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at'] }
        },
        {
         model: Teacher, as: 'teacher', 
          include: [
            { model: User, as: 'user'
              , attributes: { exclude: ['password' , 'id' , 'deleted_at'] }
             },
          ]
         },
      ],
      attributes: { exclude: ['class_subject_id' , 'term_id' , 'teacher_id'] }
    });
    return  assignments;
  } catch (error) {
    throw error;
        }
}

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