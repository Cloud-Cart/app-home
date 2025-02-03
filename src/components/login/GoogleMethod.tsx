import * as React from "react";
import {useCallback, useState} from "react";
import {ButtonLoader, SpinnerLoader} from "@/components";
import {googleSocialLogin} from "@/lib/api/auths";
import {useRouter} from "next/navigation";

type Props = {
    usage: 'default' | 'option' | 'button';
    email?: string
}

export const GoogleMethod = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const login = useCallback(() => {
        setLoading(true);
        const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/google?provider=google`;

        let authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile`;
        if (props.email) authUrl += `&login_hint=${encodeURIComponent(props.email)}`;

        const width = 500, height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(authUrl, "Google Login", `width=${width},height=${height},top=${top},left=${left}`);

        if (!popup) {
            console.error("Popup blocked! Allow popups and try again.");
            setLoading(false);
            return;
        }

        const handleMessage = (event: MessageEvent<{ code: string, provider: string }>) => {
            if (event.origin !== window.location.origin || !event.data.provider || event.data.provider !== 'google') return;
            googleSocialLogin(event.data.code, REDIRECT_URI)
                .then(
                    (response) => {
                        console.log("Google login response:", response.data);
                    }
                )
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
                    <span className={'font-semibold'}>Login with Google</span>
            }
        </button>
    }
    if (props.usage === 'button') {
        return <button
            className={'w-full p-4 flex justify-center items-center rounded bg-gray-200'}
            onClick={login}
            disabled={loading}
        >
            {
                loading ?
                    <SpinnerLoader fill={'#EB4335'} width={'20px'} height={'20px'}/>
                    :
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px"
                             height="20px" viewBox="-0.5 0 48 48" version="1.1">

                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                    <g id="Google" transform="translate(401.000000, 860.000000)">
                                        <path
                                            d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                            id="Fill-1" fill="#FBBC05">

                                        </path>
                                        <path
                                            d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                            id="Fill-2" fill="#EB4335">

                                        </path>
                                        <path
                                            d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                            id="Fill-3" fill="#34A853">

                                        </path>
                                        <path
                                            d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                            id="Fill-4" fill="#4285F4">

                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <span className={'hidden'}>login with google</span>
                    </>
            }
        </button>
    }
    return (
        <button
            onClick={login}
            className={'flex flex-row justify-start gap-5 hover:bg-gray-200 w-full items-center rounded-md p-1 disabled:opacity-50'}
            disabled={loading}
        >
            <div className={'bg-gray-700 rounded p-2'}>
                {
                    !loading ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"
                             version="1.1">
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7399.000000)"
                                   fill="#ffffff">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path
                                            d="M263.821537,7247.00386 L254.211298,7247.00386 C254.211298,7248.0033 254.211298,7250.00218 254.205172,7251.00161 L259.774046,7251.00161 C259.560644,7252.00105 258.804036,7253.40026 257.734984,7254.10487 C257.733963,7254.10387 257.732942,7254.11086 257.7309,7254.10986 C256.309581,7255.04834 254.43389,7255.26122 253.041161,7254.98137 C250.85813,7254.54762 249.130492,7252.96451 248.429023,7250.95364 C248.433107,7250.95064 248.43617,7250.92266 248.439233,7250.92066 C248.000176,7249.67336 248.000176,7248.0033 248.439233,7247.00386 L248.438212,7247.00386 C249.003881,7245.1669 250.783592,7243.49084 252.969687,7243.0321 C254.727956,7242.65931 256.71188,7243.06308 258.170978,7244.42831 C258.36498,7244.23842 260.856372,7241.80579 261.043226,7241.6079 C256.0584,7237.09344 248.076756,7238.68155 245.090149,7244.51127 L245.089128,7244.51127 C245.089128,7244.51127 245.090149,7244.51127 245.084023,7244.52226 L245.084023,7244.52226 C243.606545,7247.38565 243.667809,7250.75975 245.094233,7253.48622 C245.090149,7253.48921 245.087086,7253.49121 245.084023,7253.49421 C246.376687,7256.0028 248.729215,7257.92672 251.563684,7258.6593 C254.574796,7259.44886 258.406843,7258.90916 260.973794,7256.58747 C260.974815,7256.58847 260.975836,7256.58947 260.976857,7256.59047 C263.15172,7254.63157 264.505648,7251.29445 263.821537,7247.00386"
                                            id="google-[#178]">
                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        :
                        <SpinnerLoader fill={'#FFFFFF'} width={'20px'} height={'20px'}/>

                }
            </div>
            <span className={'text-gray-600 font-semibold'}>Login with Google</span>
        </button>
    );
};