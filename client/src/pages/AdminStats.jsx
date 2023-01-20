import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CountUp from "react-countup";
import axios from "axios";

export default function AdminStats() {
  const [stats, setStats] = useState({});
  const [searchParams, setSearchParams] = useSearchParams({});
  const [search, setSearch] = useState(
    searchParams.get("search") ? searchParams.get("search") : ""
  );

  const { user } = useSelector((state) => state.auth);

  const getStats = async () => {
    try {
      const config = {
        headers: {
          token: "Bearer " + user.accessToken,
        },
      };

      const searchParam = searchParams.get("search");
      const url = `${import.meta.env.VITE_PORT}/stats`;

      if (searchParam) {
        const response = await axios.get(url + `?search=${search}`, config);
        setStats(response.data);
      } else {
        const response = await axios.get(url, config);
        setStats(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setSearchParams({ search: e.target.value });
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearch("");
  };

  useEffect(() => {
    setSearch(searchParams.get("search") ? searchParams.get("search") : "");
    getStats();
  }, [searchParams]);

  return (
    <div className="container mx-auto p-3">
      <div>
        <select
          className="select w-full max-w-xs input-bordered"
          onChange={handleSearch}
          value={search}
        >
          <option disabled value="">
            Get stats:
          </option>
          <option value="">All</option>
          <option value="day">From last day</option>
          <option value="week">From last week</option>
          <option value="month">From last month</option>
          <option value="year">From last year</option>
        </select>
      </div>
      <div className="stats stats-vertical lg:stats-horizontal shadow mt-6 w-full">
        <div className="stat">
          <div className="stat-title">New Questions</div>
          <div className="stat-value">
            <CountUp end={stats.questions} />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">New Users</div>
          <div className="stat-value">
            <CountUp end={stats.users} />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">New Comments</div>
          <div className="stat-value">
            <CountUp end={stats.comments} />
          </div>
        </div>
      </div>
    </div>
  );
}
