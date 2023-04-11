import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nodes from "./pages/Nodes";
import StarryBackground from "./StarryBackground";

function App() {
    return (
        <Router>
            <StarryBackground />
            <nav>
                <Link to="/">Home</Link>
                <Link to="/nodes">Nodes</Link>
                <Link to="/login">Login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nodes" element={<Nodes />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}
export default App;
