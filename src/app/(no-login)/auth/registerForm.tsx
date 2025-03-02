'use client'
import {useSearchParams} from "next/navigation";
import {PasskeyRegister, PasswordRegister} from "@/components";
import {FormEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {completeRegisterWithPasskey, registerWithPasskey, registerWithPassword} from "@/lib/api/auths";
import {browserSupportsWebAuthn, platformAuthenticatorIsAvailable, startRegistration} from "@simplewebauthn/browser";
import {RegisterPasskeyBeginData} from "@/types/RegisterPasskeyBeginData";


export const RegisterForm = () => {
    const [selectedMethod, setSelectedMethod] = useState<'passkey' | 'password'>('passkey');
    const [isPasskeyAvailable, setIsPasskeyAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isAuthDataReady, setIsAuthDataReady] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const userId = useRef<string>(null);

    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const extraMethod = useMemo(() => {
        if (selectedMethod === 'passkey') return 'password';
        if (isPasskeyAvailable) return 'passkey';
        return null;
    }, [isPasskeyAvailable, selectedMethod]);

    useEffect(() => {
        const passkeyNotAvailable = () => {
            setIsPasskeyAvailable(false);
            setSelectedMethod('password');
        }

        if (!browserSupportsWebAuthn())
            passkeyNotAvailable();
        else
            platformAuthenticatorIsAvailable().then(
                value => {
                    if (!value) passkeyNotAvailable();
                }
            );
    }, []);

    const isDataReady = useMemo(() => {
        if (firstName.length === 0 || lastName.length === 0) return false;
        return isAuthDataReady
    }, [firstName.length, isAuthDataReady, lastName.length]);

    const register = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (loading && !isDataReady) return;
            setLoading(true);
            if (selectedMethod === 'passkey') {
                const data: RegisterPasskeyBeginData = {
                    firstName,
                    lastName,
                    email,
                }
                if (userId.current) data.userId = userId.current;

                registerWithPasskey(data)
                    .then(res => {
                        userId.current = res.userId;
                        startRegistration({optionsJSON: res.options}).then(
                            (response) => {
                                const data = {
                                    response: response,
                                    userId: res.userId
                                }
                                completeRegisterWithPasskey(data).then(console.log)
                            }
                        )
                    })
                    .catch()

            } else {
                const form = event.currentTarget as HTMLFormElement;
                const formData = new FormData(form);

                const password = formData.get('password') || '';
                const repeatPassword = formData.get('repeatPassword') || '';
                console.log(password, repeatPassword);
                registerWithPassword(email, password, repeatPassword).then(r => {
                    console.log(r);
                });
            }
            setLoading(true);
            setLoading(false);
        },
        [email, isDataReady, loading, selectedMethod]
    );

    return (
        <form
            className={'w-full'}
            onSubmit={register}
        >
            <div className="mt-2">
                <label htmlFor="firstName">First Name</label>
                <input
                    autoComplete="given-name"
                    name="firstName"
                    type="text"
                    value={firstName}
                    readOnly={loading}
                    placeholder="Enter your first name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full mt-1 outline-none border rounded px-2 py-2 read-only:cursor-default read-only:border-gray-300 read-only:bg-gray-50 pr-8"
                />
            </div>

            <div className="mt-2">
                <label htmlFor="lastName">Last Name</label>
                <input
                    autoComplete="family-name"
                    name="lastName"
                    type="text"
                    value={lastName}
                    readOnly={loading}
                    placeholder="Enter your last name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full mt-1 outline-none border rounded px-2 py-2 read-only:cursor-default read-only:border-gray-300 read-only:bg-gray-50 pr-8"
                />
            </div>
            {
                selectedMethod === 'passkey' ?
                    <PasskeyRegister
                        isDataValid={isDataReady}
                        loading={loading}
                        setIsDataReady={setIsAuthDataReady}
                    />
                    :
                    <PasswordRegister
                        isDataValid={isDataReady}
                        setIsDataReady={setIsAuthDataReady}
                        loading={loading}
                    />
            }
            {
                extraMethod &&
                <>
                    <button
                        className={'mt-2  hover:bg-gray-100 flex flex-row gap-2 w-full py-2 justify-center items-center rounded disabled:opacity-50'}
                        type={'button'}
                        onClick={() => setSelectedMethod(extraMethod)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="1rem"
                             viewBox="0 0 24 24" fill="none">
                            <path d="M12 10V14M10.2676 11L13.7317 13M13.7314 11L10.2673 13"
                                  stroke="#5C5F62" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M6.73241 10V14M4.99999 11L8.46409 13M8.46386 11L4.99976 13"
                                  stroke="#5C5F62" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M17.2681 10V14M15.5356 11L18.9997 13M18.9995 11L15.5354 13"
                                  stroke="#5C5F62" strokeWidth="1.5" strokeLinecap="round"/>
                            <path
                                d="M22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.4816 5.82475 21.7706 6.69989 21.8985 8"
                                stroke="#5C5F62" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className={'font-semibold text-[#5C5F62]'}>{
                            extraMethod === 'passkey' ? 'Use passkey' : 'Use password instead'
                        }</span>
                    </button>
                </>
            }

        </form>
    );
};
