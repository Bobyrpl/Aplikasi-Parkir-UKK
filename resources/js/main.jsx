import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./bootstrap";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../css/app.css";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
