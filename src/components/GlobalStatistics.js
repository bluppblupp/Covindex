/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import millify from "millify";
import { getGlobalData } from "../redux/actions/globalDataActions";
import {
  Typography,
  Container,
  CircularProgress,
  CardContent,
  Card,
  TableBody,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const GlobalStatistics = ({ data, loading, error, getGlobalData }) => {
  useEffect(() => {
    getGlobalData();
  }, []);

  return (
    <Container>
      <Card
        sx={{ minHeight: 275, maxHeight: 800, minWidth: 400, maxWidth: 400 }}
      >
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : data ? (
            <Container align="left">
              <Typography variant="h5" align="center" gutterBottom>
                Global Covid-19 stats
              </Typography>
              <TableContainer>
                <Table size="small" sx={{ borderBottom: "none" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{ borderBottom: "none" }}
                        color="text.secondary"
                      >
                        Confirmed cases:
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {millify(data.confirmed)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none" }}>
                        Cases since yesterday:
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {millify(data.confirmed_diff)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none" }}>
                        Confirmed deaths:
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {millify(data.deaths)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none" }}>
                        Deaths since yesterday:
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {millify(data.deaths_diff)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography component="p" variant="body5" align="center" sx={{ pt: 3 }}>
                Last updated: {data.last_update} GMT
              </Typography>
            </Container>
          ) : error ? (
            <div>Could not fetch global data</div>
          ) : (
            <div></div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.globalData.globalData,
    loading: state.globalData.loading,
    error: state.globalData.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGlobalData: () => dispatch(getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalStatistics);
