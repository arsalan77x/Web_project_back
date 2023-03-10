module.exports=function regexQuery(filter){
    var query = {};
    for (var key  in filter) {
      var regex = new RegExp(filter[key], "i")
      query[key] = regex
    }
    return query
}