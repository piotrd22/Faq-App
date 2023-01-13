import axios from "axios";
import { useState, useEffect }  from "react";
import Question from "../components/Question";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [questions, setQuesions] = useState([]);
  const [search, setSearch] = useState("");
  const [resultsFor, setResultsFor] = useState("");
  const [searchParams, setSearchParams] = useSearchParams({});

  const getQuestions = async () => {
    try {
      const searchParam = searchParams.get("search");
      const url = "http://localhost:8080/api/questions";
      const response = await axios.get(searchParam ? url + `?search=${search}` : url);
      setQuesions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: search });
    setResultsFor(`Results for: ${search}`);
  };

  const clearSearch = () => {
    setSearchParams({});
    setResultsFor("");
    setSearch("");
  };

  useEffect(() => {
    getQuestions();
  }, [searchParams]);

  const questionComponents = questions.map((question) => (
    <Question
      key={question._id}
      id={question._id}
      body={question.body}
      answer={question.answer}
      updatedAt={question.updatedAt}
    />
  ));

  return (
    <div className="container mx-auto p-3">
      <form className="form-control" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
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
      </form>
      {resultsFor && (
        <div className="flex justify-between">
          <div className="my-7 text-lg">{resultsFor}</div>
          <button onClick={clearSearch} className="btn btn-active">
            CLEAR SEARCH
          </button>
        </div>
      )}
      {questionComponents}
    </div>
  );
}
