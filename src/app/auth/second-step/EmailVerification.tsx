import CodeInput from "@/app/auth/second-step/CodeInput";
import {useCallback, useEffect, useState} from "react";
import {sendSecondStepOTP, verifyEmailLoginOTP} from "@/lib/api/auths";
import {ButtonLoader} from "@/components";
import {useRouter} from "next/navigation";

type Props = {
    email: string
};


export const EmailVerification = (props: Props) => {
    const [code, setCode] = useState('');
    const [isCodeSended, setIsCodeSended] = useState(false);
    const [otpTimeout, setOtpTimeout] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const sendCode = useCallback(() => {
        setLoading(true);
        sendSecondStepOTP().then(() => {
            setIsCodeSended(true);
            setOtpTimeout(60);
        })
            .catch(({status, reason}) => {
                if (status === 400) {
                    setError(reason);
                }
                if ([403, 405, 401].includes(status)) {
                    setError('Session expired. Please login again');
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                }
            }).finally(() => setLoading(false));
    }, []);

    const changeCode = useCallback((code: string) => {
        if (error) setError('');
        setCode(code)
    }, [error]);

    const verifyOTP = useCallback(() => {
        setLoading(true);
        verifyEmailLoginOTP(code)
            .then(() => {

            })
            .catch(({status, data}) => {
                console.log(status, data);
                if (status === 400) {
                    setError(data.otp);
                }
                if ([403, 405, 401].includes(status)) {
                    setError('Session expired. Please login again');
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                }
            })
            .finally(() => setLoading(false));
    }, [code, router]);

    useEffect(() => {
        if (otpTimeout <= 0) return;

        const timer = setInterval(() => {
            setOtpTimeout((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer)
    }, [otpTimeout]);

    return (
        <>
            <h3 className={'font-medium mt-4 font-sans mb-3'}>{isCodeSended ? `Enter code that send to ${props.email}` : `An email will be sent to ${props.email}`}</h3>
            <CodeInput length={6} onChange={changeCode} disabled={!isCodeSended || loading}/>
            {
                error && (
                    <p className={'text-red-600 text-xs font-semibold text-center mt-2'}>{error}</p>
                )
            }
            {
                isCodeSended && (
                    !otpTimeout ?
                        <p className={'text-xs w-full text-center mt-2'}>
                            Didn&#39;t Recieve OTP?
                            <span
                                className={'text-gray-700 font-semibold cursor-pointer'}
                                onClick={sendCode}
                            >
                                {' '}Resend email
                            </span>
                        </p>
                        :
                        <span className={'text-xs w-full text-center mt-2'}>
                            Wait {otpTimeout} seconds to resend email
                        </span>
                )
            }

            <div className={'w-full flex flex-row mt-3.5 gap-2'}>
                <button
                    className={'w-full px-2 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md font-semibold flex justify-center items-center disabled:opacity-50'}
                    onClick={
                        isCodeSended ? verifyOTP : sendCode
                    }
                    disabled={loading || (isCodeSended && code.length !== 6)}
                >
                    {
                        loading ?
                            <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/> :
                            (
                                isCodeSended ?
                                    'Verify OTP' :
                                    'Send email'
                            )
                    }
                </button>
            </div>
        </>
    );
};