import { ImBin } from "react-icons/im";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function ({ reply, setReplies }) {
  const { user } = useSelector((state) => state.auth);
  const notifyDelete = () =>
    toast.success("Comment has been deleted!", {
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
  const fetchDeleteReply = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.delete(
      `${import.meta.env.VITE_PORT}/replies/${reply._id}`,
      config
    );

    return res.data;
  };
  const deleteReply = () => {
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
        fetchDeleteReply()
          .then(() => {
            notifyDelete();
            setReplies((prev) => prev.filter((x) => x._id !== reply._id));
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      }
    });
  };
  return (
    <div className="flex w-full flex-wrap border border-base-300 bg-base-100 rounded-box p-3 my-1">
      <div className="w-full">
        <div className="font-bold text-lg">{reply.username}</div>
        <div>{reply.body}</div>
      </div>
      <div className="flex items-end justify-end w-full mt-2">
        <div className="flex items-center">
          <div className="mx-2">
            {new Date(reply.createdAt).toLocaleDateString()}
          </div>
          {user && (
            <ImBin className="mx-2 cursor-pointer" onClick={deleteReply} />
          )}
        </div>
      </div>
    </div>
  );
}
