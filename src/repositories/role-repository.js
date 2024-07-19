
const {Role} = require("../models");
const CrudRepository = require("./crud-repository");



class RoleRepository extends CrudRepository{
    constructor(){
        super(Role)
    }

    async getRoleByName(name){
        const role = await Role.findOne({where :{name: name}});
        return role;
    }
    async getRoleById(id){
        const role = await Role.findOne({where :{id: id}});
        return role;
    }
}

module.exports = RoleRepository;