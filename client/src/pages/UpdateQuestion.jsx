import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdClose } from "react-icons/md";

export default function UpdateQuestion() {
  const id = useParams().id;
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [prevAnswer, setPrevAnswer] = useState("");
  const [isEmoji, setIsEmoji] = useState(false);

  const getQuestion = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/questions/${id}`);

    return res.data;
  };

  useEffect(() => {
    getQuestion()
      .then((res) => {
        setValue("question", res.body, { shouldTouch: true });
        setValue("answer", res.answer, { shouldTouch: true });
        setPrevAnswer(res.answer);
      })
      .catch((error) => console.log(error));
  }, []);

  const notifyUpdate = () => {
    toast.success("Question has been updated!", {
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

  const fetchUpdateQuestion = async (data) => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.put(
      `${import.meta.env.VITE_PORT}/questions/${id}`,
      data,
      config
    );

    return res.data;
  };

  const onEmojiSelect = (e) => {
    setPrevAnswer((prev) => prev + e.native);
    setValue("answer", prevAnswer + e.native, { shouldTouch: true });
  };

  const onSubmit = (data) => {
    setPrevAnswer("");
    setIsEmoji(false);
    const question = {
      body: data.question,
      answer: data.answer,
    };

    fetchUpdateQuestion(question)
      .then(() => {
        notifyUpdate();
        navigate("/");
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  return (
    <div className="container mx-auto p-5">
      <Link to="/" className="btn">
        &#8592; Back
      </Link>
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto relative"
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

        <div className="flex justify-between">
          <button type="submit" className="btn my-5 flex">
            Add question
          </button>
          <button
            className="btn my-5 flex text-3xl"
            onClick={() => setIsEmoji(!isEmoji)}
            type="button"
          >
            {isEmoji ? <MdClose /> : <MdOutlineEmojiEmotions />}
          </button>
        </div>
        {isEmoji && (
          <div className="absolute right-0 bottom-16">
            <Picker
              className="w-full"
              data={data}
              onEmojiSelect={onEmojiSelect}
              perLine={5}
            />
          </div>
        )}
      </form>
    </div>
  );
}
