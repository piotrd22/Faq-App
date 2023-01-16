import { ImBin } from "react-icons/im"
import { FiEdit } from "react-icons/fi"

export default function Question({body, answer, updatedAt}) {

  const deleteQuestion = () => {

  }

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium">{body}</div>
      <div className="collapse-content flex justify-between">
        <div>
          <p>{answer}</p>
          <button className="btn my-3">COMMENTS</button>
          <p className="mt-5">
            Created: {new Date(updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-end">
          <FiEdit className="mx-5 cursor-pointer"/>
          <ImBin className="cursor-pointer" onClick={deleteQuestion} />
        </div>
      </div>
    </div>
  );
}
