import { useSelector } from "react-redux";
import { ImBin } from "react-icons/im";
import { ImReply } from "react-icons/im";
import { toast } from "react-toastify";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Filter from "bad-words";
import { profanityList } from "../assets/profanity";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Reply from "./Reply";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";

export default function Comment({ comment, setComments }) {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [replies, setReplies] = useState([]);
  const [prevComment, setPrevComment] = useState("");
  const [isEmoji, setIsEmoji] = useState(false);

  const notify = () =>
    toast.success("Reply has been added!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const filter = new Filter();
  filter.addWords(...profanityList);

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
      `${import.meta.env.VITE_PORT}/comments/${comment._id}/${id}`,
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

  const getReplies = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_PORT}/comments/${comment._id}`
    );
    const resp = await res.data.replies;
    setReplies(resp);
  };

  useEffect(() => {
    try {
      getReplies();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onEmojiSelect = (e) => {
    setPrevComment((prev) => prev + e.native);
    setValue("comment", prevComment + e.native, { shouldTouch: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const fetchPostReply = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/replies`, data);

    return res.data;
  };

  const onSubmit = (data) => {
    setPrevComment("");
    setIsEmoji(false);
    const reply = {
      body: data.comment,
      username: data.username ? data.username : "Guest",
      commentId: comment._id,
    };

    fetchPostReply(reply)
      .then((res) => {
        setReplies((prev) => [res, ...prev]);
        notify();
        reset();
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };

  const replyComponents = replies.map((x) => (
    <Reply
      key={x._id}
      reply={x}
      setReplies={setReplies}
      commentId={comment._id}
    />
  ));

  const removeEmojis = (str) => {
    const emojiRegex =
      /(\p{EPres}|\p{ExtPict})(\u200d(\p{EPres}|\p{ExtPict}))*/gu;
    return str.replace(emojiRegex, "");
  };

  return (
    <div className="flex flex-wrap border border-base-300 bg-base-100 rounded-box p-3 my-3">
      <div className="w-full">
        <div className="font-bold text-lg">
          {filter.clean(comment.username)}
        </div>
        <div>
          {removeEmojis(comment.body).length > 0
            ? filter.clean(comment.body)
            : comment.body}
        </div>
      </div>
      <div className="flex items-end justify-end w-full mt-2">
        <div className="flex items-center">
          <div className="mx-2">
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
          {user && (
            <ImBin className="mx-2 cursor-pointer" onClick={deleteComment} />
          )}
        </div>
      </div>

      {replies.length === 0 ? (
        <div className="w-full collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6 ">
          <input type="checkbox" className="peer p-0 min-h-0" />
          <div className="flex collapse-title text-l items-center font-medium ">
            Reply
            <ImReply className="mx-2" />
          </div>
          <div className="collapse-content p-0 ">
            <form
              className="mt-6 sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto relative "
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                placeholder="Username (optional)"
                className="input input-bordered w-full my-3"
                {...register("username", {
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                    message: "This field can't start or end with whitespace!",
                  },
                })}
              />
              {errors.username && (
                <div className="my-2">{errors.comment.message}</div>
              )}
              <div className="flex items-center">
                <input
                  placeholder="Comment..."
                  className="input input-bordered w-9/12 sm:w-10/12 my-3"
                  type="text"
                  {...register("comment", {
                    required: "This field is required!",
                    pattern: {
                      value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                      message: "This field can't start or end with whitespace!",
                    },
                  })}
                  onChange={(e) => setPrevComment(e.target.value)}
                />
                <button
                  className="btn w-3/12 sm:w-2/12"
                  onClick={() => setIsEmoji(!isEmoji)}
                  type="button"
                >
                  {isEmoji ? (
                    <MdClose className="text-3xl" />
                  ) : (
                    <MdOutlineEmojiEmotions className="text-3xl" />
                  )}
                </button>
              </div>

              {errors.comment && (
                <div className="my-2">{errors.comment.message}</div>
              )}
              <div className="flex justify-between">
                <button type="submit" className="btn my-5 flex">
                  REPLY
                </button>
                {isEmoji && (
                  <div className="right-0 top-36 z-40">
                    <Picker
                      className="w-full z-50"
                      data={data}
                      onEmojiSelect={onEmojiSelect}
                      perLine={5}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
          <input type="checkbox" className="peer p-0 min-h-0" />
          <div className="flex collapse-title text-l items-center font-medium">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </div>
          <div className="collapse-content p-0">
            <div className="w-full collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6 ">
              <input type="checkbox" className="peer p-0 min-h-0" />
              <div className="flex collapse-title text-l items-center font-medium ">
                Reply
                <ImReply className="mx-2" />
              </div>
              <div className="collapse-content p-0 ">
                <form
                  className="mt-6 sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto relative "
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <input
                    type="text"
                    placeholder="Username (optional)"
                    className="input input-bordered w-full my-3"
                    {...register("username", {
                      pattern: {
                        value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                        message:
                          "This field can't start or end with whitespace!",
                      },
                    })}
                  />
                  {errors.username && (
                    <div className="my-2">{errors.comment.message}</div>
                  )}
                  <div className="flex items-center">
                    <input
                      placeholder="Comment..."
                      className="input input-bordered w-9/12 sm:w-10/12 my-3"
                      type="text"
                      {...register("comment", {
                        required: "This field is required!",
                        pattern: {
                          value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                          message:
                            "This field can't start or end with whitespace!",
                        },
                      })}
                      onChange={(e) => setPrevComment(e.target.value)}
                    />
                    <button
                      className="btn w-3/12 sm:w-2/12"
                      onClick={() => setIsEmoji(!isEmoji)}
                      type="button"
                    >
                      {isEmoji ? (
                        <MdClose className="text-3xl" />
                      ) : (
                        <MdOutlineEmojiEmotions className="text-3xl" />
                      )}
                    </button>
                  </div>
                  {errors.comment && (
                    <div className="my-2">{errors.comment.message}</div>
                  )}

                  <div className="flex justify-between">
                    <button type="submit" className="btn my-5 flex">
                      REPLY
                    </button>
                    {isEmoji && (
                      <div className="right-0 top-36 z-40">
                        <Picker
                          className="w-full z-50"
                          data={data}
                          onEmojiSelect={onEmojiSelect}
                          perLine={5}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            {replyComponents}
          </div>
        </div>
      )}
    </div>
  );
}
