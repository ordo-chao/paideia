import {Enrollments as Enrollment , Students as Student , ClassStreams as ClassStream , Teachers as Teacher , Users as User , AcademicYears as AcademicYear , ClassLevels as ClassLevel} from "../Models/index.js";
import { Op } from "sequelize";

export const createEnrollmentsRepository = async (data) => {
  try {
    const enrollments = await Enrollment.create(data);
    return enrollments;
  } catch (error) {
    throw error;
  }
}

export const getEnrollmentsByIdRepository = async (id) => {
  try {
    const enrollments = await Enrollment.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          include:{
            model: User,
            as: 'user',
            attributes: { exclude: ['password' , 'id' , 'role' , 'deleted_at'] },
          }
        },
        {
          model: ClassStream,
          as: 'classStream',
                include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
          include: [
           {
          model: User,
          as: 'user',
          attributes: { 
            exclude: ['id' , 'last_seen' ,'created_at' , 'updated_at' , 'deleted_at' , 'password'],
           },
        },
          ]
        },
        {
          model: AcademicYear,
          as: 'academicYears',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassLevel,
          as: 'classLevel',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        }
      ]
          
        },
      ],
      attributes: { exclude: ['student_id' , 'class_stream_id'] },
    });
    return enrollments;
  } catch (error) {
    throw error;
  }
}

export const updateEnrollmentsRepository = async (id, data) => {
  try {
    const enrollments = await Enrollment.findByPk(id);
    if (!enrollments) {
      throw new Error('enrollments not found');
    }

    await enrollments.update(data);
    
    return enrollments;
  } catch (error) {
    throw error;
  }
}

export const getAllEnrollmentsRepository = async () => {
  try {
    const  enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          include:{
            model: User,
            as: 'user',
            attributes: { exclude: ['password' , 'id' , 'role' , 'deleted_at'] },
          }
        },
        {
          model: ClassStream,
          as: 'classStream',
                          include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
          include: [
           {
          model: User,
          as: 'user',
          attributes: { 
            exclude: ['id' , 'last_seen' ,'created_at' , 'updated_at' , 'deleted_at' , 'password'],
           },
        },
          ]
        },
        {
          model: AcademicYear,
          as: 'academicYears',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassLevel,
          as: 'classLevel',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        }
      ]
        },
      ],
      attributes: { exclude: ['student_id' , 'class_stream_id'] },
    });
    return  enrollments;
  } catch (error) {
    throw error;
  }
}

export const deleteEnrollmentsRepository = async (id) => {
  try {
    const enrollments = await Enrollment.findByPk(id);
    if (!enrollments) {
      throw new Error('subject not found');
    }

    await enrollments.destroy();
    
    return enrollments;
  } catch (error) {
    throw error;
  }
}


export const searchEnrollmentsRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const enrollments = await Enrollment.findAll({
    where: {
      [Op.or]: [
        { code: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return enrollments;
};

export const getEnrollmentsByClassStreamRepository = async (id) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        class_stream_id: id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          include:{
            model: User,
            as: 'user',
            attributes: { exclude: ['password' , 'id' , 'role' , 'deleted_at'] },
          }
        },
      ],
      attributes: { exclude: ['student_id' , 'class_stream_id'] },
    });
    return enrollments;
  } catch (error) {
    throw error;
  }
}

export const getEnrollmentsByStudentRepository = async (id) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        student_id: id,
      },
      include: [
        {
          model: ClassStream,
          as: 'classStream',
                          include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
          include: [
           {
          model: User,
          as: 'user',
          attributes: { 
            exclude: ['id' , 'last_seen' ,'created_at' , 'updated_at' , 'deleted_at' , 'password'],
           },
        },
          ]
        },
        {
          model: AcademicYear,
          as: 'academicYears',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassLevel,
          as: 'classLevel',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        }
      ]
        },
      ],
      attributes: { exclude: ['student_id' , 'class_stream_id'] },
    });
    return enrollments;
  } catch (error) {
    throw error;
  }
}