import {useCallback, useEffect, useRef, useState} from 'react';
import {authWithPassword} from "@/lib/api/auths";
import {ButtonLoader} from "@/components";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {PasswordField} from "@/components/general/PasswordField";

type Props = {
    email: string;
    setEmailError?: (error: string) => void;
}

export const PasswordMethod = (props: Props) => {
    const [passwordVal, setPasswordVal] = useState('');
    const [error, setError] = useState('');
    const passwordField = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = useCallback(() => {
        setLoading(true);
        authWithPassword(
            props.email,
            passwordVal,
        )
            .then(() => {

            })
            .catch(
                ({data, status}) => {
                    if (status === 400) {
                        if (data.password) {
                            setError(data.password)
                            passwordField.current?.focus();
                            passwordField.current?.select();
                        }
                        if (props.setEmailError) props.setEmailError(data.email);
                    } else if (status === 206) router.push("/auth/second-step/")
                }
            ).finally(() => setLoading(false));
    }, [props, passwordVal, router]);

    const changePassword = useCallback((password: string) => {
        if (loading) return;
        if (error) setError('');
        setPasswordVal(password);
    }, [error, loading]);

    useEffect(() => {
        if (passwordField.current) passwordField.current.focus();
    }, []);

    return (
        <form className={'w-full'} onSubmit={(event) => {
            event.preventDefault();
            if (!passwordVal || loading) return;
            login();
        }}>
            <PasswordField
                value={passwordVal}
                changeValue={changePassword}
                label={'Password'}
                loading={loading}
                name={'password'}
                placeholder={'Enter your password'}
                ref={passwordField}
                autocomplete={'current-password'}
                error={error}
            />
            <p className={'text-xs font-semibold mb-3 mt-1.5 text-end'}>Forgot your password? <Link
                href={'/(no-login)/reset-password/'} className={'text-blue-600'}>Reset here</Link></p>
            <button
                className={'mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md font-semibold flex flex-row justify-center items-center disabled:opacity-50'}
                disabled={loading || !passwordVal}
                type={'submit'}
            >
                {loading ?
                    <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/> :
                    <span>Login with Password</span>
                }
            </button>
        </form>
    );
};