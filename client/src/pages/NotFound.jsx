import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto p-5">
      <Link to="" className="btn">
        &#8592; Back
      </Link>
      <h1 className="text-center mt-3 mb-10 text-3xl">404 - Page not found</h1>
    </div>
  );
}
