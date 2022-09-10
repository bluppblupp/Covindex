/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import {
  getCurrentData,
  getListOfCountries,
  refreshCurrentData,
  removeSelectedCountry,
} from "../redux/actions/countryActions";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

const CountryComparisonTable = ({
  selectedCountries,
  loadingCurrent,
  currentData,
  getCurrentData,
  getListOfCountries,
  listOfCountries,
  refreshCurrentData,
  removeSelectedCountry,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "countryName",
    direction: "ascending",
  });
  let sortedProducts = [...Object.keys(currentData)].filter((country) =>
    selectedCountries.includes(country)
  );
  useMemo(() => {
    sortedProducts = [...Object.keys(currentData)].filter((country) =>
      selectedCountries.includes(country)
    );
    if (sortConfig !== null) {
      sortedProducts.sort((a, b) => {
        if (isNaN(currentData[a][sortConfig.key]) && !isNaN(currentData[b][sortConfig.key])) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (isNaN(currentData[b][sortConfig.key]) && !isNaN(currentData[a][sortConfig.key])) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        if (currentData[a][sortConfig.key] < currentData[b][sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (currentData[a][sortConfig.key] > currentData[b][sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedProducts;
  }, [currentData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    getListOfCountries();
    selectedCountries.forEach((country) => {
      getCurrentData(country);
    });
  }, [selectedCountries]);

  return (
    <TableContainer component={Paper}>
      <Table size="medium" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Button onClick={() => requestSort("countryName")}>
                Country
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("confirmed")}>
                Confirmed
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("confirmed_diff")}>
                Confirmed (Today)
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("vaccinated")}>
                Vaccinated
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("vaccinated_per_hundred")}>
                %Vaccinated
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("deaths")}>Deaths</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => requestSort("deaths_diff")}>
                Deaths (Today)
              </Button>
            </TableCell>
            <TableCell width="10%" align="center">
              {!Object.values(loadingCurrent).every((item) => item === false) ? <CircularProgress style={{ padding: "8px" }} /> : null}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProducts.map((country) => {
            return (
              <TableRow key={country}>
                <TableCell align="center">{listOfCountries[country]}</TableCell>
                <TableCell align="center">
                  {currentData[country]?.confirmed}
                </TableCell>
                <TableCell align="center">
                  {currentData[country]?.confirmed_diff}
                </TableCell>
                <TableCell align="center">
                  {currentData[country]?.vaccinated}
                </TableCell>
                <TableCell align="center">
                  {currentData[country]?.vaccinated_per_hundred}
                </TableCell>
                <TableCell align="center">
                  {currentData[country]?.deaths}
                </TableCell>
                <TableCell align="center">
                  {currentData[country]?.deaths_diff}
                </TableCell>
                <TableCell align="center">
                  <CloseIcon
                    onClick={() => removeSelectedCountry(country)}
                    sx={{
                      "&:hover": {
                        color: "red",
                      },
                      fontSize: 18,
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <RefreshIcon
                    onClick={() => refreshCurrentData(country)}
                    sx={{
                      "&:hover": {
                        color: "blue",
                      },
                      display:
                        currentData[country]?.vaccinated === "API error"
                          ? true
                          : "none",
                      fontSize: 18,
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

const mapStateToProps = (state) => {
  return {
    selectedCountries: state.country.selectedCountries,
    currentData: state.country.currentData,
    loadingCurrent: state.country.loadingCurrent,
    error: state.country.error,
    listOfCountries: state.country.listOfCountries,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentData: (country) => dispatch(getCurrentData(country)),
    getListOfCountries: () => dispatch(getListOfCountries()),
    refreshCurrentData: (country) => dispatch(refreshCurrentData(country)),
    removeSelectedCountry: (country) =>
      dispatch(removeSelectedCountry(country)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryComparisonTable);
