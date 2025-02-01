import {useCallback} from "react";

type Props = {
    usage: 'default' | 'option' | 'button'
}


export const FacebookMethod = (props: Props) => {
    const login = useCallback(() => {
        const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_API_ID;
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/facebook`
        window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile`;
    }, []);

    if (props.usage === 'button') {
        return <button className={'w-full p-4 flex justify-center items-center rounded bg-gray-200'}
                       onClick={login}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)"/>
                <path
                    d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                    fill="white"/>
                <defs>
                    <linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917"
                                    gradientUnits="userSpaceOnUse">
                        <stop stopColor="#18ACFE"/>
                        <stop offset="1" stopColor="#0163E0"/>
                    </linearGradient>
                </defs>
            </svg>
            <span className={'hidden'}>login with facebook</span>
        </button>
    }
    if (props.usage === 'default') {
        return <button className={'flex flex-row justify-center items-center gap-2 mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md'} onClick={login}>
            <span className={'font-semibold'}>Login with Facebook</span>
        </button>
    }
    return (
        <button onClick={login}
                className={'flex flex-row justify-start gap-5 hover:bg-gray-200 w-full items-center rounded-md p-1'}>
            <div className={'bg-gray-700 rounded p-2'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-5 0 20 20" version="1.1">
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-385.000000, -7399.000000)" fill="#FFFFFF">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path
                                    d="M335.821282,7259 L335.821282,7250 L338.553693,7250 L339,7246 L335.821282,7246 L335.821282,7244.052 C335.821282,7243.022 335.847593,7242 337.286884,7242 L338.744689,7242 L338.744689,7239.14 C338.744689,7239.097 337.492497,7239 336.225687,7239 C333.580004,7239 331.923407,7240.657 331.923407,7243.7 L331.923407,7246 L329,7246 L329,7250 L331.923407,7250 L331.923407,7259 L335.821282,7259 Z"
                                    id="facebook-[#176]">
                                </path>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
            <span className={'text-gray-600 font-semibold'}>Login with Facebook</span>
        </button>
    );
};