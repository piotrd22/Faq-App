import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../features/auth/authSlice";
import { useState } from "react";

export default function AdminLogin() {
  const [isFailed, setIsFailed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const user = {
      username: data.login,
      password: data.password,
    };

    dispatch(signin(user))
      .unwrap()
      .then(() => {
        reset();
        setIsFailed(false);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsFailed(true);
          }
        } else alert(error);
      });
  };

  return (
    <div className="container mx-auto p-5">
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Login</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("login", { required: true })}
        />
        {errors.login && <div className="my-2">This field is required!</div>}
        <label className="mt-5 mb-2">Password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <div className="my-2">This field is required!</div>}

        <button className="btn my-5 mx-auto flex">LOGIN</button>
        {isFailed && (
          <div className="my-4 text-center text-xl">Login failed!</div>
        )}
      </form>
    </div>
  );
}
