import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AddNewQuestion from "./pages/AddNewQuestion";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="add-new-question" element={<AddNewQuestion />} />
      </Routes>
    </div>
  );
}

export default App;
