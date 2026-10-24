import {Terms as Term} from "../Models/index.js";
import { Op } from "sequelize";

export const createTermRepository = async (data) => {
  try {
    const terms = await Term.create(data);
    return terms;
  } catch (error) {
    throw error;
  }
}

export const getTermByIdRepository = async (id) => {
  try {
    const terms = await Term.findByPk(id);
    return terms;
  } catch (error) {
    throw error;
  }
}

export const updateTermRepository = async (id, data) => {
  try {
    const terms = await Term.findByPk(id);
    if (!terms) {
      throw new Error('terms not found');
    }

    await terms.update(data);
    
    return terms;
  } catch (error) {
    throw error;
  }
}

export const getAllTermRepository = async () => {
  try {
    const  terms = await Term.findAll();
    return  terms;
  } catch (error) {
    throw error;
  }
}

export const deleteTermRepository = async (id) => {
  try {
    const terms = await Term.findByPk(id);
    if (!terms) {
      throw new Error('terms not found');
    }

    await terms.destroy();
    
    return terms;
  } catch (error) {
    throw error;
  }
}


export const searchTermRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const terms = await Term.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return terms;
};