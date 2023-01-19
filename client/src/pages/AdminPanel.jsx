import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import User from "../components/User";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const getUsers = async () => {
    try {
      const url = `${import.meta.env.VITE_PORT}/users`;
      const config = {
        headers: {
          token: "Bearer " + user.accessToken,
        },
      };
      const response = await axios.get(url, config);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const userComponents = users.map((user) => (
    <User key={user._id} user={user} setUsers={setUsers} />
  ));

  return (
    <div className="container mx-auto p-3">
      <h1 className="text-center mt-3 mb-10 text-3xl">ADMIN PANEL</h1>
      <Link to="add-new-user" className="btn">
        Add new User
      </Link>
      <h2 className="text-2xl mt-7 mb-3">Users:</h2>
      {userComponents}
    </div>
  );
}
