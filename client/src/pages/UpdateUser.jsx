import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateUser() {
  const id = useParams().id;
  const { user } = useSelector((state) => state.auth);

  const [admin, setAdmin] = useState(false);

  const getUser = async () => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_PORT}/users/${id}`,
      config
    );

    return res.data;
  };

  useEffect(() => {
    getUser()
      .then((res) => {
        setValue("isAdmin", res.admin, { shouldTouch: true });
        setAdmin(res.admin);
      })
      .catch((error) => console.log(error));
  }, []);

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

  const fetchUpdateUser = async (data) => {
    const config = {
      headers: {
        token: "Bearer " + user.accessToken,
      },
    };

    const res = await axios.put(
      `${import.meta.env.VITE_PORT}/users/${id}`,
      data,
      config
    );

    return res.data;
  };

  const onSubmit = (data) => {
    const user = {
      admin: data.isAdmin,
    };

    fetchUpdateUser(user)
      .then(() => {
        notifyUpdate();
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };

  const { register, handleSubmit, setValue } = useForm();

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
      <Link to="/admin-panel" className="btn">
        &#8592; Back
      </Link>
      <form
        className="mt-10 flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control my-2">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              {...register("isAdmin", {
                onChange: () => setAdmin((prev) => !prev),
              })}
            />
            <span className="label-text ml-20">
              {admin ? "Admin" : "Moderator"}
            </span>
          </label>
        </div>

        <button className="btn my-5 mx-auto flex">UPDATE</button>
      </form>
    </div>
  );
}
