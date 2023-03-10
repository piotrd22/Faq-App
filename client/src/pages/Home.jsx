import axios from "axios";
import { useState, useEffect } from "react";
import Question from "../components/Question";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AiOutlineArrowUp } from "react-icons/ai";
import Loader from "../components/Loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [questions, setQuesions] = useState([]);
  const [skip, setSkip] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isTop, setIsTop] = useState(true);
  const [sort, setSort] = useState(
    searchParams.get("sort") ? searchParams.get("sort") : ""
  );
  const [resultsFor, setResultsFor] = useState(
    searchParams.get("search")
      ? `Results for: ${searchParams.get("search")}`
      : ""
  );

  const { user } = useSelector((state) => state.auth);

  const getQuestions = async (skip = 0, shouldClear = false) => {
    try {
      setIsSkipLoading(true);
      const searchParam = searchParams.get("search");
      const sortParam = searchParams.get("sort");
      const url = `${import.meta.env.VITE_PORT}/questions`;

      if (searchParam && sortParam) {
        const response = await axios.get(
          url +
            (`?search=${searchParam}&sort=${sort}` +
              (shouldClear ? "" : `&skip=${skip}`))
        );
        shouldClear
          ? setQuesions([...response.data])
          : setQuesions([...questions, ...response.data]);
        setIsLoading(false);
        setIsSkipLoading(false);
      } else if (searchParam) {
        const response = await axios.get(
          url +
            (`?search=${searchParam}` + (shouldClear ? "" : `&skip=${skip}`))
        );
        shouldClear
          ? setQuesions([...response.data])
          : setQuesions([...questions, ...response.data]);
        setIsLoading(false);
        setIsSkipLoading(false);
      } else if (sortParam) {
        const response = await axios.get(
          url + (`?sort=${sort}` + (shouldClear ? "" : `&skip=${skip}`))
        );
        shouldClear
          ? setQuesions(response.data)
          : setQuesions([...questions, ...response.data]);
        setIsLoading(false);
        setIsSkipLoading(false);
      } else {
        const response = await axios.get(
          url + (shouldClear ? "" : `?skip=${skip}`)
        );
        shouldClear
          ? setQuesions([...response.data])
          : setQuesions([...questions, ...response.data]);
        setIsLoading(false);
        setIsSkipLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
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

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop === 0) {
        setIsTop(true);
      }

      if (scrollTop !== 0) {
        setIsTop(false);
      }

      //infinite scroll pagination
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setSkip(questions.length);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearSearch = () => {
    setSearchParams({});
    setResultsFor("");
    setSort("");
  };

  useEffect(() => {
    setSort(searchParams.get("sort") ? searchParams.get("sort") : "");
    getQuestions(0, true);
    setResultsFor(
      searchParams.get("search")
        ? `Results for: ${searchParams.get("search")}`
        : ""
    );
  }, [searchParams]);

  useEffect(() => {
    getQuestions(skip);
  }, [skip]);

  const questionComponents = questions?.map((question) => (
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

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-3 min-h-screen">
      <div className="w-full flex justify-between flex-wrap">
        <form
          className="w-full sm:w-1/3 form-control"
          onSubmit={handleSubmit(handleSearch)}
        >
          <div className="w-full input-group">
            <input
              type="text"
              placeholder="Search???"
              className="input input-bordered w-full"
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
          className="select w-full sm:w-1/3 input-bordered"
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
        <div>{questionComponents}</div>
      ) : (
        <div className="my-3 text-center">No questions</div>
      )}
      {!isTop && (
        <button
          className="btn btn-square fixed bottom-3 right-3 z-50 "
          onClick={goToTop}
        >
          <AiOutlineArrowUp />
        </button>
      )}
      {isSkipLoading && <Loader />}
    </div>
  );
}
