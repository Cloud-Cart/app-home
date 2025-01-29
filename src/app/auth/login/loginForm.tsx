'use client'
import {useCallback, useEffect, useState} from "react";
import {Button, InputField} from "@/components";
import {getEmailAuthMethods} from "@/lib/api/auths";
import {LoginMethods} from "@/app/auth/login/loginMethods";
import {LoginFunctions} from "@/app/auth/login/loginFunctions";

export const LoginForm = () => {
    const [email, setEmail] = useState<string>();
    const [emailVal, setEmailVal] = useState<string>('');
    const [loginMethods, setLoginMethods] = useState<string[]>([]);
    const [defaultMethod, setDefaultMethod] = useState<string>('');
    const [selectedLoginMethod, setSelectedLoginMethod] = useState<string>()


    useEffect(() => {
        const removeEmail = (e: PopStateEvent) => {
            e.preventDefault();
            setEmail(undefined)
        }
        if (!!email) {
            window.addEventListener('popstate', removeEmail);
            return () => window.removeEventListener('popstate', removeEmail);
        }
    }, [email]);

    const checkEmail = useCallback((email: string) => {
        getEmailAuthMethods(email).then((response) => {
            setEmail(response.data.email);
            const methods = response.data.socialAccounts
            if (response.data.isPasskeyAvailable){
                methods.push('passkey')
            }
            if (response.data.isPasswordAvailable){
                methods.push('password')
            }
            setLoginMethods(methods);
            setDefaultMethod(response.data.defaultMethod);
        })
    }, []);

    return (
        <>
            <InputField
                label={'Email'}
                type={'email'}
                onChange={setEmailVal}
                readOnly={!!email}
            />
            {
                !email &&
                <Button
                    onClick={() => checkEmail(emailVal)}
                    type={"full-cover"}
                    background={"accent"}
                    className={['mt-2']}
                >
                    Continue with email
                </Button>
            }
            {
                !!email ?
                    <LoginMethods email={email} loginMethods={loginMethods} defaultMethod={defaultMethod} /> :
                    <LoginFunctions/>
            }
        </>
    );
};