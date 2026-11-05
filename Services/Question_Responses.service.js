import {
  createQuestionResponseRepository,
  getQuestionResponseByIdRepository,
  updateQuestionResponseRepository,
  getAllQuestionResponseRepository,
  deleteQuestionResponseRepository,
searchQuestionResponseRepository,
} from '../Repositories/Question_Responses.repository.js';

import {getDynamicQuestionByIdRepository} from '../Repositories/Dynamic_Questions.repository.js';
import {getSubmissionByIdRepository} from '../Repositories/Submission.repository.js';

export const createQuestionResponseService = async (data) => {

    const {question_id , submission_id , response_value , is_correct , awarded_points
     } = data

    //  check if question exists
    const questionexists = await getDynamicQuestionByIdRepository(question_id);
    if(!questionexists) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      throw err;
    }

    //  check if submission exists
    const submissionexists = await getSubmissionByIdRepository(submission_id);
    if(!submissionexists) {
      const err = new Error('Submission not found');
      err.statusCode = 404;
      throw err;
    }

    // check if response_value is an object
    if (typeof response_value !== 'object') {
      const err = new Error('Invalid response value');
      err.statusCode = 400;
      throw err;
    }

    // check if is_correct is a boolean
    if (typeof is_correct !== 'boolean') {
      const err = new Error('Invalid is_correct');
      err.statusCode = 400;
      throw err;
    }

    // check if awarded_points is a float
    if (typeof awarded_points !== 'number') {
      const err = new Error('Invalid awarded_points');
      err.statusCode = 400;
      throw err;
    }

    
    const questionresponse = await createQuestionResponseRepository({question_id , submission_id , response_value , is_correct , awarded_points});

    return questionresponse;
}


export const getQuestionResponseByIdService = async (id) => {

    const questionresponse = await getQuestionResponseByIdRepository(id);

    if(!questionresponse) {
      const err = new Error('Question Response not found');
      err.statusCode = 404;
      throw err;
    }

    return questionresponse;
}

export const updateQuestionResponseService = async (id , data) => {
    const {question_id , submission_id , response_value , is_correct , awarded_points
     } = data

    //  check if question exists
   if(question_id !== undefined){
     const questionexists = await getDynamicQuestionByIdRepository(question_id);
    if(!questionexists) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      throw err;
    }
   }

    //  check if submission exists
    if(submission_id !== undefined){
      const submissionexists = await getSubmissionByIdRepository(submission_id);
    if(!submissionexists) {
      const err = new Error('Submission not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // check if response_value is an object
    if ( response_value !== undefined && typeof response_value !== 'object') {
      const err = new Error('Invalid response value');
      err.statusCode = 400;
      throw err;
    }

    // check if is_correct is a boolean
    if ( is_correct !== undefined && typeof is_correct !== 'boolean') {
      const err = new Error('Invalid is_correct');
      err.statusCode = 400;
      throw err;
    }

    // check if awarded_points is a float
    if ( awarded_points !== undefined && typeof awarded_points !== 'float') {
      const err = new Error('Invalid awarded_points');
      err.statusCode = 400;
      throw err;
    }

      // check if question response exists
    const questionresponseexists = await getQuestionResponseByIdRepository(id);

    if(!questionresponseexists) {
      const err = new Error('Question Response not found');
      err.statusCode = 404;
      throw err;
    }

    
    const questionresponse = await updateQuestionResponseRepository(id , {question_id , submission_id , response_value , is_correct , awarded_points});

    return questionresponse;
}

export const getAllQuestionResponseService = async () => {

    const questionresponse = await getAllQuestionResponseRepository();
    return questionresponse;
}

export const deleteQuestionResponseService = async (id) => {

  // check if question response exists
    const questionresponseexists = await getQuestionResponseByIdRepository(id);

    if(!questionresponseexists) {
      const err = new Error('Question Response not found');
      err.statusCode = 404;
      throw err;
    }

  const questionresponse = await deleteQuestionResponseRepository(id);
  return questionresponse;
}

export const searchQuestionResponseService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const questionresponse = await searchQuestionResponseRepository(query);
  return questionresponse;
}
