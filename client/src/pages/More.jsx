import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Comment from "../components/Comment";

export default function More() {
  const id = useParams().id;
  const [question, setQuestion] = useState({});
  const [comments, setComments] = useState([]);

  const notify = () =>
    toast.success("Comment has been added!", {
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

  const fetchQuestion = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/questions/${id}`);

    return res.data;
  };

  useEffect(() => {
    fetchQuestion()
      .then((res) => {
        setQuestion(res);
        setComments(res.comments);
      })
      .catch((error) => console.log(error));
  }, []);

  const fetchPostComment = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/comments`, data);

    return res.data;
  };

  const handleAddComments = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const comment = {
      body: data.comment,
      username: data.username ? data.username : "Guest",
      questionId: question._id,
    };

    fetchPostComment(comment)
      .then((res) => {
        handleAddComments(res);
        notify();
        reset();
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };

  const commentComponents = comments.map((comment) => (
    <Comment key={comment._id} comment={comment} setComments={setComments} />
  ));

  return (
    <div className="container mx-auto p-5">
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
      <Link to="/" className="btn">
        &#8592; Back
      </Link>
      <div className="flex flex-col justify-items-center mt-6 border border-base-300 bg-base-100 rounded-box p-6 my-6">
        <div className=" text-xl font-medium">{question.body}</div>
        <div className="mt-3">
          <p className="whitespace-pre-wrap">{question.answer}</p>
          <div className="flex justify-end items-end">
            <div>
              <p className="mt-3 text-right">
                {new Date(question.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium">Add comment +</div>
        <div className="collapse-content ">
          <form
            className="mt-6 sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Username (optional)"
              className="input input-bordered w-full my-3"
              {...register("username")}
            />
            <input
              placeholder="Comment..."
              className="input input-bordered w-full"
              type="text"
              {...register("comment", { required: true })}
            />
            {errors.comment && (
              <div className="my-2">This field is required!</div>
            )}
            <button className="btn my-5 mx-auto flex">ADD COMMENT</button>
          </form>
        </div>
      </div>

      <h2 className="text-2xl mt-20">Comments: </h2>

      {commentComponents}
    </div>
  );
}
