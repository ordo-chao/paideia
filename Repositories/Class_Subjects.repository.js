import {ClassSubjects as ClassSubject , Teachers as Teacher , Users as User , Subjects as Subject , ClassStreams as ClassStream} from "../Models/index.js";
import { Op } from "sequelize";

export const createClassSubjectsRepository = async (data) => {
  try {
    const classstream = await ClassSubject.create(data);
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const getClassSubjectsByIdRepository = async (id) => {
  try {
    const classstream = await ClassSubject.findByPk(id,{
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassStream,
          as: 'classStream',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
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
      ],
      attributes: { exclude: ['class_stream_id','teacher_id','subject_id' ,'created_at' , 'updated_at' , 'deleted_at'] },
    });
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const updateClassSubjectsRepository = async (id, data) => {
  try {
    const classstream = await ClassSubject.findByPk(id);
    if (!classstream) {
      throw new Error('class level not found');
    }

    await classstream.update(data);
    
    return classstream;
  } catch (error) {
    throw error;
  }
}

export const getAllClassSubjectsRepository = async () => {
  try {
    const  classstream = await ClassSubject.findAll({
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassStream,
          as: 'classStream',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
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
      ],
      attributes: { exclude: ['class_stream_id','teacher_id','subject_id' ,'created_at' , 'updated_at' , 'deleted_at'] },
    });
    return  classstream;
  } catch (error) {
    throw error;
  }
}

export const deleteClassSubjectsRepository = async (id) => {
  try {
    const classstream = await ClassSubject.findByPk(id);
    if (!classstream) {
      throw new Error('class level not found');
    }

    await classstream.destroy();
    
    return classstream;
  } catch (error) {
    throw error;
  }
}


export const searchClassSubjectsRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const classstream = await ClassSubject.findAll({
where: {
  [Op.or]: [
    { '$classStream.name$':       { [Op.iLike]: `%${query}%` } },
    { '$classStream.full_name$':  { [Op.iLike]: `%${query}%` } },
    { '$classStream.room_number$':{ [Op.iLike]: `%${query}%` } },
    { '$subject.name$':           { [Op.iLike]: `%${query}%` } },
    { '$subject.code$':           { [Op.iLike]: `%${query}%` } },
    { '$teacher.user.first_name$':{ [Op.iLike]: `%${query}%` } },
    { '$teacher.user.last_name$': { [Op.iLike]: `%${query}%` } },
  ],
},
          include: [
        {
          model: Subject,
          as: 'subject',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
        {
          model: ClassStream,
          as: 'classStream',
          attributes: { 
            exclude: ['created_at' , 'updated_at' , 'deleted_at'],
           },
        },
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
      ],
    
      attributes: { 
            exclude: ['class_stream_id','teacher_id','subject_id' ,'created_at' , 'updated_at' , 'deleted_at'],
           },
  })

  return classstream;
};