const  Keystore  =  require('../model/keystore.model');


module.exports = class keystoreRepo {
   static findforKey(client, key){
    return Keystore.findOne({ client: client, primaryKey: key, status: true }).exec();
  }

   static remove(id){
    return Keystore.findByIdAndRemove(id).lean().exec();
  }

   static find(
    client,
    primaryKey,
    secondaryKey,
  ) {
    return Keystore.findOne({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    })
      .lean()
      .exec();
  }

   static async create(
    client,
    primaryKey,
    secondaryKey,
  ){
    const now = new Date();
    const keystore = await Keystore.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    });
    return keystore;
  }
}
