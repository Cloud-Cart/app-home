'use client'
import {useCallback, useEffect, useMemo, useState} from "react";
import {getEmailAuthMethods} from "@/lib/api/auths";
import {useRouter, useSearchParams} from "next/navigation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {FacebookLogin, GoogleLogin, MicrosoftLogin, PasskeyLogin, PasswordLogin} from "@/components";

type Props = {
    setEmailError?: (error: string) => void;
}

export const LoginForm = (props: Props) => {
    const [loginMethods, setLoginMethods] = useState<string[]>([]);
    const [defaultMethod, setDefaultMethod] = useState<string>('');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [emailValidated, setEmailValidated] = useState<boolean>(false);
    const [otherOptionsOpened, setOtherOptionsOpened] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const otherOptions = useMemo(
        () => loginMethods.filter(method => method !== selectedMethod),
        [loginMethods, selectedMethod]
    );

    const SelectedComponent = useMemo(() => {
        switch (selectedMethod) {
            case 'passkey':
                return <PasskeyLogin usage={'default'} email={email}/>
            case 'google':
                return <GoogleLogin usage={'default'} email={email}/>
            case 'microsoft':
                return <MicrosoftLogin usage={'default'} email={email}/>
            case 'facebook':
                return <FacebookLogin usage={'default'}/>
            default:
                return <PasswordLogin email={email}/>
        }
    }, [email, selectedMethod]);

    useEffect(() => {
        setSelectedMethod(defaultMethod);
    }, [defaultMethod]);

    const checkEmail = useCallback((email: string) => {
        getEmailAuthMethods(email).then((data) => {
            const methods = data.socialAccounts
            if (data.isPasskeyAvailable) methods.push('passkey');
            if (data.isPasswordAvailable) methods.push('password');
            setLoginMethods(methods);
            setDefaultMethod(data.defaultMethod);
            setEmailValidated(true);
        }).catch(({status, reason}) => {
            if (status === 400 && props.setEmailError) {
                props.setEmailError(reason.email);
                setTimeout(() => {
                    if (props.setEmailError) props.setEmailError('');
                }, 3000);
            }
            if (status === 403) {
                router.replace(`/auth?email=${email}&mode=register`);
            }
        })
    }, [props, router]);

    useEffect(() => {
        if (email) checkEmail(email);
        else router.push('/auth');
    }, []);

    useEffect(() => {
        setSelectedMethod(defaultMethod);
    }, []);

    if (!emailValidated) return <></>;

    return (
        <>
            {SelectedComponent}
            {loginMethods.length > 0 &&
                <button
                    className={'mt-2 bg-gray-100 w-full py-2 rounded-md text-gray-700 flex flex-row justify-center transition-all'}
                    onClick={() => setOtherOptionsOpened(prevState => !prevState)}>
                    <ArrowDropDownIcon
                        className={(otherOptionsOpened ? 'rotate-180' : 'rotate-0') + ' transition-all transition-300'}
                    />
                    <span className={'font-semibold text-gray-600'}>Other options</span>
                </button>
            }
            {otherOptionsOpened &&
                <div className={'w-full h-fit  transition-all duration-300 p-1 border mt-2 rounded-lg'}>
                    {otherOptions.map(method => {
                        switch (method) {
                            case 'google':
                                return <GoogleLogin key={method} usage={'option'} email={email}/>
                            case 'facebook':
                                return <FacebookLogin key={method} usage={'option'}/>;
                            case 'microsoft':
                                return <MicrosoftLogin key={method} usage={'option'}/>;
                            case 'password':
                                return <button
                                    onClick={() => setSelectedMethod('password')}
                                    className={'flex flex-row justify-start gap-5 hover:bg-gray-200 w-full items-center rounded-md p-1'}
                                    key={method}
                                >
                                    <div className={'bg-gray-700 rounded p-2'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px"
                                             viewBox="0 0 24 24" fill="none">
                                            <path d="M12 10V14M10.2676 11L13.7317 13M13.7314 11L10.2673 13"
                                                  stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                                            <path d="M6.73241 10V14M4.99999 11L8.46409 13M8.46386 11L4.99976 13"
                                                  stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                                            <path d="M17.2681 10V14M15.5356 11L18.9997 13M18.9995 11L15.5354 13"
                                                  stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                                            <path
                                                d="M22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.4816 5.82475 21.7706 6.69989 21.8985 8"
                                                stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    <span className={'text-gray-700 font-semibold'}>Login with Password</span>
                                </button>
                            default:
                                return <PasskeyLogin usage={'option'} email={email} key={method}/>;
                        }
                    })
                    }
                </div>
            }
        </>
    );
};