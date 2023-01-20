import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Question({ question, setQuestions }) {
  const { user } = useSelector((state) => state.auth);

  const notifyDelete = () =>
    toast.success("Question has been deleted!", {
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

  const fetchDeleteQuestion = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.delete(
      `${import.meta.env.VITE_PORT}/questions/${question._id}`,
      config
    );

    return res.data;
  };

  const deleteQuestion = () => {
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
        fetchDeleteQuestion()
          .then(() => {
            notifyDelete();
            setQuestions((prev) => prev.filter((x) => x._id !== question._id));
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium">{question.body}</div>
      <div className="collapse-content ">
        <p className="whitespace-pre-wrap">{question.answer}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="mt-5">
              {new Date(question.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {user && user.admin && (
            <div className="flex items-end">
              <Link to={`/question-update/${question._id}`}>
                <FiEdit className="mx-5 cursor-pointer" />
              </Link>
              <ImBin className="cursor-pointer" onClick={deleteQuestion} />
            </div>
          )}
          <Link to={`/more/${question._id}`}>
            <button className="btn mt-3">COMMENTS</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
