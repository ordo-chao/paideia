import {Subjects as Subject} from "../Models/index.js";
import { Op } from "sequelize";

export const createSubjectsRepository = async (data) => {
  try {
    const subjects = await Subject.create(data);
    return subjects;
  } catch (error) {
    throw error;
  }
}

export const getSubjectsByIdRepository = async (id) => {
  try {
    const subjects = await Subject.findByPk(id);
    return subjects;
  } catch (error) {
    throw error;
  }
}

export const updateSubjectsRepository = async (id, data) => {
  try {
    const subjects = await Subject.findByPk(id);
    if (!subjects) {
      throw new Error('subjects not found');
    }

    await subjects.update(data);
    
    return subjects;
  } catch (error) {
    throw error;
  }
}

export const getAllSubjectsRepository = async () => {
  try {
    const  subjects = await Subject.findAll();
    return  subjects;
  } catch (error) {
    throw error;
  }
}

export const deleteSubjectsRepository = async (id) => {
  try {
    const subjects = await Subject.findByPk(id);
    if (!subjects) {
      throw new Error('subject not found');
    }

    await subjects.destroy();
    
    return subjects;
  } catch (error) {
    throw error;
  }
}


export const searchSubjectsRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const subjects = await Subject.findAll({
    where: {
      [Op.or]: [
        { code: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return subjects;
};