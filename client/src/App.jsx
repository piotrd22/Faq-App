import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AddNewQuestion from "./pages/AddNewQuestion";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AddNewUser from "./pages/AddNewUser";
import UpdateQuestion from "./pages/UpdateQuestion";
import More from "./pages/More";
import UpdateUser from "./pages/UpdateUser";
import NotFound from "./pages/NotFound";
import AdminStats from "./pages/AdminStats";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={user ? <Navigate to="/" /> : <AdminLogin />}
        />
        <Route
          path="/add-new-question"
          element={
            user && user.admin ? <AddNewQuestion /> : <Navigate to="/admin" />
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
          path="/admin-stats"
          element={
            user && user.admin ? <AdminStats /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin-panel/add-new-user"
          element={
            user && user.admin ? <AddNewUser /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/question-update/:id"
          element={
            user && user.admin ? <UpdateQuestion /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/update/:id"
          element={
            user && user.admin ? <UpdateUser /> : <Navigate to="/admin" />
          }
        />
        <Route path="/more/:id" element={<More />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
