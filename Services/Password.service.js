import {
  createTokenRepository,
  createVerificationRepository,
  verifyVerificationRepository,
  findTokenByTokenRepository,
  markTokenAsUsedRepository,
  incrementTokenAttemptsRepository,
} from '../Repositories/Password.repository.js';

import {
  findUserByEmailRepository,
  updateUserRepository
} from '../Repositories/User.repository.js';

import { hashPassword } from '../Utils/bcrypt.js'



export const updatePasswordService = async (data) => {

  const { password, token } = data


  if (!token) {
    const err = new Error('Token required');
    err.statusCode = 400;
    throw err;
  }

  if (!password) {
    const err = new Error('Password required');
    err.statusCode = 400;
    throw err;
  }

  const tokenData = await findTokenByTokenRepository(token);

  if (!tokenData) {
    const err = new Error('Invalid token provided for password update');
    err.statusCode = 400;
    throw err;
  }


  // Check if token is already used
  if (tokenData.is_used) {
    const err = new Error('Token already used.Request for new token');
    err.statusCode = 400;
    throw err;
  }

  // Check if token is expired
  if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
    const err = new Error('Token has expired.Request for a new token');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = (password === null || password === undefined)
    ? null
    : await hashPassword(password);

  const user = await updateUserRepository(tokenData.user_id, {
    password: hashedPassword
  });

  if (!user) {
    const err = new Error('User not found for update');
    err.statusCode = 404;
    throw err;
  }

  const result = await markTokenAsUsedRepository(tokenData.id);

  // TODO: send email

  return result
}



export const validateTokenService = async (token) => {


  // Validate required field
  if (!token) {
    const err = new Error('Token required');
    err.statusCode = 400;
    throw err;
  }

  const tokenData = await findTokenByTokenRepository(token);

  if (!tokenData) {
    const err = new Error('Invalid token provided for password update');
    err.statusCode = 400;
    throw err;
  }

  // Check if token is already used
  if (tokenData.is_used) {
    const err = new Error('Token already used.Request for new token');
    err.statusCode = 400;
    throw err;
  }

  // Check if token is expired
  if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
    const err = new Error('Token has expired.Request for a new token');
    err.statusCode = 400;
    throw err;
  }

  const result = await incrementTokenAttemptsRepository(tokenData.id);

  return result === 0
};


export const getVerificationCodeService = async (email) => {

  // Validate required field
  if (!email) {
    const err = new Error('Email is required');
    err.statusCode = 400;
    throw err;
  }

  const user = await findUserByEmailRepository(email);

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const token = await createVerificationRepository(user.dataValues);

  // TODO: send email

  return token

}


export const verifyVerificationService = async (verification_code) => {


  if (!verification_code) {
    const err = new Error('Verification code is required');
    err.statusCode = 400;
    throw err;
  }

  const tokenData = await verifyVerificationRepository(verification_code);

  if (!tokenData) {
    const err = new Error('Invalid verification code provided');
    err.statusCode = 400;
    throw err;
  }

  if (tokenData.is_used) {
    const err = new Error('Verification Code already used.Request for new token');
    err.statusCode = 400;
    throw err;
  }

  const user = await findUserByEmailRepository(tokenData.user_email);
  const token = await createTokenRepository(user);
  

  // TODO: send email

  return token

};