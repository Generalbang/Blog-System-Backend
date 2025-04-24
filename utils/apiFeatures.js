class APIFeatures{
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }
  paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    async () => {
      if (req.query.page){
        const numDocs = await Model.countDocuments()
        if(skip >= numDocs) console.log(numDocs)
      }
    }
    return this;
  }
}
module.exports = APIFeatures;