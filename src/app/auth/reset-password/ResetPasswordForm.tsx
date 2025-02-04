'use client'
import {useCallback, useMemo, useState} from 'react';
import {sendResetPasswordEmail} from "@/lib/api/auths";


export const ResetPasswordForm = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    const isValidEmail = useMemo(() => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }, [email]);

    const sendEmail = useCallback((email: string) => {
        setLoading(true);
        sendResetPasswordEmail(email).then(() => {
            console.log('email sent')
        }).catch(({status, data}) => {
            if (status === 400) {
                setError(data.email);
            }
        }).finally(() => setLoading(false));
    }, []);

    return (
        <>
            <div className={'w-full'}>
                <label className={'font-medium text-sm'}>Email</label>
                <input
                    type="email"
                    className={'w-full p-2 mt-0.5 rounded-md border border-gray-300 outline-none'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete={'email'}
                />
                {error && <span className={'text-red-600 text-xs font-semibold'}>{error}</span>}
                <button
                    className={'w-full mt-2 bg-gray-700 text-gray-200 disabled:opacity-50 py-2 rounded-md shadow hover:bg-gray-600 font-semibold'}
                    disabled={!isValidEmail}
                    onClick={() => sendEmail(email)}
                >
                    Send Link
                </button>
            </div>
        </>
    );
};