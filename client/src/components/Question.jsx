import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Question({ question, setQuestions }) {
  const { user } = useSelector((state) => state.auth);

  const notifyDelete = () =>
    toast("Question has been deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const fetchDeleteQuestion = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.delete(
      `http://localhost:8080/api/questions/${question._id}`,
      config
    );

    return res.data;
  };

  const deleteQuestion = () => {
    fetchDeleteQuestion()
      .then(() => {
        notifyDelete();
        setQuestions((prev) => prev.filter((x) => x._id !== question._id));
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
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
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium">{question.body}</div>
      <div className="collapse-content ">
        <p>{question.answer}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="mt-5">{new Date(question.updatedAt).toLocaleDateString()}</p>
          </div>
          {user && user.admin && (
            <div className="flex items-end">
              <FiEdit className="mx-5 cursor-pointer" />
              <ImBin className="cursor-pointer" onClick={deleteQuestion} />
            </div>
          )}
          <button className="btn mt-3">COMMENTS</button>
        </div>
      </div>
    </div>
  );
}
