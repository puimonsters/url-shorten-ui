import React, { useState } from "react";
import { useSearchContext } from "./context";
import ReactPaginate from "react-paginate";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, CircularProgress } from "@material-ui/core";
import { deleteUrlShorten } from "./api/api.js";
import { IUrlShorten } from "./types/types";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  tableContainer: {
    margin: theme.spacing(3),
    width: "90%"
  },
  table: {
    minWidth: 650
  }
}));

interface IProps {
  refreshSearchResults: Function;
  isSearching: boolean;
}

const List: React.SFC<IProps> = props => {
  const [error, setError] = useState(undefined);
  const [successData, setSuccessData] = useState<IUrlShorten | undefined>(
    undefined
  );
  const [isSaving, setSaving] = useState(false);

  const searchContext: any = useSearchContext();
  const results = searchContext.results;

  const handlePageClick = data => {
    let selected = data.selected;
    let offset = selected + 1;
    searchContext.setOffset(offset);
  };

  const handleToggleDelete = async (event, id) => {
    setError(undefined);
    setSuccessData(undefined);
    setSaving(true);

    const is_deleted = event.target.checked;
    const response: any = await deleteUrlShorten(id, is_deleted);
    if (response.error) {
      setError(response.error);
    } else {
      setSuccessData(response?.data);
    }
    await props.refreshSearchResults();
    setSaving(false);
  };

  const handleRefresh = async () => {
    setSaving(true);
    await props.refreshSearchResults();
    setSaving(false);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className="util-marginLeftLg" style={{ height: "25px" }}>
        {!props.isSearching && (
          <div className="MuiTypography-body1">
            <span>Results</span>
            <span className="util-hooverOp" onClick={handleRefresh}>
              {" "}
              | Refresh
            </span>
          </div>
        )}
        {props.isSearching && <CircularProgress />}
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Short Code</TableCell>
              <TableCell>Hits</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Is Deleted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map(row => {
              const labelId = `enhanced-table-checkbox-${row.id}`;
              return (
                <TableRow hover key={row.id} selected={row.is_deleted}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Link
                      to="route"
                      target="_blank"
                      onClick={event => {
                        event.preventDefault();
                        window.open(
                          `${process.env.REACT_APP_API_URL}/visit/${row.short_code}`
                        );
                      }}
                    >
                      {row.url}
                    </Link>
                  </TableCell>
                  <TableCell>{row.short_code}</TableCell>
                  <TableCell>{row.hits}</TableCell>
                  <TableCell>{row.expiration_date}</TableCell>
                  <TableCell component="th" id={labelId} scope="row">
                    <Checkbox
                      checked={row.is_deleted}
                      inputProps={{ "aria-labelledby": labelId }}
                      disabled={isSaving}
                      onChange={event => handleToggleDelete(event, row.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="util-flexRowCenter">
          <div className="react-paginate">
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={searchContext.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>

          {isSaving && (
            <div className="util-marginTop">
              <CircularProgress />
            </div>
          )}
        </div>
      </TableContainer>

      {error && (
        <div className={classes.tableContainer}>
          <Alert severity="error">{error}</Alert>
        </div>
      )}

      {successData?.short_code && (
        <div className={classes.tableContainer}>
          <Alert severity="success">
            {successData.url}
            <span className="util-textBold">
              {successData.is_deleted ? " is deleted" : " is undeleted"}
            </span>
          </Alert>
        </div>
      )}

      <div style={{ height: "300px" }} />
    </React.Fragment>
  );
};

export default List;
