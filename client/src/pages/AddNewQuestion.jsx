import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function AddNewQuestion(){
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    async function onSubmit(data){
        reset();
    };

    return (
        <div className="container mx-auto p-5">
            <Link to="/" className="btn">&#8592; Back</Link>
            <form className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <label className="mt-5 mb-2">Question</label>
                <input className="input input-bordered w-full" type="text" {...register("question", {required: true})} />
                {errors.question && <div className="my-2">This field is required!</div>}
                <label className="mt-5 mb-2">Answer</label>
                <textarea className="textarea textarea-bordered w-full h-52" {...register("answer", {required: true})} />
                {errors.answer && <div className="my-2">This field is required!</div>}
            
                <button className="btn my-5 mx-auto flex">Add question</button>
            </form>
        </div>
    )
}