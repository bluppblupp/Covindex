import React from "react";
import CountryComparisonList from "../components/CountryComparisonList";
import CountryComparisonTable from "../components/CountryComparisonTable";
import { Grid, Container } from "@mui/material";

const ComparePage = () => {
  return (
    <Container maxWidth="xl" alignitems="center" justifycontent="center">
      <Grid container direction="row" sx={{ pb: 2, p: 2 }}>
        <Grid item xs={4} xl={3} align="left">
          <CountryComparisonList />
        </Grid>
        <Grid item xs={8} xl={9} align="right" sx={{ pl: 0, pr: 0 }}>
          {" "}
          <CountryComparisonTable />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComparePage;
