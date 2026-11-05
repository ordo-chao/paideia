import {
  createSubmissionRepository,
  getSubmissionByIdRepository,
  updateSubmissionRepository,
  getAllSubmissionRepository,
  deleteSubmissionRepository,
  searchSubmissionRepository,
  getAllSubmissionByAssignmentIdRepository,
  getAllSubmissionByStudentIdRepository
} from '../Repositories/Submission.repository.js';

import {
  getUserByIdRepository,
} from '../Repositories/User.repository.js';

import {
  getAssignmentByIdRepository,
} from '../Repositories/Assignments.repository.js';


export const createSubmissionService = async (data) => {

    const {assignment_id , student_id  , content , external_url  , status
     } = data

     let is_late = false;
     let assignment_status = 'submitted' || status;

    //  check if student exists
    const studentexist = await getUserByIdRepository(student_id);
    if(!studentexist) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }

    // check if assignments exists
    const assignmentexists = await getAssignmentByIdRepository(assignment_id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }

    // check if content and external_url are strings
    if (typeof content !== 'string' || typeof external_url !== 'string') {
      const err = new Error('Invalid content or external url');
      err.statusCode = 400;
      throw err;
    }

    // check if due_date on assignment has passed
    if (assignmentexists.due_date < new Date() && assignmentexists.allow_late_submission === false) {
      const err = new Error('Assignment due date has passed');
      err.statusCode = 400;
      throw err;
    }else if(assignmentexists.due_date < new Date() && assignmentexists.allow_late_submission === true) {
      is_late = true;
      assignment_status = 'late';
    }

    // check if assignment_status is either 'submitted', 'late', 'graded', 'returned', 'draft', 'missing'
    if(assignment_status !== 'submitted' && assignment_status !== 'late' && assignment_status !== 'graded' && assignment_status !== 'returned' && assignment_status !== 'draft' && assignment_status !== 'missing') {
      const err = new Error('Invalid assignment status');
      err.statusCode = 400;
      throw err;
    }

    // Create submission if user does exist
    const submission = await createSubmissionRepository({assignment_id , student_id  , content , external_url ,
       is_late , status:assignment_status});

    return submission;
}

export const getSubmissionByIdService = async (id) => {
  const submission = await getSubmissionByIdRepository(id);
  return submission;
}

export const updateSubmissionService = async (id, data) => {

    const {content , external_url  , status
     } = data

     let is_late = false;
     let assignment_status = 'submitted' || status;

         // check if submission exists
    const submissionexists = await getSubmissionByIdRepository(id);
    if(!submissionexists) {
      const err = new Error('Submission not found');
      err.statusCode = 404;
      throw err;
    }

    // check if assignments exists
    const assignmentexists = await getAssignmentByIdRepository(submissionexists.assignment_id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }


    // check if content and external_url are strings
    if (content !== undefined && typeof content !== 'string' || external_url !== undefined && typeof external_url !== 'string') {
      const err = new Error('Invalid content or external url');
      err.statusCode = 400;
      throw err;
    }

    // check if due_date on assignment has passed
    if (assignmentexists.due_date < new Date() && assignmentexists.allow_late_submission === false) {
      const err = new Error('Assignment due date has passed');
      err.statusCode = 400;
      throw err;
    }else if(assignmentexists.due_date < new Date() && assignmentexists.allow_late_submission === true) {
      is_late = true;
      assignment_status = 'late';
    }

    // check if assignment_status is either 'submitted', 'late', 'graded', 'returned', 'draft', 'missing'
    if(assignment_status !== 'submitted' && assignment_status !== 'late' && assignment_status !== 'graded' && assignment_status !== 'returned' && assignment_status !== 'draft' && assignment_status !== 'missing') {
      const err = new Error('Invalid assignment status');
      err.statusCode = 400;
      throw err;
    }



    let attempt_number = submissionexists.attempt_number + 1

    // Update user Details
    const submission = await updateSubmissionRepository(id, { attempt_number , content , external_url ,
       is_late , status:assignment_status});

    // TODO: Send email to submission
    return submission;
}

export const deleteSubmissionService = async (id) => {

    // check if submission exists
    const submissionexists = await getSubmissionByIdRepository(id);
    if(!submissionexists) {
      const err = new Error('Submission not found');
      err.statusCode = 404;
      throw err;
    }
      
    // Delete user
    const submission = await deleteSubmissionRepository(id);

    // TODO: Send email to user
    return submission;
}

export const searchSubmissionService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }
  const submission = await searchSubmissionRepository(query);
  return submission;
}

export const getAdminService = async (id) => {
  const Admin = await getAdminByIdRepository(id);
  return Admin;
}

export const getAllSubmissionService = async () => {

  // TODO: Add pagination
  const submission = await getAllSubmissionRepository();
  return submission;
}

export const getAllSubmissionByAssignmentIdService = async (id) => {

      // check if assignments exists
    const assignmentexists = await getAssignmentByIdRepository(id);
    if(!assignmentexists) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }
  // TODO: Add pagination
  const submission = await getAllSubmissionByAssignmentIdRepository(id);
  return submission;
}

export const getAllSubmissionByStudentIdService = async (id) => {

      //  check if student exists
    const studentexist = await getUserByIdRepository(id);
    if(!studentexist) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }
  // TODO: Add pagination
  const submission = await getAllSubmissionByStudentIdRepository(id);
  return submission;
}