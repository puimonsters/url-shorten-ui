import React, { useState, useEffect } from "react";
import Search from "./search";
import Create from "./create";
import List from "./list";
import { useSearchContext } from "./context";
import { searchUrlShortens } from "./api/api.js";

const Home = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchContext: any = useSearchContext();

  const refreshSearchResults = async () => {
    const response: any = await searchUrlShortens(
      searchContext.queryString,
      searchContext.sortFields,
      searchContext.offset
    );
    searchContext.setResults(response.data?.list);
    searchContext.setPageCount(response.data?.pages);
  };

  const doSearch = async (query_string, sort_fields, offset) => {
    setIsSearching(true);
    const response: any = await searchUrlShortens(
      query_string,
      sort_fields,
      offset
    );
    searchContext.setQueryString(query_string);
    searchContext.setOffset(offset);
    searchContext.setResults(response.data?.list);
    searchContext.setPageCount(response.data?.pages);
    setIsSearching(false);
  };

  return (
    <React.Fragment>
      <div>
        <Create />
      </div>
      <div>
        <Search doSearch={doSearch} />
      </div>
      <div>
        <List
          refreshSearchResults={refreshSearchResults}
          isSearching={isSearching}
        />
      </div>
    </React.Fragment>
  );
};

export default Home;
