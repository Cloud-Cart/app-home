import {LoginForm} from "@/app/(auth)/login/loginForm";

export default function Login() {
    return (
        <>
            <div className={'container w-fit h-fit mb-4'}>
                <h3 className={'text-2xl font-bold'}>Log in</h3>
                <p className={'font-semibold text-sm text-gray-500'}>Continue to Cloud Cart</p>
            </div>
            <LoginForm/>
        </>
    );
}
