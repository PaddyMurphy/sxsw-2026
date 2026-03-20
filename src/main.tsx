import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, Theme, defaultSystem } from "@chakra-ui/react";
import { App } from "./App.tsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="dark" hasBackground>
        <App />
      </Theme>
    </ChakraProvider>
  </React.StrictMode>
);
