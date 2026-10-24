import {
  createClassLevelsRepository,
  getClassLevelsByIdRepository,
  updateClassLevelsRepository,
  getAllClassLevelsRepository,
  deleteClassLevelsRepository,
searchClassLevelsRepository,
} from '../Repositories/Class_Levels.repository.js';

export const createClassLevelsService = async (data) => {

    const {name , level_order , curriculum , description
     } = data


    // make sure name is a string and is less than 55
    if (typeof name !== 'string' || name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if (typeof curriculum !== 'string' || curriculum.length > 55) {
      const err = new Error('Invalid curriculum');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 55
            if (typeof description !== 'string' || description.length > 255) {
      const err = new Error('Invalid description');
      err.statusCode = 400;
      throw err;
    }

    // make sure level_order is a number
                if (typeof level_order !== 'number') {
      const err = new Error('Invalid level order');
      err.statusCode = 400;
      throw err;
    }



    // Create Class level
    const classlevel = await createClassLevelsRepository({name , level_order , curriculum , description});

    return classlevel;
}


export const getClassLevelsByIdService = async (id) => {

    const classlevel = await getClassLevelsByIdRepository(id);

    if(!classlevel) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }

    return classlevel;
}

export const updateClassLevelsService = async (id , data) => {
    const {name , level_order , curriculum , description
     } = data


    // make sure name is a string and is less than 55
    if (name !== undefined && typeof name !== 'string' && name.length > 55) {
      const err = new Error('Invalid name');
      err.statusCode = 400;
      throw err;
    }

    // make sure curriculum is a string and is less than 55
        if ( curriculum !== undefined && typeof curriculum !== 'string' && curriculum.length > 55) {
      const err = new Error('Invalid curriculum');
      err.statusCode = 400;
      throw err;
    }

    // make sure description is a string and is less than 55
            if ( description !== undefined && typeof description !== 'string' && description.length > 255) {
      const err = new Error('Invalid description');
      err.statusCode = 400;
      throw err;
    }

    // make sure level_order is a number
                if ( level_order !== undefined && typeof level_order !== 'number') {
      const err = new Error('Invalid level order');
      err.statusCode = 400;
      throw err;
    }

    // check if user exists
    const classlevelexists = await getClassLevelsByIdRepository(id);

    if(!classlevelexists) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }

    const classlevel = await updateClassLevelsRepository(id , {name , level_order , curriculum , description});
    return classlevel;
}

export const getAllClassLevelsService = async () => {

    const classlevel = await getAllClassLevelsRepository();
    return classlevel;
}

export const deleteClassLevelsService = async (id) => {

  // check if Academic exists
    const classlevelexists = await getClassLevelsByIdRepository(id);

    if(!classlevelexists) {
      const err = new Error('class level not found');
      err.statusCode = 404;
      throw err;
    }

  const classlevel = await deleteClassLevelsRepository(id);
  return classlevel;
}

export const searchClassLevelsService = async (query) => {

  // verify query is string 
  if (typeof query !== 'string') {
    const err =  new Error('Query must be a string');
    err.statusCode = 400;
    throw err;
  }

  const classlevel = await searchClassLevelsRepository(query);
  return classlevel;
}
