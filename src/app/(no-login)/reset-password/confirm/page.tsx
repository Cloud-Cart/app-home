'use client'
import {useState} from "react";
import {ConfirmResetPassword} from "@/app/(no-login)/reset-password/confirm/ConfirmResetPassword";

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