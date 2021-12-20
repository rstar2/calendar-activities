import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";

// React-Redux-Toolkit
import { Provider } from "react-redux";
import { store } from "./store";

// React-Router
import { BrowserRouter } from "react-router-dom";

// Multiple snackbars/notifications
// NOTE: Even though notifications can be used directly from components
// using useSnackbar() hook , it's better to use the store as then notifications
// can be shown from services/store-actions/etc...
import { SnackbarProvider } from "notistack";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
