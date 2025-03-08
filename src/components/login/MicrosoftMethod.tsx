import * as React from "react";
import {useCallback, useState} from "react";
import {ButtonLoader, SpinnerLoader} from "@/components";
import {microsoftSocialLogin} from "@/lib/api/auths";
import {useRouter} from "next/navigation";
import {SocialLoginData} from "@/types";

type Props = {
    usage: 'default' | 'option' | 'button',
    email?: string
}

export const MicrosoftMethod = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = useCallback(() => {
        setLoading(true);
        const CLIENT_ID = process.env.NEXT_PUBLIC_MSAL_CLIENT_ID;
        const TENANT_ID = process.env.NEXT_PUBLIC_MSAL_TENANT_ID;
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/callback/microsoft`;

        let authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&response_mode=query&scope=User.Read`;
        if (props.email) authUrl += `&login_hint=${encodeURIComponent(props.email)}`;

        const width = 500, height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(authUrl, "Microsoft Login", `width=${width},height=${height},top=${top},left=${left}`);
        if (!popup) {
            console.error("Popup blocked! Allow popups and try again.");
            setLoading(false);
            return;
        }

        const handleMessage = (event: MessageEvent<{ code: string, provider: string }>) => {
            if (event.origin !== window.location.origin || !event.data.provider || event.data.provider !== 'microsoft') return;
            const data: SocialLoginData = {
                code: event.data.code,
                redirectUri: REDIRECT_URI
            }
            microsoftSocialLogin(data)
                .then(data => {
                    console.log("Microsoft login response:", data);
                })
                .catch(
                    ({status}) => {
                        if (status === 206) router.push("/auth/second-step/")
                    }
                )
                .finally(() => setLoading(false));
            window.removeEventListener("message", handleMessage);
            popup.close();
        };
        window.addEventListener("message", handleMessage);

        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                window.removeEventListener("message", handleMessage);
                setLoading(false);
            }
        }, 1000);
    }, [props.email]);


    if (props.usage === 'button') {
        return <button
            className={'w-full p-4 flex justify-center items-center rounded bg-gray-200'}
            onClick={login}
            disabled={loading}
        >
            {
                loading ?
                    <SpinnerLoader fill={'#80BC06'} width={'20px'} height={'20px'}/>
                    :
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 32 32"
                             fill="none">
                            <rect x="17" y="17" width="10" height="10" fill="#FEBA08"/>
                            <rect x="5" y="17" width="10" height="10" fill="#05A6F0"/>
                            <rect x="17" y="5" width="10" height="10" fill="#80BC06"/>
                            <rect x="5" y="5" width="10" height="10" fill="#F25325"/>
                        </svg>
                        <span className={'hidden'}>login with microsoft</span>
                    </>
            }
        </button>
    }
    if (props.usage === 'default') {
        return <button
            className={'flex flex-row justify-center items-center gap-2 mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md disabled:opacity-50'}
            onClick={login}
            disabled={loading}
        >
            {
                loading ?
                    <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/>
                    :
                    <span className={'font-semibold'}>Login with Microsoft</span>
            }
        </button>
    }
    return (
        <button
            onClick={login}
            className={'flex flex-row justify-start gap-5 hover:bg-gray-200 w-full items-center rounded-md p-1'}
            disabled={loading}
        >
            <div className={'bg-gray-700 rounded p-2'}>
                {
                    loading ?
                        <SpinnerLoader fill={'#FFFFFF'} width={'20px'} height={'20px'}/>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"
                             fill="#FFFFFF">
                            <path
                                d="M4 4H11.5V11.5H4V4ZM12.5 4H20V11.5H12.5V4ZM4 12.5H11.5V20H4V12.5ZM12.5 12.5H20V20H12.5V12.5Z"
                                fill="#FFFFFF"/>
                        </svg>
                }
            </div>
            <span className={'text-gray-600 font-semibold'}>Login with Microsoft</span>
        </button>
    );
};