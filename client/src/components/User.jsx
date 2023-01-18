import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";

export default function User({ user }) {
  return (
    <div className="w-full flex items-center border rounded-xl p-3 my-4">
      <div className="flex justify-between w-1/2 px-5">
        <h5 className="font-bold">{user.username}</h5>
      </div>
      <div className="w-1/4">
        <h5>{user.admin ? "admin" : "moderator"}</h5>
      </div>
      <div className="flex justify-end w-1/4">
        <FiEdit className="mx-3" />
        <ImBin className="mx-3" />
      </div>
    </div>
  );
}
