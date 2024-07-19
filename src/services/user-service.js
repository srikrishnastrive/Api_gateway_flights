const { StatusCodes } = require("http-status-codes");
const { UserRepository,RoleRepository} = require("../repositories");
const AppError = require("../utils/errors/app-error");

const { Auth, Enums } = require("../utils/common");



const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data){
   try {
    const user = await userRepository.getUserByEmail(data.email);
    if(!user){
        throw new AppError('No user found for the given mail', StatusCodes.NOT_FOUND);
    }
    const passwordMatch = Auth.checkPassword(data.password,user.password);
    if(!passwordMatch){
        throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
    }
    const jwt = Auth.createToken({id: user.id,email:user.email});
    return jwt;

   } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
   }

}

async  function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        console.log(response);
        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError('No User found',StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError'){
            throw new AppError('JWT token expired',StatusCodes.BAD_REQUEST);
        }
       console.log(error);
       throw error;
        
    }
}


async function addRolltoUser(data){
    try {
        const user = await userRepository.get(data.id);
        if(!user){
            throw new AppError('No user found for the give email', StatusCodes.NOT_FOUND);

        }
        const role = await roleRepository.getRoleByName(data.role);
        if(!role){
            throw new AppError('No user found for the give role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
    
}

//if logged in user is admin then we will allocate rules

async function isAdmin(id) {
    try {
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createUser,
    signin,
    isAuthenticated,
    addRolltoUser,
    isAdmin
}