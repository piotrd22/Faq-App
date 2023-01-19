import { useSelector } from "react-redux";
import { ImBin } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Comment({ comment, setComments }) {
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

  const fetchDeleteComment = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.delete(
      `${import.meta.env.VITE_PORT}/comments/${comment._id}`,
      config
    );

    return res.data;
  };

  const deleteComment = () => {
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
        fetchDeleteComment()
          .then(() => {
            notifyDelete();
            setComments((prev) => prev.filter((x) => x._id !== comment._id));
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="flex justify-between border border-base-300 bg-base-100 rounded-box p-6 my-3">
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
      <div>
        <div className="font-bold text-lg">{comment.username}</div>
        <div>{comment.body}</div>
      </div>
      <div className="flex items-end">
        <div className="flex items-center">
          <div className="mx-2">
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
          {user && (
            <ImBin className="mx-2 cursor-pointer" onClick={deleteComment} />
          )}
        </div>
      </div>
    </div>
  );
}
