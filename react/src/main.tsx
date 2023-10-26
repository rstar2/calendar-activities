import React from "react";
import ReactDOM from "react-dom/client";


// React-Router
import { BrowserRouter } from "react-router-dom";

// Chakra-UI
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App.tsx";
import theme from "./theme.ts";
import "./index.css";
import reportWebVitals from "./reportWebVitals.ts";

// the tanstack-query cache provider
import { CacheProvider } from "./cache/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CacheProvider>
        <ChakraProvider resetCSS theme={theme}>
          <App />
        </ChakraProvider>
      </CacheProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
