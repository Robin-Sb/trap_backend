module.exports = {
    Query: {
      search: async (_, __, { dataSources }) =>
        dataSources.yelpAPI.getYelpPOIs()
    },
  };
  