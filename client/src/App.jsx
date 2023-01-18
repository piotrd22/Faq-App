import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AddNewQuestion from "./pages/AddNewQuestion";
import UpdateQuestion from "./pages/UpdateQuestion";

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
          path="/question-update/:id"
          element={
            user && user.admin ? <UpdateQuestion /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
