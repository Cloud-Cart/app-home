'use client'
import {useCallback, useMemo, useState} from 'react';
import {sendResetPasswordEmail} from "@/lib/api/auths";
import Link from "next/link";
import {ButtonLoader} from "@/components";


export const ResetPasswordForm = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [emailSended, setEmailSended] = useState(false);

    const isValidEmail = useMemo(() => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }, [email]);

    const sendEmail = useCallback((email: string) => {
        setLoading(true);
        sendResetPasswordEmail(email).then(() => {
            setEmailSended(true);
            console.log('email sent')
        }).catch(({status, data}) => {
            if (status === 400) {
                setError(data.email);
            }
        }).finally(() => setLoading(false));
    }, []);

    return (
        <>
            {
                emailSended ?
                    <>
                        <p className={'w-full p-4 text-justify'}>Success! We&#39;ve sent a password reset link to your
                            email. Please check your inbox and follow the
                            instructions to reset your password.</p>
                        <Link href={'/(no-login)/auth/'}>
                            <button className={'w-full bg-gray-700 text-gray-200 p-2 rounded-md font-semibold shadow'}>
                                Go back to login
                            </button>
                        </Link>
                    </>
                    :
                    <div className={'w-full'}>
                        <label className={'font-medium text-sm'}>Email</label>
                        <input
                            type="email"
                            className={'w-full p-2 mt-0.5 rounded-md border border-gray-300 outline-none'}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete={'email'}
                            disabled={loading}
                        />
                        {error && <span className={'text-red-600 text-xs font-semibold'}>{error}</span>}
                        <button
                            className={'w-full mt-2 bg-gray-700 flex flex-row items-center justify-center text-gray-200 disabled:opacity-50 py-2 rounded-md shadow hover:bg-gray-600 font-semibold'}
                            disabled={!isValidEmail || loading}
                            onClick={() => sendEmail(email)}
                        >
                            {
                                loading ?
                                    <ButtonLoader fill={'#E5E7EB'} width={'1.5rem'} height={'1.5rem'}/>
                                    :
                                    'Send Reset Password Email'
                            }
                        </button>
                    </div>
            }
        </>
    );
};