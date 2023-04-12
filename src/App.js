import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Edit from "./pages/EditNodes";
import Nodes from "./pages/Nodes";
import StarryBackground from "./StarryBackground";

function App() {
    return (
        <Router>
            <StarryBackground />
            <nav>
                <Link to="/edit">Edit</Link>
                {/* <Link to="/nodes">Nodes</Link> */}
                <Link to="/">Login</Link>
                <Link to="/">Logout</Link>
            </nav>
            <Routes>
                <Route path="/edit" element={<Edit />} />
                <Route path="/nodes" element={<Nodes />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}
export default App;
