import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PyScriptProvider } from "pyscript-react";

//redux
import store from "./Redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PyScriptProvider> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </PyScriptProvider> */}
    </Provider>
  </React.StrictMode>
);
