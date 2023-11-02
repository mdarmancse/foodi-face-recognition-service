import { Request } from "express";
import { isEmpty } from "lodash";
import { PaginationConfig } from "./pagination.config";
import { FilterQuery } from "mongoose";

type FilterFactory = (req: Request) => GenericQuery[] | Promise<GenericQuery[]>;

type SearchFactory = (
  searchTerm: string,
) => GenericQuery[] | Promise<GenericQuery[]>;

type GenericQuery = FilterQuery<unknown>;

type PaginationOptions = {
  queries?: GenericQuery[];
  filterables?: string[];
  getFilterQueries?: FilterFactory;
  sortables?: string[];
  searchables?: string[];
  getSearchQueries?: SearchFactory;
};

type PreparedQuery = {
  query: GenericQuery;
  page: number;
  limit: number;
  sort: Object;
};

export const preparePaginationQuery = async (
  req: Request,
  options: PaginationOptions,
) => {
  const {
    queries = [],
    filterables = [],
    getFilterQueries,
    searchables = [],
    getSearchQueries,
    sortables = [],
  } = options || {};

  let rv: Partial<PreparedQuery> = {};

  // collect filter query
  let filterQueries: GenericQuery[] = [];
  if (getFilterQueries) {
    filterQueries = await Promise.resolve(getFilterQueries(req));
  } else {
    for (const filterable of filterables) {
      if (req.query[filterable]) {
        filterQueries.push({
          [filterable]: req.query[filterable],
        });
      }
    }
  }

  // collect search query
  let searchQueries: GenericQuery[] = [];
  const searchTerm = (req.query.search as string) || "";
  if (searchTerm) {
    if (getSearchQueries) {
      searchQueries = await Promise.resolve(getSearchQueries(searchTerm));
    } else {
      for (const searchable of searchables) {
        searchQueries.push({
          [searchable]: {
            $regex: searchTerm,
            $options: "i",
          },
        });
      }
    }
  }

  // combine filter and search queries
  const hasSearch = !isEmpty(searchQueries);
  rv.query = {
    $and: [
      ...queries,
      ...filterQueries,
      ...(hasSearch
        ? [
            {
              $or: searchQueries,
            },
          ]
        : []),
    ],
  };
  if (isEmpty(rv.query?.$and)) {
    rv.query = {};
  }

  // parse page and page size
  rv.page = Math.max(parseInt((req.query.pageNumber as string) || "1"), 1);
  rv.limit = Math.min(
    Math.max(
      parseInt(
        (req.query.itemsPerPage as string) ||
          `${PaginationConfig.DEFAULT_PAGE_SIZE}`,
      ),
      PaginationConfig.MIN_PAGE_SIZE,
    ),
    PaginationConfig.MAX_PAGE_SIZE,
  );

  // parse sorting params
  const sortBy = req.query.sortBy as string;
  let sort = {};
  if (sortBy && sortables.some((s) => s === sortBy)) {
    let sortOrder = `${
      req.query.sortOrder || PaginationConfig.ASC
    }`.toLowerCase();
    if (
      ![PaginationConfig.ASC, PaginationConfig.DESC].some(
        (o) => o === sortOrder,
      )
    ) {
      sortOrder = PaginationConfig.ASC;
    }

    sort = {
      [sortBy]: sortOrder,
    };
  }
  rv.sort = sort;

  return rv as Required<PreparedQuery>;
};
