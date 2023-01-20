import axios from "axios";
import { useState, useEffect } from "react";
import Question from "../components/Question";
import { ToastContainer } from "react-toastify";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function Home() {
  const [questions, setQuesions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [sort, setSort] = useState(
    searchParams.get("sort") ? searchParams.get("sort") : ""
  );
  const [resultsFor, setResultsFor] = useState(
    searchParams.get("search")
      ? `Results for: ${searchParams.get("search")}`
      : ""
  );

  const { user } = useSelector((state) => state.auth);

  const getQuestions = async () => {
    try {
      const searchParam = searchParams.get("search");
      const sortParam = searchParams.get("sort");
      const url = `${import.meta.env.VITE_PORT}/questions`;

      if (searchParam && sortParam) {
        const response = await axios.get(
          url + `?search=${searchParam}&sort=${sort}`
        );
        setQuesions(response.data);
      } else if (searchParam) {
        const response = await axios.get(url + `?search=${searchParam}`);
        setQuesions(response.data);
      } else if (sortParam) {
        const response = await axios.get(url + `?sort=${sort}`);
        setQuesions(response.data);
      } else {
        const response = await axios.get(url);
        setQuesions(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (data) => {
    setSearchParams({ search: data.search });
    setResultsFor(`Results for: ${data.search}`);
    reset();
  };

  const handleSort = (e) => {
    e.preventDefault();
    setSort(e.target.value);
    setSearchParams(
      searchParams.get("search")
        ? { search: searchParams.get("search"), sort: e.target.value }
        : { sort: e.target.value }
    );
  };

  const clearSearch = () => {
    setSearchParams({});
    setResultsFor("");
    setSort("");
  };

  useEffect(() => {
    setSort(searchParams.get("sort") ? searchParams.get("sort") : "");
    getQuestions();
    setResultsFor(
      searchParams.get("search")
        ? `Results for: ${searchParams.get("search")}`
        : ""
    );
  }, [searchParams]);

  const questionComponents = questions.map((question) => (
    <Question
      key={question._id}
      question={question}
      setQuestions={setQuesions}
    />
  ));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <div className="container mx-auto p-3">
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
      <div className="flex justify-between">
        <form className="form-control" onSubmit={handleSubmit(handleSearch)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered"
              {...register("search", {
                required: "This field is required!",
                pattern: {
                  value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                  message: "This field can't start or end with whitespace!",
                },
              })}
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className="my-2 h-5">
            {errors.search ? errors.search.message : ""}
          </div>
        </form>
        <select
          className="select w-full max-w-xs input-bordered"
          onChange={handleSort}
          value={sort}
        >
          <option disabled value="">
            Sort by:
          </option>
          <option value="desc">From the latest</option>
          <option value="asc">From the oldest</option>
        </select>
      </div>
      {resultsFor && (
        <div className="flex items-center justify-between mt-5">
          <div className="text-lg">{resultsFor}</div>
          <button onClick={clearSearch} className="btn btn-active">
            CLEAR SEARCH
          </button>
        </div>
      )}
      {user && user.admin && (
        <Link to="add-new-question" className="btn mt-5">
          Add new Question
        </Link>
      )}
      {questions.length > 0 ? (
        questionComponents
      ) : (
        <div className="my-3 text-center">No questions</div>
      )}
    </div>
  );
}
