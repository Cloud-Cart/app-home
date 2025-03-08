import CodeInput from "@/app/(no-auth)/second-step/CodeInput";
import {useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import {verifyAuthenticatorAppOTP} from "@/lib/api/auths";
import {ButtonLoader} from "@/components";


export const AuthenticationAppVerification = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const changeCode = useCallback((code: string) => {
        if (error) setError('');
        setCode(code)
    }, [error]);

    const verifyOTP = useCallback(() => {
        setLoading(true);
        verifyAuthenticatorAppOTP(code)
            .then(() => {

            })
            .catch(({status, data}) => {
                if (status === 400) {
                    setError(data.otp);
                }
                if ([403, 405].includes(status)) {
                    setError('Session expired. Please login again');
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                }
            })
            .finally(() => setLoading(false));
    }, [code, router]);

    return (
        <>
            <h3 className={'font-medium mt-4 font-sans mb-3'}>Enter the code from your authenticator app</h3>
            <CodeInput length={6} onChange={changeCode}/>
            {
                error && (
                    <p className={'text-red-600 text-xs font-semibold text-center mt-2'}>{error}</p>
                )
            }
            <div className={'w-full flex flex-row mt-3.5 gap-2'}>
                <button
                    className={'w-full px-2 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md font-semibold flex justify-center items-center disabled:opacity-50'}
                    onClick={verifyOTP}
                    disabled={loading || code.length !== 6}
                >
                    {
                        loading ?
                            <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/> :
                            'Verify Code'
                    }
                </button>
            </div>
        </>
    );
};