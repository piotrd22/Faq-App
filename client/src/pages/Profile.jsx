import { useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="container mx-auto p-3">
      <h1 className="text-center my-3 text-3xl">PROFILE</h1>
      <h5 className="text-xl my-3">Username: {user.username}</h5>
      <h5 className="text-xl my-3">
        Role: {user.admin ? "admin" : "moderator"}
      </h5>
    </div>
  );
}
