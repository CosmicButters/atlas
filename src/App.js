import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Edit from "./pages/EditNodes";
import Nodes from "./pages/Nodes";
import StarryBackground from "./StarryBackground";
import { auth } from "./config/firebase";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Router>
            <StarryBackground />
            {user && (
                <nav>
                    <Link to="/edit">Edit</Link>
                    {/* <Link to="/nodes">Nodes</Link> */}
                    <Link to="/" onClick={() => auth.signOut()}>
                        Logout
                    </Link>
                </nav>
            )}
            <Routes>
                <Route path="/edit" element={<Edit />} />
                <Route path="/nodes" element={<Nodes />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
