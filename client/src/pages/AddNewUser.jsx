import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";

export default function AddNewUser() {
  const { user } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);

  const notify = () =>
    toast.success("User has been added!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = (error) =>
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const fetchPostUser = async (data) => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.post(
      `${import.meta.env.VITE_PORT}/auth/signup`,
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
    const newUser = {
      username: data.username,
      password: data.password,
      admin: data.isAdmin,
    };

    fetchPostUser(newUser)
      .then(() => {
        notify();
        reset();
      })
      .catch((error) => {
        if (error.response.data) {
          notifyError(error.response.data);
        } else {
          alert(error);
        }
      });
  };

  return (
    <div className="container mx-auto p-5">
      <Link to="/admin-panel" className="btn">
        &#8592; Back
      </Link>
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Username</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("username", {
            required: "This field is required!",
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        {errors.username && (
          <div className="my-2">{errors.username.message}</div>
        )}
        <label className="mt-5 mb-2">Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          {...register("password", {
            onChange: (e) => setPassword(e.target.value),
            required: "This field is required!",
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        <PasswordStrengthBar password={password} className="mt-2" />
        {errors.password && (
          <div className="mb-2">{errors.password.message}</div>
        )}

        <div className="form-control my-2">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              {...register("isAdmin", {
                onChange: () => setAdmin((prev) => !prev),
              })}
            />
            <span className="label-text">{admin ? "Admin" : "Moderator"}</span>
          </label>
        </div>

        <button className="btn my-5 mx-auto flex">Add user</button>
      </form>
    </div>
  );
}
