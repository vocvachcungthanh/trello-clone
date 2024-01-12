import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
// import { cyan, deepOrange, orange, lightBlue } from "@mui/material/colors";

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px",
  },

  // colorSchemes: {
  //   light: {
  //     palette: {
  //       primary: lightBlue,
  //       secondary: deepOrange,
  //     },
  //   },

  //   dark: {
  //     palette: {
  //       primary: cyan,
  //       secondary: orange,
  //     },
  //   },
  // },

  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: "none",
          borderWidth: "0.5px",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontsize: "0.875rem",

          "& fieldset": {
            borderWidth: "0.5px !important",
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },

          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#dcdde1",
            borderRadius: "9999px",
          },

          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "white",
          },
        },
      },
    },
  },
});

export default theme;
