'use client'
import React, {useCallback, useMemo, useState} from "react";
import {recoverAccount} from "@/lib/api/auths";
import {useRouter} from "next/navigation";

export default function Page() {
    const [recoveryCode, setRecoveryCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        input = input.slice(0, 10);

        let formatted = input;
        if (input.length > 5) {
            formatted = `${input.slice(0, 5)}-${input.slice(5, 10)}`;
        }
        setError('');
        setRecoveryCode(formatted);
    }, []);

    const isValid = useMemo(() => {
        return recoveryCode.replace(/-/g, '').length === 10;
    }, [recoveryCode]);

    const sendRecoveryCode = useCallback((recoveryCode: string) => {
        setLoading(true);
        recoverAccount(recoveryCode.replace(/-/g, ''))
            .then(() => {

            })
            .catch(({status, data}) => {
                if (status === 400) {
                    setError(data.recoveryCode);
                }
                if (status === 401){
                    setError('Session expired. Please login again');
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    return <>
        <div className={'container w-fit h-fit mb-4'}>
            <h3 className={'text-2xl font-bold'}>Recover your account</h3>
            <p className={'font-light mt-2 text-sm text-gray-500'}>Use your 10-digit recovery code.</p>
        </div>
        <form>
            <div className={'container w-full h-fit mb-4'}>
                <label className={'text-sm font-semibold'}>Recovery code</label>
                <input
                    type={'text'}
                    className={'w-full p-2 mt-0.5 rounded-md border border-gray-300 outline-none'}
                    placeholder={'Enter your recovery code'}
                    value={recoveryCode}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>
            {error && <span className={'text-red-600 text-xs font-semibold'}>{error}</span>}
            <div className={'container w-full h-fit mb-4'}>
                <button
                    className={'w-full mt-2 bg-gray-700 flex flex-row items-center justify-center text-gray-200 disabled:opacity-50 py-2 rounded-md shadow hover:bg-gray-600 font-semibold'}
                    disabled={!isValid || loading}
                    onClick={() => sendRecoveryCode(recoveryCode)}
                >
                    Recover Account
                </button>
            </div>
        </form>
    </>
};