import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function PageLoadingSpinner({ caption }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  );
}
export default PageLoadingSpinner;
