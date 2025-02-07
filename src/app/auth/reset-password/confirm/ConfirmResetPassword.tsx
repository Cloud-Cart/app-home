'use client'
import {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import {setResetPassword, verifyResetPasswordChallenge} from "@/lib/api/auths";
import {SpinnerLoader} from "@/components";
import Link from "next/link";
import {ErrorProgressBar} from "@/components/general/ErrorProgressBar";
import {Visibility} from "@mui/icons-material";

type errorType = {
    password?: string;
    repeatPassword?: string;
    common?: string;
}

export const ConfirmResetPassword = () => {
    const [challengeVerified, setChallengeVerified] = useState(false);
    const [error, setError] = useState<errorType>();
    const [challengeVerificationError, setChallengeVerificationError] = useState<string>();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [showPasswordComplexity, setShowPasswordComplexity] = useState(false);
    const [success, setSuccess] = useState(false);

    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setChallengeVerificationError('Invalid URL');
            return;
        }
        verifyResetPasswordChallenge(token)
            .then(data => {

            })
            .catch(({status, data}) => {
                if (status === 400) {
                    setChallengeVerificationError(data.token);
                } else {
                    setChallengeVerificationError('Something went wrong. Please try again later');
                }
            })
            .finally(() => setChallengeVerified(true));
    }, [searchParams]);

    const passwordComplexity = useMemo(() => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!password.match(/[a-z]/)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!password.match(/[A-Z]/)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!password.match(/[0-9]/)) {
            errors.push('Password must contain at least one number');
        }
        if (!password.match(/[^a-zA-Z0-9]/)) {
            errors.push('Password must contain at least one special character');
        }
        return {complexity: (5 - errors.length), errors};
    }, [password]);

    const isPasswordSame = useMemo(() => {
        return password === repeatPassword;
    }, [password, repeatPassword]);

    const changeShowPasswordComplexity = useCallback((event: React.FocusEvent<HTMLInputElement>, value: boolean) => {
        if (event.relatedTarget?.classList.contains('visibility-icon')) return;
        setShowPasswordComplexity(value);
    }, []);

    const sendPassword = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setResetPassword(password, repeatPassword)
            .then(() => setSuccess(true))
            .catch(({status, data}) => {
                if (status === 400) {
                    setError(data);
                }
                if (status === 401) {
                    setError({common: 'Request Expired, Please try again'});
                } else {
                    setError({common: 'Something went wrong. Please try again later'});
                }
            });
    }, [password, repeatPassword]);

    if (success) {
        return (
            <div className={'w-full flex flex-col justify-center'}>
                <p className={'text-green-600 text-center text-sm m-3 font-semibold'}>Password reset successfully</p>
                <Link href={'/auth/login/'} className={'w-full'}>
                    <button
                        className={'w-full bg-gray-700 text-gray-200 p-2 rounded-md font-semibold shadow mt-2'}
                    >
                        Go to login
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <form className={'w-full flex flex-col justify-center'} autoComplete={'off'}>
            {
                challengeVerified ?
                    challengeVerificationError ?
                        <>
                            <p className={'text-red-600 text-center text-sm m-3 font-semibold'}>{challengeVerificationError}</p>
                            <Link href={'/auth/reset-password/'} className={'w-full'}>
                                <button
                                    className={'w-full bg-gray-700 text-gray-200 p-2 rounded-md font-semibold shadow mt-2'}
                                >
                                    Try again
                                </button>
                            </Link>
                        </>
                        :
                        <>
                            <div className={'w-full mb-3 relative'}>
                                <label className={'font-medium text-sm'}>New Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={'w-full p-2 mt-0.5 rounded-md border border-gray-300 outline-none pr-10'}
                                    onFocus={e => changeShowPasswordComplexity(e, true)}
                                    onBlur={e => changeShowPasswordComplexity(e, false)}
                                    autoComplete={'new-password'}
                                    name={'password'}
                                />
                                <Visibility
                                    className={'absolute bottom-2 right-1.5 !w-5 cursor-pointer visibility-icon outline-none'}
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    tabIndex={-1}
                                />
                            </div>
                            {
                                showPasswordComplexity && (
                                    <>
                                        <ErrorProgressBar max={5} current={passwordComplexity.complexity}
                                                          className={'mb-3'}/>
                                        <div className={'mb-3'}>
                                            {
                                                passwordComplexity.errors.length > 0 ? (
                                                        passwordComplexity.errors.map((error, index) => (
                                                            <p key={index}
                                                               className={'text-red-600 text-xs font-semibold'}>{error}</p>
                                                        ))
                                                    )
                                                    :
                                                    <p className={'text-green-600 text-xs font-semibold'}>Password is
                                                        strong</p>

                                            }
                                        </div>
                                    </>
                                )
                            }
                            <div className={'w-full relative'}>
                                <label className={'font-medium text-sm'}>Repeat Password</label>
                                <input
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    value={repeatPassword}
                                    onChange={e => setRepeatPassword(e.target.value)}
                                    className={'w-full p-2 mt-0.5 rounded-md border border-gray-300 outline-none'}
                                    autoComplete={'new-password'}
                                    name={'repeat-password'}
                                />
                                <Visibility
                                    className={'absolute bottom-2 right-1.5 !w-5 cursor-pointer outline-none'}
                                    onMouseDown={() => setShowRepeatPassword(true)}
                                    onMouseUp={() => setShowRepeatPassword(false)}
                                    onMouseLeave={() => setShowRepeatPassword(false)}
                                />
                            </div>
                            {
                                (!isPasswordSame && !!repeatPassword) &&
                                <span
                                    className={'text-red-600 text-xs font-semibold mt-2'}>Passwords do not match</span>
                            }
                            {
                                error?.repeatPassword &&
                                <span className={'text-red-600 text-xs font-semibold mt-2'}>{error.repeatPassword}</span>
                            }
                            {
                                error?.common &&
                                <p className={'text-red-600 text-xs font-semibold mt-2'}>{error.common}</p>
                            }
                            <button
                                className={'w-full mt-2 bg-gray-700 flex flex-row items-center justify-center text-gray-200 disabled:opacity-50 py-2 rounded-md shadow hover:bg-gray-600 font-semibold'}
                                disabled={!isPasswordSame || passwordComplexity.complexity < 5}
                                onClick={sendPassword}
                            >
                                Reset Password
                            </button>
                        </>
                    :
                    <SpinnerLoader fill={'#374151'} width={'4rem'} height={'4rem'}/>
            }
        </form>
    );
};