// @flow
import * as React from 'react';
import {useCallback, useMemo, useState} from 'react';
import {Button, InputField} from "@/components";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {authWithPassword} from "@/lib/api/auths";

type Props = {
    email: string;
};

export const PasswordMethod = (props: Props) => {
    const [passwordVal, setPasswordVal] = useState('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const passwordVisibilityIcon = useMemo(() => {
        return <button
            onMouseDown={() => setPasswordVisible(true)}
            onMouseUp={() => setPasswordVisible(false)}
            onMouseLeave={() => setPasswordVisible(false)}
        >
            {passwordVisible ? <Visibility style={{width: '17px'}}/> : <VisibilityOff style={{width: '17px'}}/>}
        </button>
    }, [passwordVisible]);

    const loginWithPassword = useCallback(() => {
        authWithPassword(
            props.email,
            passwordVal,
        ).then(console.log)
    }, [props.email, passwordVal]);

    return (
        <>
            <InputField type={passwordVisible ? 'text' : 'password'} label={'Password'} className={'mt-2'}
                        onChange={setPasswordVal} rightSideIcon={passwordVisibilityIcon}/>
            <Button
                type={"full-cover"}
                background={"accent"}
                className={['mt-2']}
                onClick={loginWithPassword}
            >
                Login with password
            </Button>
        </>
    );
};