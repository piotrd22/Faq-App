import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AddNewQuestion() {
  const { user } = useSelector((state) => state.auth);

  const notify = () =>
    toast.success("Question has been added!", {
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

  const fetchPostQuestion = async (data) => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.post(
      `${import.meta.env.VITE_PORT}/questions`,
      data,
      config
    );

    return res.data;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const question = {
      body: data.question,
      answer: data.answer,
    };

    fetchPostQuestion(question)
      .then(() => {
        notify();
        reset();
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };

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
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Question</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("question", {
            required: "This field is required!",
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        {errors.question && (
          <div className="my-2">{errors.question.message}</div>
        )}
        <label className="mt-5 mb-2">Answer</label>
        <textarea
          className="textarea textarea-bordered w-full h-52"
          {...register("answer", {
            required: "This field is required!",
          })}
        />
        {errors.answer && <div className="my-2">{errors.answer.message}</div>}

        <button className="btn my-5 mx-auto flex">Add question</button>
      </form>
    </div>
  );
}
