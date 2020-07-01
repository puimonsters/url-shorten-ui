import React, { useState, useEffect } from "react";
import useDebounce from "./lib/use-debounce";
import { useSearchContext } from "./context";
import { searchUrlShortens } from "./api/api.js";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  FormLabel,
  FormGroup,
  FormControl,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3),
    width: "500px"
  },
  formGroup: {
    marginTop: theme.spacing(3)
  }
}));

interface IProps {
  doSearch: Function;
}

const SearchInput: React.SFC<IProps> = props => {
  const [searchTerm, setSearchTerm] = useState(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const searchContext: any = useSearchContext();

  useEffect(() => {
    if (searchContext.queryString === undefined) {
      async function searchApi() {
        await props.doSearch("", searchContext.sortFields, 1);
      }
      searchApi();
    }
    // default display all records
  }, [searchContext.queryString]);

  useEffect(() => {
    if (searchContext.queryString !== undefined) {
      async function searchApi() {
        if (debouncedSearchTerm) {
          await props.doSearch(
            debouncedSearchTerm,
            searchContext.sortFields,
            1
          );
        } else {
          await props.doSearch("", searchContext.sortFields, 1);
        }
      }
      searchApi();
    }
    // search input without submit button
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (searchContext.queryString !== undefined) {
      async function searchApi() {
        await props.doSearch(
          searchContext.queryString,
          searchContext.sortFields,
          1
        );
      }
      searchApi();
    }
    // sort results by multiple columns
  }, [searchContext.sortFields]);

  useEffect(() => {
    if (searchContext.queryString !== undefined) {
      async function searchApi() {
        await props.doSearch(
          searchContext.queryString,
          searchContext.sortFields,
          searchContext.offset
        );
      }
      searchApi();
    }
    // page changed
  }, [searchContext.offset]);

  const handleSortFieldsChanged = event => {
    const sort_fields = [...searchContext.sortFields].filter(
      v => v !== event.target.name
    );
    if (event.target.checked) {
      sort_fields.push(event.target.name);
    }
    searchContext.setSortFields(sort_fields);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <FormControl
        fullWidth
        component="fieldset"
        className={classes.formControl}
      >
        <TextField
          id="search"
          label="Search URL / Short Code"
          onChange={e => setSearchTerm(e.target.value)}
        />

        <FormGroup className={classes.formGroup}>
          <FormLabel component="legend">Sort by</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleSortFieldsChanged}
                name="expiration_date"
              />
            }
            label="Expiration Date"
          />

          <FormControlLabel
            control={
              <Checkbox onChange={handleSortFieldsChanged} name="hits" />
            }
            label="Number of Hits"
          />
        </FormGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default SearchInput;
