import {
  createDynamicQuestionRepository,
  getDynamicQuestionByIdRepository,
  updateDynamicQuestionRepository,
  getAllDynamicQuestionRepository,
  deleteDynamicQuestionRepository,
  searchDynamicQuestionRepository,
  getAllDynamicQuestionByAssignmentIdRepository
} from '../Repositories/Dynamic_Questions.repository.js';

import {
  getAssignmentByIdRepository,
} from '../Repositories/Assignments.repository.js';

export const createDynamicQuestionService = async (data) => {

    const {assignment_id , question_text , question_type , options,
      validation_rules , placeholder , help_text , is_required ,
      display_order , ask_timing , conditional_logic , is_admin_only , 
      correct_answer, points
     } = data

    
    //  check if assignment exists
    const assignmentexists = await getAssignmentByIdRepository(assignment_id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }

    // make sure that question_text , help_text , placeholder is string
    if (typeof question_text !== 'string' || typeof help_text !== 'string' || typeof placeholder !== 'string') {
      const err = new Error('Invalid question_text , help_text , placeholder');
      err.statusCode = 400;
      throw err;
    }

    // make sure that question_type 'text', 'textarea', 'number', 'email', 'phone', 'date', 'time','datetime', 'select', 'multiselect', 'radio', 'checkbox','checkboxes', 'file', 'rating', 'url'
    if (question_type !== 'text' && question_type !== 'textarea' && question_type !== 'number' && question_type !== 'email' && question_type !== 'phone' &&
      question_type !== 'date' && question_type !== 'time' && question_type !== 'datetime' && question_type !== 'select' && question_type !== 'multiselect' &&
      question_type !== 'radio' && question_type !== 'checkbox' && question_type !== 'checkboxes' && question_type !== 'file' && question_type !== 'rating' && question_type !== 'url') {
      const err = new Error('Invalid question_type');
      err.statusCode = 400;
      throw err;
    }

    // make sure that ask_timing is 'quiz' , 'before_registration', 'after_registration', 'after_event'
    if(ask_timing !== 'quiz' && ask_timing !== 'before_registration' && ask_timing !== 'after_registration' && ask_timing !== 'after_event') {
      const err = new Error('Invalid ask_timing');
      err.statusCode = 400;
      throw err;
    }

    // makse sure that is_required , is_active , is_admin_only
    if(is_required !== true && is_required !== false && is_admin_only !== true && is_admin_only !== false) {
      const err = new Error('Invalid is_required , is_active , is_admin_only');
      err.statusCode = 400;
      throw err;
    }

    // make sure that points , display_order
    if(typeof points !== 'number' || typeof display_order !== 'number') {
      const err = new Error('Invalid points or display_order');
      err.statusCode = 400;
      throw err;
    }

    // make sure that options , validation_rules , conditional_logic , correct_answer
    if(typeof options !== 'object' || typeof validation_rules !== 'object' || typeof conditional_logic !== 'object' || typeof correct_answer !== 'object') {
      const err = new Error('Invalid options , validation_rules , conditional_logic , correct_answer');
      err.statusCode = 400;
      throw err;
    }

    // Create Admin if user does exist
    const dynamic_question = await createDynamicQuestionRepository({assignment_id , question_text , question_type , options,
      validation_rules , placeholder , help_text , is_required ,
      display_order , ask_timing , conditional_logic , is_admin_only , 
      correct_answer, points});

    return dynamic_question;
}


export const getDynamicQuestionByIdService = async (id) => {

    const dynamic_question = await getDynamicQuestionByIdRepository(id);

    if(!dynamic_question) {
      const err = new Error('Dynamic Question not found');
      err.statusCode = 404;
      throw err;
    }

    return dynamic_question;
}

