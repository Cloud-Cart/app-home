import * as React from "react";
import {useCallback} from "react";

type Props = {
    usage: 'default' | 'option' | 'button'
}

export const MicrosoftMethod = (props: Props) => {
    const login = useCallback(() => {
        const CLIENT_ID = process.env.NEXT_PUBLIC_MSAL_CLIENT_ID;
        const TENANT_ID = process.env.NEXT_PUBLIC_MSAL_TENANT_ID
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/microsoft`
        window.location.href = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&response_mode=query&scope=User.Read`
    }, [])

    if (props.usage === 'button') {
        return <button className={'w-full p-4 flex justify-center items-center rounded bg-gray-200'} onClick={login}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 32 32" fill="none">
                <rect x="17" y="17" width="10" height="10" fill="#FEBA08"/>
                <rect x="5" y="17" width="10" height="10" fill="#05A6F0"/>
                <rect x="17" y="5" width="10" height="10" fill="#80BC06"/>
                <rect x="5" y="5" width="10" height="10" fill="#F25325"/>
            </svg>
            <span className={'hidden'}>login with microsoft</span>
        </button>
    }
    if (props.usage === 'default') {
        return <button
            className={'flex flex-row justify-center items-center gap-2 mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md'}
            onClick={login}>
            <span className={'font-semibold'}>Login with Microsoft</span>
        </button>
    }
    return (
        <button onClick={login}
                className={'flex flex-row justify-start gap-5 hover:bg-gray-200 w-full items-center rounded-md p-1'}>
            <div className={'bg-gray-700 rounded p-2'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path
                        d="M4 4H11.5V11.5H4V4ZM12.5 4H20V11.5H12.5V4ZM4 12.5H11.5V20H4V12.5ZM12.5 12.5H20V20H12.5V12.5Z"
                        fill="#FFFFFF"/>
                </svg>
            </div>
            <span className={'text-gray-600 font-semibold'}>Login with Microsoft</span>
        </button>
    );
};