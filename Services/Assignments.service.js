import {
  createAssignmentRepository,
  getAssignmentByIdRepository,
  updateAssignmentRepository,
  getAllAssignmentRepository,
  deleteAssignmentRepository,
searchAssignmentRepository,
getAllAssignmentsByTeacherId,
getAllAssignmentsByClassSubjectId
} from '../Repositories/Assignments.repository.js';

import {
  getTermByIdRepository,
} from '../Repositories/Terms.repository.js';

import {
  getClassSubjectsByIdRepository,
} from '../Repositories/Class_Subjects.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';


export const createAssignmentService = async (data) => {

    const {class_subject_id , term_id , teacher_id , title ,
      description , instructions , assignment_type , submission_mode,
      max_score , weight , passing_score , assigned_on , available_from,
      due_date , available_until , allow_late_submission , allow_resubmission,
      max_attempts , is_graded , is_team_assignment , quiz_config , status
     } = data

    //  check if class subject exists
    const classsubjectexists = await getClassSubjectsByIdRepository(class_subject_id);
    if(!classsubjectexists) {
      const err = new Error('Class Subject not found');
      err.statusCode = 404;
      throw err;
    }

    // check if term exists
    const termexist = await getTermByIdRepository(term_id);
    if(!termexist) {
      const err = new Error('Term not found');
      err.statusCode = 404;
      throw err;
    }

    // check if teacher exists
    const teacherexist = await getUserByIdRepository(teacher_id);
    if(!teacherexist) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }

    // check if title , description , instructions is a string and is less than 255
    if (typeof title !== 'string' || typeof description !== 'string' || typeof instructions !== 'string' ) {
      const err = new Error('Invalid title , description or instructions');
      err.statusCode = 400;
      throw err;
    }

    // make sure if assignment_type is 'homework', 'quiz', 'project', 'discussion','reading', 'essay', 'file_upload', 'coding'
    if (assignment_type !== 'homework' && assignment_type !== 'quiz' && assignment_type !== 'project' && assignment_type !== 'discussion' &&
      assignment_type !== 'reading' && assignment_type !== 'essay' && assignment_type !== 'file_upload' && assignment_type !== 'coding') {
      const err = new Error('Invalid assignment_type');
      err.statusCode = 400;
      throw err;
    }

    // make sure that submission_mode is 'online', 'file', 'url', 'quiz', 'mixed', 'none'
    if (submission_mode !== 'online' && submission_mode !== 'file' && submission_mode !== 'url' && submission_mode !== 'quiz' &&
      submission_mode !== 'mixed' && submission_mode !== 'none') {
      const err = new Error('Invalid submission_mode');
      err.statusCode = 400;
      throw err;
    }

    // make sure that max_score , weight , passing_score , max_attempts are numbers
    if (typeof max_score !== 'number' || typeof weight !== 'number' || typeof passing_score !== 'number' || typeof max_attempts !== 'number') {
      const err = new Error('Invalid max_score , weight or passing_score');
      err.statusCode = 400;
      throw err;
    }

    // make sure that assigned_on , available_from , due_date , available_until are dates
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

if (
  (assigned_on && !dateOnlyRegex.test(assigned_on)) ||
  (available_from && !dateTimeRegex.test(available_from)) ||
  (due_date && !dateTimeRegex.test(due_date)) ||
  (available_until && !dateTimeRegex.test(available_until))
) {
  const err = new Error('Invalid date format');
  err.statusCode = 400;
  throw err;
}

    // make sure that allow_late_submission , allow_resubmission ,is_graded , is_team_assignment are booleans
    if (typeof allow_late_submission !== 'boolean' || typeof allow_resubmission !== 'boolean' || typeof is_graded !== 'boolean' || typeof is_team_assignment !== 'boolean') {
      const err = new Error('Invalid allow_late_submission , allow_resubmission or is_graded');
      err.statusCode = 400;
      throw err;
    }

    // make sure that quiz_config is an object
    if (typeof quiz_config !== 'object') {
      const err = new Error('Invalid quiz_config');
      err.statusCode = 400;
      throw err;
    }

    // make sure that status 'draft', 'published', 'closed', 'archived'
    if (status !== 'draft' && status !== 'published' && status !== 'closed' && status !== 'archived') {
      const err = new Error('Invalid status');
      err.statusCode = 400;
      throw err;
    }


    // Create Admin if user does exist
    const assignment = await createAssignmentRepository({class_subject_id , term_id , teacher_id , title ,
      description , instructions , assignment_type , submission_mode,
      max_score , weight , passing_score , assigned_on , available_from,
      due_date , available_until , allow_late_submission , allow_resubmission,
      max_attempts , is_graded , is_team_assignment , quiz_config , status});

    return assignment;
}


export const getAssignmentByIdService = async (id) => {

    const academicyear = await getAssignmentByIdRepository(id);

    if(!academicyear) {
      const err = new Error('Academic Year not found');
      err.statusCode = 404;
      throw err;
    }

    return academicyear;
}

