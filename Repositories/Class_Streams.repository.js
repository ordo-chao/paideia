import {ClassStreams as ClassStream , Teachers as Teacher , Users as User , AcademicYears as AcademicYear , ClassLevels as ClassLevel} from "../Models/index.js";
import { Op } from "sequelize";

export const createClassStreamsRepository = async (data) => {
  try {
    const classstream = await ClassStream.create(data);
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const getClassStreamsByIdRepository = async (id) => {
  try {
    const classstream = await ClassStream.findByPk(id ,{
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
      ],
      attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
    });
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const updateClassStreamsRepository = async (id, data) => {
  try {
    const classstream = await ClassStream.findByPk(id);
    if (!classstream) {
      throw new Error('class level not found');
    }

    await classstream.update(data);
    
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const getAllClassStreamsRepository = async () => {
  try {
    const  classstream = await ClassStream.findAll({
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
      ],
      attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
    });
    return  classstream;
  } catch (error) {
    throw error;
  }
}

export const deleteClassStreamsRepository = async (id) => {
  try {
    const classstream = await ClassStream.findByPk(id);
    if (!classstream) {
      throw new Error('class level not found');
    }

    await classstream.destroy();
    
    return classstream;
  } catch (error) {
    throw error;
  }
}


export const searchClassStreamsRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const classstream = await ClassStream.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { full_name: { [Op.iLike]: `%${query}%` } },
        { room_number: { [Op.iLike]: `%${query}%` } },
      ],
    },
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
      ],
      attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
  })

  return classstream;
};