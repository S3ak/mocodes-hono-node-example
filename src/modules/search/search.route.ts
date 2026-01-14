import { Hono } from "hono";

const search = new Hono().get(`/search`, async (c) => {
  // #NOTE: These params are not validated
  const { sortBy, filterBy } = c.req.query();

  return c.text(`your query is SortBy ${sortBy} & Filter: ${filterBy}`);
});

export default search;
