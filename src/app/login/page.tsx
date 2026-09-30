import LoginEmail from "./LoginEmail";
import LoginGoogle from "./LoginGoogle";

export default function LoginPage(){
    return(
        <main className=" flex min-h-screen items-center justify-center 
        bg-gray-100 px-4 px-24">
            <section className="w-full max-w-md rounded-2xl bg-whit p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Login to continue booking movies
                    </p>
                </div>
{/* login with google */}
                <LoginGoogle/>

                <div className="my-6 flex items-center gap-4">
                    <div className=" h-px flex-1 bg-gray-200"/>
                        <span className=" text-sm text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200"/>
                    
                </div>

{/* login with email */}
                <LoginEmail/>

            </section>
        </main>
    )
}
