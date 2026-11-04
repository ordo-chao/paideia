import {DynamicQuestions as DynamicQuestion} from "../Models/index.js";
import { Op } from "sequelize";

export const createDynamicQuestionRepository = async (data) => {
  try {
    const dynamic_question = await DynamicQuestion.create(data);
    return dynamic_question;
  } catch (error) {
    throw error;
  }
}

export const getDynamicQuestionByIdRepository = async (id) => {
  try {
    const dynamic_question = await DynamicQuestion.findByPk(id);
    return dynamic_question;
  } catch (error) {
    throw error;
  }
}

export const updateDynamicQuestionRepository = async (id, data) => {
  try {
    const dynamic_question = await DynamicQuestion.findByPk(id);
    if (!dynamic_question) {
      throw new Error('dynamic_question not found');
    }

    await dynamic_question.update(data);
    
    return dynamic_question;
  } catch (error) {
    throw error;
  }
}

export const getAllDynamicQuestionRepository = async () => {
  try {
    const  dynamic_question = await DynamicQuestion.findAll();
    return  dynamic_question;
  } catch (error) {
    throw error;
  }
}

export const deleteDynamicQuestionRepository = async (id) => {
  try {
    const dynamic_question = await DynamicQuestion.findByPk(id);
    if (!dynamic_question) {
      throw new Error('dynamic_question not found');
    }

    await dynamic_question.destroy();
    
    return dynamic_question;
  } catch (error) {
    throw error;
  }
}


export const searchDynamicQuestionRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const dynamic_question = await DynamicQuestion.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return dynamic_question;
};