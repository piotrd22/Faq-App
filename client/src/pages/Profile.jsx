import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import PasswordStrengthBar from "react-password-strength-bar";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [initialState, setInitialState] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifyUpdate = () => {
    toast.success("User has been updated!", {
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

  const notifyError = (error) => {
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
  };

  const getUser = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_PORT}/users/${user._id}`,
      config
    );

    return res.data;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    getUser()
      .then((res) => {
        setValue("login", res.username, { shouldTouch: true });
        setValue("isAdmin", res.admin, { shouldTouch: true });
        setAdmin(res.admin);
        setPassword("");
        setInitialState({
          username: res.username,
          password: "",
          old_password: "",
          admin: res.admin,
        });
      })
      .catch((error) => console.log(error));
  }, []);

  const valueToSubmitChecker = (initialState, user) => {
    const newuser = user;
    const keys = Object.keys(initialState);

    keys.forEach((key) => {
      if (initialState[key] === newuser[key] && key !== "_id")
        delete newuser[key];
    });

    return newuser;
  };

  const fetchUpdateUser = async (data) => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.put(
      `${import.meta.env.VITE_PORT}/users/${user._id}`,
      data,
      config
    );

    return res.data;
  };

  const onSubmit = (data) => {
    const user = {
      username: data.login,
      admin: data.isAdmin,
      old_password: data.old_password,
      password: data.password,
    };

    const dataToSubmit = valueToSubmitChecker(initialState, user);

    fetchUpdateUser(dataToSubmit)
      .then(() => {
        notifyUpdate();
        getUser()
          .then((res) => {
            setValue("login", res.username, { shouldTouch: true });
            setValue("isAdmin", res.admin, { shouldTouch: true });
            setValue("password", "", { shouldTouch: true });
            setValue("old_password", "", { shouldTouch: true });
            setAdmin(res.admin);
            setInitialState({
              username: res.username,
              password: "",
              old_password: "",
              admin: res.admin,
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        if (error.response.data) {
          notifyError(error.response.data);
        } else {
          console.log(error);
          alert(error);
        }
      });
  };

  const fetchDeleteAccount = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.delete(
      `${import.meta.env.VITE_PORT}/users/${user._id}`,
      config
    );

    return res.data;
  };

  const refreshPage = () => window.location.reload();

  const deleteAccount = () => {
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
        fetchDeleteAccount()
          .then(() => {
            navigate("/");
            dispatch(logout());
            refreshPage();
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      }
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
      <h1 className="text-center mt-3 mb-3 text-3xl">UPDATE YOUR ACCOUNT</h1>
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
        <label className="mt-5 mb-2">Old password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          {...register("old_password")}
        />
        <label className="mt-5 mb-2">New Password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          {...register("password", {
            onChange: (e) => setPassword(e.target.value),
          })}
        />
        {password && (
          <PasswordStrengthBar password={password} className="mt-2" />
        )}
        {user && user.admin && (
          <div className="form-control my-2">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                {...register("isAdmin", {
                  onChange: () => setAdmin((prev) => !prev),
                })}
              />
              <span className="label-text">
                {admin ? "Admin" : "Moderator"}
              </span>
            </label>
          </div>
        )}

        <button className="btn my-5 mx-auto flex">UPDATE</button>
      </form>
      <div className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto">
        <h4 className="self-center">Delete account</h4>
        <p className="self-center">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button className="btn my-5 mx-auto flex" onClick={deleteAccount}>
          DELETE YOUR ACCOUNT
        </button>
      </div>
    </div>
  );
}
