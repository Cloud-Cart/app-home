import {ResetPasswordForm} from "@/app/(no-auth)/reset-password/ResetPasswordForm";


export default function Page() {
    return <>
        <div className={'container w-fit h-fit mb-4'}>
            <h3 className={'text-2xl font-bold'}>Reset Password</h3>
            <p className={'font-light mt-2 text-sm text-gray-500'}>Enter your email to reset your password</p>
        </div>
        <ResetPasswordForm/>
    </>;
}