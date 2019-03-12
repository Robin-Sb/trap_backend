module.exports = {
  Query: {
    search: async (_, __, context) =>
      context.yelpAPI.getYelpPOIs(context.variables)
  },
};