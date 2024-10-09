const pagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.perPage) || 10;
    req.pagination = { page, limit };
    next();
  };
  
  module.exports = pagination;
  