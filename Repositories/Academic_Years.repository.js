import {AcademicYears as AcademicYear} from "../Models/index.js";
import { Op } from "sequelize";

export const createAcademicYearRepository = async (data) => {
  try {
    const academicyear = await AcademicYear.create(data);
    return academicyear;
  } catch (error) {
    throw error;
  }
}

export const getAcademicYearByIdRepository = async (id) => {
  try {
    const academicyear = await AcademicYear.findByPk(id);
    return academicyear;
  } catch (error) {
    throw error;
  }
}

export const updateAcademicYearRepository = async (id, data) => {
  try {
    const academicyear = await AcademicYear.findByPk(id);
    if (!academicyear) {
      throw new Error('academicyear not found');
    }

    await academicyear.update(data);
    
    return academicyear;
  } catch (error) {
    throw error;
  }
}

export const getAllAcademicYearRepository = async () => {
  try {
    const  academicyear = await AcademicYear.findAll();
    return  academicyear;
  } catch (error) {
    throw error;
  }
}

export const deleteAcademicYearRepository = async (id) => {
  try {
    const academicyear = await AcademicYear.findByPk(id);
    if (!academicyear) {
      throw new Error('academicyear not found');
    }

    await academicyear.destroy();
    
    return academicyear;
  } catch (error) {
    throw error;
  }
}


export const searchAcademicYearRepository = async (query) => {
  if (!query) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  const academicyear = await AcademicYear.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
      ],
    },
  })

  return academicyear;
};