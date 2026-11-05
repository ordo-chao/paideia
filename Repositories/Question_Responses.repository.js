import {QuestionResponses as QuestionResponse , Submissions as Submission , DynamicQuestions as DynamicQuestion , Students as Student , Assignments as Assignment , Users as User} from "../Models/index.js";
import { Op } from "sequelize";

export const createQuestionResponseRepository = async (data) => {
  try {
    const questionresponse = await QuestionResponse.create(data);
    return questionresponse;
  } catch (error) {
    throw error;
  }
}

export const getQuestionResponseByIdRepository = async (id) => {
  try {
    const questionresponse = await QuestionResponse.findByPk(id,{
      include: [
        { 
          model: Submission,
          as : 'submission',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: { exclude: ['created_at' , 'updated_at' , 'deleted_at' , 'id'] },
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
            }
          ]
         },
                 { 
          model: DynamicQuestion,
          as : 'question',
         },
      ],
      attributes: { exclude: ['question_id' , 'submission_id' , 'deleted_at'] }
    });
    return questionresponse;
  } catch (error) {
    throw error;
  }
}

export const updateQuestionResponseRepository = async (id, data) => {
  try {
    const questionresponse = await QuestionResponse.findByPk(id);
    if (!questionresponse) {
      throw new Error('question response not found');
    }

    await questionresponse.update(data);
    
    return questionresponse;
  } catch (error) {
    throw error;
  }
}

export const getAllQuestionResponseRepository = async () => {
  try {
    const  questionresponse = await QuestionResponse.findAll();
    return  questionresponse;
  } catch (error) {
    throw error;
  }
}

export const deleteQuestionResponseRepository = async (id) => {
  try {
    const questionresponse = await QuestionResponse.findByPk(id);
    if (!questionresponse) {
      throw new Error('questionresponse not found');
    }

    await questionresponse.destroy();
    
    return questionresponse;
  } catch (error) {
    throw error;
  }
}


export const searchQuestionResponseRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const questionresponse = await QuestionResponse.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return questionresponse;
};