'use client';
import EditIcon from "@mui/icons-material/Edit";
import {ButtonLoader} from "@/components";
import {useCallback, useMemo, useState} from "react";
import {getEmailAuthMethods} from "@/lib/api/auths";

type Props = {
    removeEmail?: () => void;
    setEmailSuccess?: (email: string) => void;
    setEmailNotFound?: (email: string) => void;
    readonly: boolean;
    email?: string;
    error?: string;
    setError?: (error: string) => void;
}

export const EmailForm = (props: Props) => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState(false)

    const checkEmail = useCallback((email: string) => {
        setLoading(true);
        getEmailAuthMethods(email).then(() => {
            if (props.setEmailSuccess) props.setEmailSuccess(email);
        }).catch(({status, reason}) => {
            if (status === 400 && props.setError) props?.setError(reason);
            if (status === 403 && props.setEmailNotFound) props.setEmailNotFound(email);
        }).finally(() => setLoading(false));
    }, [props]);

    const isValidEmail = useMemo(() => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }, [email]);

    const changeEmail = useCallback((value: string) => {
        if (props.readonly) return;
        if (props.error && props.setError) props.setError('');
        setEmail(value.toLowerCase());
    }, [props]);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                if (props.readonly) return;
                if (loading || !isValidEmail) return;
                checkEmail(email)
            }}
        >
            <div className={'relative'}>
                <label htmlFor="email">Email</label>
                <input
                    autoComplete={'email webauthn'}
                    name="email"
                    type={'email'}
                    value={props.email || email}
                    readOnly={props.readonly}
                    placeholder={'Enter your email'}
                    onChange={(e) => changeEmail(e.target.value)}
                    className={`w-full mt-1 outline-none border rounded px-2 py-2 read-only:cursor-default read-only:border-gray-300 read-only:border-2 read-only:bg-gray-50 pr-8 cursor-text`}
                />
                {props.readonly && (
                    <button
                        className={'absolute bottom-3 right-2'}
                        onClick={() => {
                            if (props.removeEmail) {
                                props.removeEmail();
                            }
                        }}
                        tabIndex={-1}
                    >
                        <EditIcon fill="#e5e7eb" width={'18'} height={'18'} style={{width: '18px', height: '18px'}}/>
                    </button>
                )}
            </div>
            <div>
                {props.error && (<span className={'text-red-600 text-xs font-semibold'}>{props.error}</span>)}
            </div>
            {
                (!props.readonly) &&
                <button
                    className={'flex flex-row gap-2 justify-center items-center mt-2 bg-gray-700 drop-shadow-sm disabled:hover:bg-gray-700 hover:bg-gray-600 text-gray-200 border min-h-9 w-full rounded-md py-2 disabled:opacity-50'}
                    disabled={loading || !isValidEmail}
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
        </form>
    );
};