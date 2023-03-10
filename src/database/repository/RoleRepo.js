const  Role  =  require('../model/role.model');


module.exports= class RoleRepo {
     static findByCode(code){
        return Role.findOne({ code: code, status: true }).lean().exec();
      }
 }
 