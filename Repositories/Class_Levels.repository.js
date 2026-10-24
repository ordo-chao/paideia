import {ClassLevels as ClassLevel} from "../Models/index.js";
import { Op } from "sequelize";

export const createClassLevelsRepository = async (data) => {
  try {
    const classlevels = await ClassLevel.create(data);
    return classlevels;
  } catch (error) {
    throw error;
  }
}

export const getClassLevelsByIdRepository = async (id) => {
  try {
    const classlevels = await ClassLevel.findByPk(id);
    return classlevels;
  } catch (error) {
    throw error;
  }
}

export const updateClassLevelsRepository = async (id, data) => {
  try {
    const classlevels = await ClassLevel.findByPk(id);
    if (!classlevels) {
      throw new Error('class level not found');
    }

    await classlevels.update(data);
    
    return classlevels;
  } catch (error) {
    throw error;
  }
}

export const getAllClassLevelsRepository = async () => {
  try {
    const  classlevels = await ClassLevel.findAll();
    return  classlevels;
  } catch (error) {
    throw error;
  }
}

export const deleteClassLevelsRepository = async (id) => {
  try {
    const classlevels = await ClassLevel.findByPk(id);
    if (!classlevels) {
      throw new Error('class level not found');
    }

    await classlevels.destroy();
    
    return classlevels;
  } catch (error) {
    throw error;
  }
}


export const searchClassLevelsRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const classlevels = await ClassLevel.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { curriculum: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return classlevels;
};