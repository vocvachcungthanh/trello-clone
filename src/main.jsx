import React from "react";
import ReactDOM from "react-dom/client";
import App from "~/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "~/theme.js";

// Cấu hình react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Cấu hình MUI Dialog
import { ConfirmProvider } from "material-ui-confirm";

// Cấu hình Redux Store
import { Provider } from "react-redux";
import { store } from "~/redux/store";

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: "xs" },
            buttonOrder: ["confirm", "cancel"],
            cancellationButtonProps: { color: "inherit" },
            confirmationButtonProps: {
              color: "secondary",
              variant: "outlined",
            },
          }}
        >
          <CssBaseline />
          <App />
          <ToastContainer theme="colored" position="bottom-left" />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
);
