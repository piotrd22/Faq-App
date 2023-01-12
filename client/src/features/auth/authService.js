import axios from "axios";

const signup = async (user) => {
  const res = await axios.post(`http://localhost:8080/api/auth/signup`, user);
  return res.data;
};

const signin = async (user) => {
  const res = await axios.post(`http://localhost:8080/api/auth/signin`, user);
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const logout = () => localStorage.removeItem("user");

const authService = {
  signup,
  signin,
  logout,
};

export default authService;
