'use client';
import {FacebookMethod} from "@/components/login/FacebookMethod";
import {MicrosoftMethod} from "@/components/login/MicrosoftMethod";
import {GoogleMethod} from "@/components/login/GoogleMethod";
import {PasskeyMethod} from "@/components/login/PasskeyMethod";

export const LoginFunctions = () => {
    return (
        <>
            <PasskeyMethod usage={'button'}/>
            <div className={'flex flex-row items-center h-4 gap-6 my-3'}>
                <hr className={'w-full h-0.5'}/>
                or
                <hr className={'w-full'}/>
            </div>
            <div className={'flex flex-row items-center gap-3'}>
                <FacebookMethod usage={'button'}/>
                <GoogleMethod usage={'button'}/>
                <MicrosoftMethod usage={'button'}/>
            </div>
        </>
    );
};