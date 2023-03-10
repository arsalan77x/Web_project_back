const ApiKey =  require('../model/apikey.model');

module.exports= class ApiKeyRepo {
   static async findByKey(key) {
    return ApiKey.findOne({ key: key, status: true }).lean().exec();
  }
}
