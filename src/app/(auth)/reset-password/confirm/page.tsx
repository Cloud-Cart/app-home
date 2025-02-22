'use client'
import {ConfirmResetPassword} from "@/app/(auth)/reset-password/confirm/ConfirmResetPassword";
import {useState} from "react";

export default function Page() {
    const [subtext, setSubtext] = useState('');

    return <>
        <div className={'container w-fit h-fit mb-4'}>
            <h3 className={'text-2xl font-bold'}>Reset Password</h3>
            <p className={'font-light mt-2 text-sm text-gray-500'}>{subtext}</p>
        </div>
        <ConfirmResetPassword setSubtext={setSubtext}/>
    </>;
}