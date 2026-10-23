// Repositories/tokenRepository.js
import { Token } from '../Models/index.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

export const createTokenRepository = async (data) => {
  try {
    const { email, id } = data;

    const setupToken = crypto.randomBytes(32).toString('hex');

    const token = await Token.create({
      user_email: email,
      user_id: id,
      token: setupToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });


    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

export const createVerificationRepository = async (data) => {
  try {

    const { email, id } = data;
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const token = await Token.create({
      user_email: email,
      user_id: id,
      verification_code: verificationCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    // const formattedCode = verificationCode.replace(/(\d{3})(\d{3})/, '$1 $2');
    // TODO: send email
    // await  sendClientVerificationEmail(email, formattedCode , `${first_name} ${last_name}`);
    return token;

  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

export const verifyTokenRepository = async (token) => {
  try {
    const tokenData = await Token.findOne({ 
      where: { token },
      raw: false,
    });
    return tokenData;
  } catch (error) {
    throw error;
  }
};

export const verifyVerificationRepository = async (token) => {
  try {
    const tokenData = await Token.findOne({ 
      where: { verification_code: token },
      raw: true,
    });

    // Mark token as used
    if (tokenData) {
      await markTokenAsUsedRepository(tokenData.id);
    }


    return tokenData;
  } catch (error) {
    throw error;
  }
};

export const findTokenByTokenRepository = async (tokenString) => {
  try {
    const tokenData = await Token.findOne({
      where: {
        token: tokenString,
        expires_at: { [Op.gt]: new Date() }, // Not expired
      },
    });
    return tokenData;
  } catch (error) {
    throw error;
  }
};

export const markTokenAsUsedRepository = async (tokenId, metadata = {}) => {
  try {
    const [updated] = await Token.update(
      {
        is_used: true,
        used_at: new Date(),
        ...metadata,
      },
      {
        where: { id: tokenId },
      }
    );
    return updated > 0;
  } catch (error) {
    throw error;
  }
};

export const incrementTokenAttemptsRepository = async (tokenId) => {
  try {
    const token = await Token.findByPk(tokenId);
    if (token) {
      token.attempts = (token.attempts || 0) + 1;
      await token.save();
      return token.attempts;
    }
    return 0;
  } catch (error) {
    throw error;
  }
};

export const getTokenByEmailRepository = async (email) => {
  try {
    const tokens = await Token.findAll({
      where: {
        user_email: email,
        is_used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });
    return tokens;
  } catch (error) {
    throw error;
  }
};

export const deleteExpiredTokensRepository = async () => {
  try {
    const deleted = await Token.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};