export const updateAssignmentService = async (id , data) => {
  const {class_subject_id , term_id , teacher_id , title ,
      description , instructions , assignment_type , submission_mode,
      max_score , weight , passing_score , assigned_on , available_from,
      due_date , available_until , allow_late_submission , allow_resubmission,
      max_attempts , is_graded , is_team_assignment , quiz_config , status
     } = data

    //  check if class subject exists
    if( class_subject_id !== undefined ) {
      const classsubjectexists = await getClassSubjectsByIdRepository(class_subject_id);
    if(!classsubjectexists) {
      const err = new Error('Class Subject not found');
      err.statusCode = 404;
      throw err;
    }

    }
    // check if term exists
    if( term_id !== undefined ) {
      const termexist = await getTermByIdRepository(term_id);
    if(!termexist) {
      const err = new Error('Term not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // check if teacher exists
    if( teacher_id !== undefined ) {
      const teacherexist = await getUserByIdRepository(teacher_id);
    if(!teacherexist) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }
    }

    // check if title , description , instructions is a string and is less than 255
    if ( title !== undefined && typeof title !== 'string' || description !== undefined && typeof description !== 'string' || instructions !== undefined && typeof instructions !== 'string' ) {
      const err = new Error('Invalid title , description or instructions');
      err.statusCode = 400;
      throw err;
    }

    // make sure if assignment_type is 'homework', 'quiz', 'project', 'discussion','reading', 'essay', 'file_upload', 'coding'
    if ( assignment_type !== undefined && assignment_type !== 'homework' && assignment_type !== 'quiz' && assignment_type !== 'project' && assignment_type !== 'discussion' &&
      assignment_type !== 'reading' && assignment_type !== 'essay' && assignment_type !== 'file_upload' && assignment_type !== 'coding') {
      const err = new Error('Invalid assignment_type');
      err.statusCode = 400;
      throw err;
    }

    // make sure that submission_mode is 'online', 'file', 'url', 'quiz', 'mixed', 'none'
    if ( submission_mode !== undefined && submission_mode !== 'online' && submission_mode !== 'file' && submission_mode !== 'url' && submission_mode !== 'quiz' &&
      submission_mode !== 'mixed' && submission_mode !== 'none') {
      const err = new Error('Invalid submission_mode');
      err.statusCode = 400;
      throw err;
    }

    // make sure that max_score , weight , passing_score , max_attempts are numbers
    if ( max_score !== undefined && typeof max_score !== 'number' || weight !== undefined && typeof weight !== 'number' || passing_score !== undefined && typeof passing_score !== 'number' || max_attempts !== undefined && typeof max_attempts !== 'number') {
      const err = new Error('Invalid max_score , weight or passing_score');
      err.statusCode = 400;
      throw err;
    }

    // make sure that assigned_on , available_from , due_date , available_until are dates
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

const hasAnyDate =
  assigned_on !== undefined ||
  available_from !== undefined ||
  due_date !== undefined ||
  available_until !== undefined;

if (
  hasAnyDate && (
    (assigned_on !== undefined && !dateOnlyRegex.test(assigned_on)) ||
    (available_from !== undefined && !dateTimeRegex.test(available_from)) ||
    (due_date !== undefined && !dateTimeRegex.test(due_date)) ||
    (available_until !== undefined && !dateTimeRegex.test(available_until))
  )
) {
  const err = new Error('Invalid date format');
  err.statusCode = 400;
  throw err;
}

    // make sure that allow_late_submission , allow_resubmission ,is_graded , is_team_assignment are booleans
if (
  (allow_late_submission !== undefined && typeof allow_late_submission !== 'boolean') ||
  (allow_resubmission    !== undefined && typeof allow_resubmission    !== 'boolean') ||
  (is_graded             !== undefined && typeof is_graded             !== 'boolean') ||
  (is_team_assignment    !== undefined && typeof is_team_assignment    !== 'boolean')
) {
  const err = new Error(
    'Invalid type: allow_late_submission, allow_resubmission, is_graded and is_team_assignment must be booleans'
  );
  err.statusCode = 400;
  throw err;
}

    // make sure that quiz_config is an object
    if ( quiz_config !== undefined && typeof quiz_config !== 'object') {
      const err = new Error('Invalid quiz_config');
      err.statusCode = 400;
      throw err;
    }

    // make sure that status 'draft', 'published', 'closed', 'archived'
    if ( status !== undefined && status !== 'draft' && status !== 'published' && status !== 'closed' && status !== 'archived') {
      const err = new Error('Invalid status');
      err.statusCode = 400;
      throw err;
    }

    // check if assignment exists
    const assignmentexists = await getAssignmentByIdRepository(id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }


    // update assignment
    const assignment = await updateAssignmentRepository(id , {class_subject_id , term_id , teacher_id , title ,
      description , instructions , assignment_type , submission_mode,
      max_score , weight , passing_score , assigned_on , available_from,
      due_date , available_until , allow_late_submission , allow_resubmission,
      max_attempts , is_graded , is_team_assignment , quiz_config , status});

    return assignment;
}

export const getAllAssignmentService = async () => {

    const assignment = await getAllAssignmentRepository();
    return assignment;
}

export const deleteAssignmentService = async (id) => {

  // check if Academic exists
  const assignmentexists = await getAssignmentByIdRepository(id);
  if(!assignmentexists) {
    const err = new Error(' Assignment not found');
    err.statusCode = 404;
    throw err;
  }

  const assignment = await deleteAssignmentRepository(id);
  return assignment;
}

export const searchAssignmentsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const assignment = await searchAssignmentRepository(query);
  return assignment;
}

export const getAllAssignmentsByTeacherIdService = async (id) => {

      // check if teacher exists
    const teacherexist = await getUserByIdRepository(id);
    if(!teacherexist) {
      const err = new Error('Teacher not found');
      err.statusCode = 404;
      throw err;
    }

  const assignment = await getAllAssignmentsByTeacherId(id);
  return assignment;
}

export const getAllAssignmentsByClassSubjectIdService = async (id) => {

      //  check if class subject exists
    const classsubjectexists = await getClassSubjectsByIdRepository(id);
    if(!classsubjectexists) {
      const err = new Error('Class Subject not found');
      err.statusCode = 404;
      throw err;
    }
  const assignment = await getAllAssignmentsByClassSubjectId(id);
  return assignment;
}
