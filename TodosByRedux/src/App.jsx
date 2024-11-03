import { Link } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <AllRoutes />
    </>
  );
}

export default App;
