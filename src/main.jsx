import React from "react";
import ReactDOM from "react-dom/client";
import App from "~/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
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

// Cấu hình Redux-Persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);

//kỹ thuật InjectStore: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from "~/utils/authorizeAxios";
injectStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
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
            <GlobalStyles
              styles={{
                a: {
                  textDecoration: "none",
                },
              }}
            />
            <CssBaseline />
            <App />
            <ToastContainer theme="colored" position="bottom-left" />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
