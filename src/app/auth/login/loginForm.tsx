'use client'
import {useCallback, useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import {getEmailAuthMethods} from "@/lib/api/auths";
import {LoginMethods} from "@/app/auth/login/loginMethods";
import {LoginFunctions} from "@/app/auth/login/loginFunctions";
import {ButtonLoader} from "@/components";

export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [loginMethods, setLoginMethods] = useState<string[]>([]);
    const [defaultMethod, setDefaultMethod] = useState<string>('');
    const [error, setError] = useState('');
    const [emailValidated, setEmailValidated] = useState(false);
    const [loading, setLoading] = useState(false)

    const checkEmail = useCallback((email: string) => {
        setLoading(true);
        getEmailAuthMethods(email).then((data) => {
            const methods = data.socialAccounts
            if (data.isPasskeyAvailable) methods.push('passkey');
            if (data.isPasswordAvailable) methods.push('password');
            setLoginMethods(methods);
            setDefaultMethod(data.defaultMethod);
            setEmailValidated(true);
        }).catch(({status, reason}) => {
            if (status === 400) setError(reason);
            setEmailValidated(false);
        }).finally(() => setLoading(false));
    }, []);

    const removeEmail = useCallback(() => {
        setEmail('');
        setEmailValidated(false);
        setLoginMethods([]);
        setDefaultMethod('');
        setError('');
    }, []);

    const changeEmail = useCallback((value: string) => {
        if (error) setError('');
        setEmail(value);
    }, [error]);

    return (
        <>
            <div className={'relative'}>
                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    type={'email'}
                    value={email}
                    readOnly={emailValidated}
                    onChange={(e) => changeEmail(e.target.value)}
                    className={`w-full mt-1 outline-none border rounded px-2 py-2 ${emailValidated ? 'cursor-default border-gray-300 border-2 bg-gray-50 pr-8' : 'cursor-text'}`}
                />
                {emailValidated && (
                    <button className={'absolute bottom-3 right-2'} onClick={() => removeEmail()}>
                        <EditIcon fill="#e5e7eb" width={'18'} height={'18'} style={{width: '18px', height: '18px'}}/>
                    </button>
                )}
            </div>
            <div>
                {error && (<span className={'text-red-600 text-xs font-semibold'}>{error}</span>)}
            </div>
            {
                (!emailValidated) &&
                <button
                    onClick={() => checkEmail(email)}
                    className={'flex flex-row gap-2 justify-center items-center mt-2 bg-gray-700 drop-shadow-sm hover:bg-gray-600 text-gray-200 border min-h-9 w-full rounded-md py-2'}
                    disabled={loading}
                >
                    {loading ?
                        <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/> :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#e5e7eb" width="20px" height="20px"
                                 viewBox="0 0 32 32"
                                 style={{
                                     fillRule: 'evenodd',
                                     clipRule: 'evenodd',
                                     strokeLinejoin: 'round',
                                     strokeMiterlimit: 2
                                 }}
                                 version="1.1">
                                <path
                                    d="M31,10c0,-1.326 -0.527,-2.598 -1.464,-3.536c-0.938,-0.937 -2.21,-1.464 -3.536,-1.464c-5.322,0 -14.678,0 -20,0c-1.326,-0 -2.598,0.527 -3.536,1.464c-0.937,0.938 -1.464,2.21 -1.464,3.536c0,3.486 0,8.514 0,12c-0,1.326 0.527,2.598 1.464,3.536c0.938,0.937 2.21,1.464 3.536,1.464c5.322,-0 14.678,-0 20,-0c1.326,0 2.598,-0.527 3.536,-1.464c0.937,-0.938 1.464,-2.21 1.464,-3.536c0,-3.486 0,-8.514 0,-12Zm-26.556,-0.221c-0,-0 5.145,4.237 8.372,6.894c1.849,1.523 4.519,1.52 6.365,-0.007c3.237,-2.677 8.413,-6.959 8.413,-6.959c0.425,-0.352 0.485,-0.983 0.133,-1.408c-0.351,-0.425 -0.982,-0.485 -1.408,-0.133c0,-0 -5.176,4.281 -8.412,6.959c-1.108,0.916 -2.71,0.918 -3.82,0.004c0,0 -8.372,-6.894 -8.372,-6.894c-0.426,-0.351 -1.056,-0.29 -1.407,0.136c-0.351,0.426 -0.29,1.057 0.136,1.408Z"/>
                                <g id="Icon"/>
                            </svg>
                            <span className={'font-semibold'}>Continue with email</span>
                        </>
                    }
                </button>
            }
            {
                (emailValidated) ?
                    <LoginMethods
                        email={email}
                        loginMethods={loginMethods}
                        defaultMethod={defaultMethod}
                        setEmailError={setError}
                    /> :
                    <LoginFunctions/>
            }
        </>
    );
};