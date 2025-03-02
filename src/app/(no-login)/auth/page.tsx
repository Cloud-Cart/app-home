'use client';
import {EmailForm} from "@/app/(no-login)/auth/emailForm";
import {LoginFunctions} from "@/app/(no-login)/auth/loginFunctions";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useMemo, useState} from "react";
import {LoginForm} from "@/app/(no-login)/auth/loginForm";
import {RegisterForm} from "@/app/(no-login)/auth/registerForm";
import {beginPasskeyAuthentication, endPasskeyAuthentication} from "@/lib/api/auths";
import {startAuthentication} from "@simplewebauthn/browser";


export default function Page() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const router = useRouter();
    const [emailError, setEmailError] = useState('')

    const email = searchParams.get('email') || '';
    useEffect(() => {
        if (email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                router.push('/auth');
            }
        }
    }, [email, router]);

    if (Array.isArray(mode) || (mode && mode !== 'login' && mode !== 'register')) {
        router.replace('/auth');
    }

    const setEmailSuccess = useCallback((email: string) => {
        router.push(`/auth?email=${encodeURIComponent(email)}&mode=login`);
    }, [router]);

    const setEmailNotFound = useCallback((email: string) => {
        router.push(`/auth?email=${encodeURIComponent(email)}&mode=register`);
    }, [router]);

    const removeEmail = useCallback(() => {
        router.push('/auth');
    }, [router]);

    const heading = useMemo(() => {
        if (mode === 'login') return 'Log in to your account';
        if (mode === 'register') return 'Register your account';
        return 'Welcome';
    }, [mode]);

    return (
        <>
            <div className={'container w-fit h-fit mb-4'}>
                <h3 className={'text-2xl font-bold'}>{heading}</h3>
                <p className={'font-semibold text-sm text-gray-500'}>Continue to Cloud Cart</p>
            </div>
            <EmailForm
                readonly={!!mode}
                setEmailSuccess={setEmailSuccess}
                setEmailNotFound={setEmailNotFound}
                removeEmail={removeEmail}
                setError={setEmailError}
                error={emailError}
                email={!!mode ? email : undefined}
            />
            {!mode && <LoginFunctions/>}
            {mode === 'login' && <LoginForm setEmailError={setEmailError}/>}
            {mode == 'register' && <RegisterForm/>}
        </>
    );
}
