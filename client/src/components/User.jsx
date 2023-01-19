import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function User({ user, setUsers }) {
  const { user: curruser } = useSelector((state) => state.auth);

  const notifyDelete = () =>
    toast.success("User has been deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = () => {
    toast.error("Something went wrong!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const fetchDeleteUser = async () => {
    const config = {
      headers: {
        token: "Bearer " + curruser.accessToken,
      },
    };

    const res = await axios.delete(
      `${import.meta.env.VITE_PORT}/users/${user._id}`,
      config
    );

    return res.data;
  };

  const deleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchDeleteUser()
          .then(() => {
            notifyDelete();
            setUsers((prev) => prev.filter((x) => x._id !== user._id));
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="w-full flex items-center border border-base-300 bg-base-100 rounded-xl p-3 my-4">
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
      <div className="flex justify-between w-1/2 px-5">
        <h5 className="font-bold">{user.username}</h5>
      </div>
      <div className="w-1/4">
        <h5>{user.admin ? "admin" : "moderator"}</h5>
      </div>
      {!user.admin && (
        <div className="flex justify-end w-1/4">
          <Link to={`/update/${user._id}`}>
            <FiEdit className="mx-3 cursor-pointer" />
          </Link>
          <ImBin className="mx-3 cursor-pointer" onClick={deleteUser} />
        </div>
      )}
    </div>
  );
}
