/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentData, setCountry } from "../redux/actions/countryActions";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Container,
  Table,
  TableCell,
  TableRow,
  TableContainer,
  TableBody,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import millify from "millify";

const Watchlist = ({
  loggedIn,
  watchlist,
  currentData,
  listOfCountries,
  getCurrentData,
  setCountry,
  loadingCurrent,
}) => {
  useEffect(() => {
    watchlist.forEach((country) => getCurrentData(country));
  }, [watchlist]);

  if (!loggedIn) {
    return (
      <Card
        sx={{ minHeight: 275, maxHeight: 275, minWidth: 400, maxWidth: 400 }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            <Link to="/account">Sign in</Link> to add countries to your
            watchlist and display them on the homepage
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (watchlist === undefined || watchlist.length <= 0) {
    return (
      <Card
        sx={{ minHeight: 275, maxHeight: 275, minWidth: 400, maxWidth: 400 }}
      >
        <CardActions>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Watchlist is currently empty. You can add countries to your
              watchlist by pressing <Link to="/account">here</Link> or by going
              to "My Account" under your profile.
            </Typography>
          </CardContent>
        </CardActions>
      </Card>
    );
  }

  return (
    <div>
      {!listOfCountries || !watchlist ? (
        <div></div>
      ) : (
        <Container>
          <Carousel
            stopAutoPlayOnHover={true}
            interval={5000}
            animation={"slide"}
            navButtonsAlwaysVisible={true}
            indicatorIconButtonProps={{
              style: {
                padding: "10px",
                margin: "10 10 0 0",
              },
            }}
            navButtonsProps={{
              style: {
                backgroundColor: "#6271a3",
                opacity: 0.2,
                margin: "0 10px",
              },
            }}
          >
            {watchlist.map((wKey) => {
              return (
                <Container
                  key={wKey}
                >
                  <Card
                    sx={{
                      minHeight: 275,
                      maxHeight: 275,
                      minWidth: 400,
                      maxWidth: 400,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" align="center" gutterBottom>
                        {listOfCountries[wKey]}
                      </Typography>

                      <Container align="left">
                        <TableContainer>
                          <Table size="small" sx={{ borderBottom: "none" }}>
                            <TableBody>
                              <TableRow>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  Confirmed cases:
                                </TableCell>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  {loadingCurrent[wKey] ? (
                                    <CircularProgress size={20} />
                                  ) : !currentData[wKey] ? (
                                    "No data"
                                  ) : (
                                    isNaN(currentData[wKey].confirmed) ? currentData[wKey].confirmed : millify(currentData[wKey].confirmed)
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  Cases since yesterday:{" "}
                                </TableCell>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  {loadingCurrent[wKey] ? (
                                    <CircularProgress size={20} />
                                  ) : !currentData[wKey] ? (
                                    "No data"
                                  ) : (
                                    isNaN(currentData[wKey].confirmed_diff) ? currentData[wKey].confirmed_diff : millify(currentData[wKey].confirmed_diff)
                                  )}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  Confirmed deaths:{" "}
                                </TableCell>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  {loadingCurrent[wKey] ? (
                                    <CircularProgress size={20} />
                                  ) : !currentData[wKey] ? (
                                    "No data"
                                  ) : (
                                    isNaN(currentData[wKey].deaths) ? currentData[wKey].deaths : millify(currentData[wKey].deaths)
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  Deaths since yesterday:{" "}
                                </TableCell>
                                <TableCell sx={{ borderBottom: "none" }}>
                                  {loadingCurrent[wKey] ? (
                                    <CircularProgress size={20} />
                                  ) : !currentData[wKey] ? (
                                    "No data"
                                  ) : (
                                    currentData[wKey].deaths_diff
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Container>
                      <CardActions>
                        <Container
                          align="center"
                          justify="center"
                          sx={{ p: 2, spacing: 2 }}
                        >
                          <Button
                            size="small"
                            component={Link}
                            to="/details"
                            onClick={() => setCountry(wKey)}
                          >
                            Learn More
                          </Button>
                          <Button
                            size="small"
                            component={Link}
                            to="/account"
                          >
                            Modify watchlist
                          </Button>
                        </Container>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Container>
              );
            })}
          </Carousel>
        </Container>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedIn: !state.firebase.auth.isEmpty,
    watchlist: state.watchlist.watchlist,
    currentData: state.country.currentData,
    listOfCountries: state.country.listOfCountries,
    loadingCurrent: state.country.loadingCurrent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentData: (country) => dispatch(getCurrentData(country)),
    setCountry: (country) => dispatch(setCountry(country)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Watchlist);
