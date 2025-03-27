class ApiFeatures {
  constructor(mongoQuery, queryParam) {
    this.mongoQuery = mongoQuery;
    this.queryParam = queryParam;
  }

  filter() {
    const { page, sort, limit, fields, ...queryParam } = this.queryParam;

    let queryStr = JSON.stringify(queryParam);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    this.mongoQuery = this.mongoQuery.find(queryStr);

    return this;
  }

  sort() {
    const { sort } = this.queryParam;

    if (!sort) {
      this.mongoQuery = this.mongoQuery.sort('-createdAt');
      return this;
    }

    const sortBy = sort.replaceAll(',', ' ');
    this.mongoQuery = this.mongoQuery.sort(sortBy);

    return this;
  }

  selectFields() {
    const { fields } = this.queryParam;

    if (!fields) {
      this.mongoQuery = this.mongoQuery.select('-__v');
      return this;
    }

    const fieldsStr = fields.replaceAll(',', ' ');
    this.mongoQuery = this.mongoQuery.select(fieldsStr);

    return this;
  }

  paginate() {
    const { page, limit } = this.queryParam;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 50;
    const skipValue = (pageNumber - 1) * limit;

    this.mongoQuery = this.mongoQuery.skip(skipValue).limit(limitNumber);

    return this;
  }
}

module.exports = ApiFeatures;
