import React, { createContext, useContext, useState } from "react";
import { node, string } from "prop-types";
import { IUrlShorten } from "./types/types";

export const SearchContext: any = createContext({});

export const SearchContextProvider = ({ children }) => {
  const [queryString, setQueryString] = useState(undefined);
  const [sortFields, setSortFields] = useState([]);
  const [results, setResults] = useState<[IUrlShorten] | []>([]);
  const [pageCount, setPageCount] = useState(undefined);
  const [offset, setOffset] = useState(undefined);

  const searchContext = {
    queryString,
    setQueryString: setQueryString,
    results,
    setResults: setResults,
    sortFields,
    setSortFields,
    pageCount,
    setPageCount: setPageCount,
    offset,
    setOffset: setOffset
  };
  return (
    <SearchContext.Provider value={searchContext}>
      {children}
    </SearchContext.Provider>
  );
};

SearchContextProvider.propTypes = {
  children: node.isRequired,
  queryString: string
};

export const useSearchContext = () => useContext(SearchContext);
