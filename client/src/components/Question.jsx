export default function Question(props) {
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium">{props.body}</div>
      <div className="collapse-content">
        <p>{props.answer}</p>
        <p className="mt-5">
          Created: {new Date(props.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
