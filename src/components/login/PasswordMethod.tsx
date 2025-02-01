import {useCallback, useMemo, useRef, useState} from 'react';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {authWithPassword} from "@/lib/api/auths";
import {ButtonLoader} from "@/components";

type Props = {
    email: string;
    setEmailError?: (error: string) => void;
}

export const PasswordMethod = (props: Props) => {
    const [passwordVal, setPasswordVal] = useState('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [error, setError] = useState('');
    const passwordField = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);


    const passwordVisibilityIcon = useMemo(() => {
        return <button
            onMouseDown={() => setPasswordVisible(true)}
            onMouseUp={() => setPasswordVisible(false)}
            onMouseLeave={() => setPasswordVisible(false)}
        >
            {passwordVisible ? <Visibility fill={'#5C5F62'} style={{width: '17px'}}/> :
                <VisibilityOff fill={'#5C5F62'} style={{width: '17px'}}/>}
        </button>
    }, [passwordVisible]);

    const login = useCallback(() => {
        setLoading(true);
        authWithPassword(
            props.email,
            passwordVal,
        )
            .then(console.log)
            .catch(
                ({data}) => {
                    if (data.password) {
                        setError(data.password)
                        passwordField.current?.focus();
                        passwordField.current?.select();
                    }
                    if (props.setEmailError) props.setEmailError(data.email);
                }
            ).finally(() => setLoading(false));
    }, [props, passwordVal]);
    const changePassword = useCallback((password: string) => {
        if (error) setError('');
        setPasswordVal(password);
    }, [error]);

    return (
        <div className={'w-full'}>
            <div className={'mt-3 relative'}>
                <label htmlFor="password">Password</label>
                <input name={'password'} type={passwordVisible ? 'text' : 'password'}
                       className={'mt-2 outline-none rounded-md border w-full py-2 pl-2 pr-8'}
                       onChange={e => changePassword(e.target.value)} ref={passwordField}/>
                <div className={'absolute bottom-2 right-2'}>
                    {passwordVisibilityIcon}
                </div>
            </div>
            {error && (<span className={'text-red-600 text-xs font-semibold'}>{error}</span>)}
            <button
                className={'mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md font-semibold flex flex-row justify-center items-center'}
                onClick={login}
                disabled={loading}
            >
                {loading ?
                    <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/> :
                    <span>Login with Password</span>
                }
            </button>
        </div>
    );
};