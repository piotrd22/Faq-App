import { useForm } from "react-hook-form"

export default function AdminLogin(){
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    async function onSubmit(data){
        reset();
    };

    return (
        <div className="container mx-auto p-5">
            <form className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <label className="mt-5 mb-2">Login</label>
                <input className="input input-bordered w-full" type="text" {...register("login", {required: true})} />
                {errors.login && <div className="my-2">This field is required!</div>}
                <label className="mt-5 mb-2">Password</label>
                <input className="input input-bordered w-full" type="password" {...register("password", {required: true})} />
                {errors.password && <div className="my-2">This field is required!</div>}
            
                <button className="btn my-5 mx-auto flex">LOGIN</button>
            </form>
        </div>
    )
}