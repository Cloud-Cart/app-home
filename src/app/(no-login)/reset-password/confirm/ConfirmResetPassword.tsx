'use client'
import {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import {setResetPassword, verifyResetPasswordChallenge} from "@/lib/api/auths";
import {PasswordField, SpinnerLoader} from "@/components";
import Link from "next/link";
import {checkPassword} from "@/lib/utils";

type errorType = {
    password?: string;
    repeatPassword?: string;
    common?: string;
}

type Props = {
    setSubtext: (subtext: string) => void;
};

export const ConfirmResetPassword = (props: Props) => {
    const [challengeVerified, setChallengeVerified] = useState(false);
    const [error, setError] = useState<errorType>();
    const [challengeVerificationError, setChallengeVerificationError] = useState<string>();
    const searchParams = useSearchParams();
    const [success, setSuccess] = useState(false);
    const [settingPassword, setSettingPassword] = useState(false);

    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setChallengeVerificationError('Invalid URL');
            return;
        }
        verifyResetPasswordChallenge(token)
            .then(() => {
                props.setSubtext('Enter new credentials');
            })
            .catch(({status, data}) => {
                if (status === 400) {
                    setChallengeVerificationError(data.token);
                } else {
                    setChallengeVerificationError('Something went wrong. Please try again later');
                }
                props.setSubtext('');
            })
            .finally(() => setChallengeVerified(true));
    }, [props, searchParams]);

    const passwordComplexity = useMemo(() => {
        return checkPassword(password);
    }, [password]);

    const isPasswordSame = useMemo(() => {
        return password === repeatPassword;
    }, [password, repeatPassword]);

    const sendPassword = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!isPasswordSame || passwordComplexity.isValid) return;
        setSettingPassword(true);
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
                props.setSubtext('');
            }).finally(() => setSettingPassword(false));
    }, [isPasswordSame, password, passwordComplexity.isValid, props, repeatPassword]);

    const repeatPasswordError = useMemo(() => {
        const errors = [];
        if (!isPasswordSame && !!repeatPassword) {
            errors.push('Passwords do not match');
        }
        if (error?.repeatPassword) {
            errors.push(error.repeatPassword);
        }
        if (error?.common) {
            errors.push(error.common);
        }
        return errors;
    }, [
        error?.common,
        error?.repeatPassword,
        isPasswordSame,
        repeatPassword
    ]);

    if (success) {
        return (
            <div className={'w-full flex flex-col justify-center'}>
                <p className={'text-green-600 text-center text-sm m-3 font-semibold'}>Password reset successfully</p>
                <Link href={'/auth/'} className={'w-full'}>
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
                            <Link href={'/reset-password/'} className={'w-full'}>
                                <button
                                    className={'w-full bg-gray-700 text-gray-200 p-2 rounded-md font-semibold shadow mt-2'}
                                >
                                    Try again
                                </button>
                            </Link>
                        </>
                        :
                        <>
                            <PasswordField
                                value={password}
                                changeValue={setPassword}
                                autocomplete={'auto-password'}
                                name={'password'}
                                showComplexity={true}
                                label={'New Password'}
                            />
                            <PasswordField
                                value={repeatPassword}
                                changeValue={setRepeatPassword}
                                autocomplete={'new-password'}
                                name={'repeat-password'}
                                label={'Repeat Password'}
                                error={repeatPasswordError}
                            />
                            <button
                                className={'w-full mt-2 bg-gray-700 flex flex-row items-center justify-center text-gray-200 disabled:opacity-50 py-2 rounded-md shadow hover:bg-gray-600 font-semibold'}
                                disabled={!isPasswordSame || passwordComplexity.complexity < 5 || settingPassword}
                                onClick={sendPassword}
                            >
                                Reset Password
                            </button>
                        </>
                    :
                    <div className={'w-full flex justify-center'}>
                        <SpinnerLoader fill={'#374151'} width={'4rem'} height={'4rem'}/>
                    </div>
            }
        </form>
    );
};