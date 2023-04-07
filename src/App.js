import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nodes from "./pages/Nodes";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nodes" element={<Nodes />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}
export default App;
