import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AddNewQuestion from "./pages/AddNewQuestion";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AddNewUser from "./pages/AddNewUser";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={user ? <Navigate to="/" /> : <AdminLogin />}
        />
        <Route
          path="/add-new-question"
          element={
            user && user.admin ? <AddNewQuestion /> : <Navigate to="/" />
          }
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/admin" />}
        />
        <Route
          path="/admin-panel"
          element={
            user && user.admin ? <AdminPanel /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin-panel/add-new-user"
          element={
            user && user.admin ? <AddNewUser /> : <Navigate to="/admin" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