export const updateDynamicQuestionService = async (id , data) => {

    const {assignment_id , question_text , question_type , options,
      validation_rules , placeholder , help_text , is_required ,
      display_order , ask_timing , conditional_logic , is_admin_only , 
      correct_answer, points , is_active
     } = data

    
    //  check if assignment exists
    if(assignment_id !== undefined){
      const assignmentexists = await getAssignmentByIdRepository(assignment_id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // make sure that question_text , help_text , placeholder is string
    if ( question_text !== undefined && typeof question_text !== 'string' || help_text !== undefined && typeof help_text !== 'string' || placeholder !== undefined && typeof placeholder !== 'string') {
      const err = new Error('Invalid question_text , help_text , placeholder');
      err.statusCode = 400;
      throw err;
    }

    // make sure that question_type 'text', 'textarea', 'number', 'email', 'phone', 'date', 'time','datetime', 'select', 'multiselect', 'radio', 'checkbox','checkboxes', 'file', 'rating', 'url'
    if ( question_type !== undefined && question_type !== 'text' && question_type !== 'textarea' && question_type !== 'number' && question_type !== 'email' && question_type !== 'phone' &&
      question_type !== 'date' && question_type !== 'time' && question_type !== 'datetime' && question_type !== 'select' && question_type !== 'multiselect' &&
      question_type !== 'radio' && question_type !== 'checkbox' && question_type !== 'checkboxes' && question_type !== 'file' && question_type !== 'rating' && question_type !== 'url') {
      const err = new Error('Invalid question_type');
      err.statusCode = 400;
      throw err;
    }

    // make sure that ask_timing is 'quiz' , 'before_registration', 'after_registration', 'after_event'
    if(ask_timing !== undefined && ask_timing !== 'quiz' && ask_timing !== 'before_registration' && ask_timing !== 'after_registration' && ask_timing !== 'after_event') {
      const err = new Error('Invalid ask_timing');
      err.statusCode = 400;
      throw err;
    }

    // makse sure that is_required , is_active , is_admin_only are boolean
    if(is_required !== undefined && typeof is_required !== 'boolean' || is_admin_only !== undefined && typeof is_admin_only !== 'boolean' || is_active !== undefined && typeof is_active !== 'boolean') {
      const err = new Error('Invalid is_required , is_active , is_admin_only');
      err.statusCode = 400;
      throw err;
    }

    // make sure that points , display_order
    if( points !== undefined && typeof points !== 'number' || display_order !== undefined && typeof display_order !== 'number') {
      const err = new Error('Invalid points or display_order');
      err.statusCode = 400;
      throw err;
    }

    // make sure that options , validation_rules , conditional_logic , correct_answer
    if( options !== undefined && typeof options !== 'object' || validation_rules !== undefined && typeof validation_rules !== 'object' || conditional_logic !== undefined && typeof conditional_logic !== 'object' || correct_answer !== undefined && typeof correct_answer !== 'object') {
      const err = new Error('Invalid options , validation_rules , conditional_logic , correct_answer');
      err.statusCode = 400;
      throw err;
    }

        const dynamic_question_exists = await getDynamicQuestionByIdRepository(id);

    if(!dynamic_question_exists) {
      const err = new Error('Dynamic Question not found');
      err.statusCode = 404;
      throw err;
    }

    // Create Admin if user does exist
    const dynamic_question = await updateDynamicQuestionRepository(id ,{assignment_id , question_text , question_type , options,
      validation_rules , placeholder , help_text , is_required ,
      display_order , ask_timing , conditional_logic , is_admin_only , is_active , 
      correct_answer, points});

    return dynamic_question;
}

export const getAllDynamicQuestionService = async () => {

    const dynamic_question = await getAllDynamicQuestionRepository();
    return dynamic_question;
}

export const deleteDynamicQuestionService = async (id) => {

  // check if Academic exists
  const dynamic_question_exists = await getDynamicQuestionByIdRepository(id);
  if(!dynamic_question_exists) {
    const err = new Error('Academic Year not found');
    err.statusCode = 404;
    throw err;
  }

  const dynamic_question = await deleteDynamicQuestionRepository(id);
  return dynamic_question;
}

export const searchDynamicQuestionService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const dynamic_question = await searchDynamicQuestionRepository(query);
  return dynamic_question;
}


export const getAllDynamicQuestionByAssignmentIdService = async (id) => {

      //  check if assignment exists
    const assignmentexists = await getAssignmentByIdRepository(id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }

  const dynamic_question = await getAllDynamicQuestionByAssignmentIdRepository(id);
  return dynamic_question;
}