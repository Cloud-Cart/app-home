'use client';

import {FacebookLogin, GoogleLogin, MicrosoftLogin, PasskeyLogin} from "@/components";

export const LoginFunctions = () => {
    return (
        <>
            <PasskeyLogin usage={'button'}/>
            <div className={'flex flex-row items-center h-4 gap-6 my-3'}>
                <hr className={'w-full h-0.5'}/>
                or
                <hr className={'w-full'}/>
            </div>
            <div className={'flex flex-row items-center gap-3'}>
                <FacebookLogin usage={'button'}/>
                <GoogleLogin usage={'button'}/>
                <MicrosoftLogin usage={'button'}/>
            </div>
        </>
    );
};