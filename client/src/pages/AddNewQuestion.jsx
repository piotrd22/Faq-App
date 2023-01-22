import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function AddNewQuestion() {
  const { user } = useSelector((state) => state.auth);
  const [prevAnswer, setPrevAnswer] = useState("");
  const [isEmoji, setIsEmoji] = useState(false);

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

  const onEmojiSelect = (e) => {
    setPrevAnswer((prev) => prev + e.native);
    setValue("answer", prevAnswer + e.native, { shouldTouch: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    setPrevAnswer("");
    setIsEmoji(false);
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
          onChange={(e) => setPrevAnswer(e.target.value)}
        />
        {errors.answer && <div className="my-2">{errors.answer.message}</div>}
        <button
          className="btn my-5 mx-auto flex"
          onClick={() => setIsEmoji(!isEmoji)}
          type="button"
        >
          Pick an emoji
        </button>
        {isEmoji && (
          <div className="flex justify-center">
            <Picker data={data} onEmojiSelect={onEmojiSelect} />
          </div>
        )}
        <button type="submit" className="btn my-5 mx-auto flex">
          Add question
        </button>
      </form>
    </div>
  );
}
