'use client'
import {getSecondStepMethods} from "@/lib/api/auths";
import {useEffect, useMemo, useState} from "react";
import {AuthenticationAppVerification} from "@/app/auth/second-step/AuthenticationAppVerification";
import {EmailVerification} from "@/app/auth/second-step/EmailVerification";
import {useRouter} from "next/navigation";
import Link from "next/link";

export const SecondStepForm = () => {
    const [secondStepMethods, setSecondStepMethods] = useState<string[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [error, setError] = useState<string>();
    const router = useRouter();

    useEffect(() => {
        getSecondStepMethods().then(({methods, email}) => {
            setSecondStepMethods(methods);
            setEmail(email);
            if (methods.includes('authenticator')) setSelectedMethod('authenticator');
            else setSelectedMethod('otp');
        }).catch(({status}) => {
            if (status === 403) {
                setError('Session expired. Please login again');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            }
        });
    }, [router])

    const extraOption = useMemo(() => {
        if (secondStepMethods.length <= 1) return null;
        if (selectedMethod === 'authenticator') return {
            method: 'otp',
            text: 'Use Email'
        }
        return {
            method: 'authenticator',
            text: 'Use Authenticator App'
        }
    }, [secondStepMethods.length, selectedMethod]);

    return (
        <div>
            {
                error &&
                <span className={'text-red-600 text-xs font-semibold'}>{error}</span>
            }
            {
                selectedMethod === 'authenticator' &&
                <AuthenticationAppVerification/>
            }
            {
                selectedMethod === 'otp' &&
                <EmailVerification email={email || ''}/>
            }
            {
                extraOption &&
                <button
                    className={'w-full bg-gray-300 hover:bg-gray-200 mt-2 font-semibold p-2 rounded-md'}
                    onClick={() => setSelectedMethod(extraOption?.method)}
                >
                    {extraOption.text}
                </button>
            }
            <p className={'font-sans text-xs mt-3 w-full text-center font-semibold'}>
                Trouble with {selectedMethod === 'otp' ? 'email' : 'authenticator'}? {' '}
                <Link
                    href={'/auth/recover-account/'}
                    className={'cursor-pointer text-blue-700 underline'}
                >
                    Recover your account
                </Link>
            </p>
        </div>
    );
};