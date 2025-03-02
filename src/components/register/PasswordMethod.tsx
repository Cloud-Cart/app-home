import {ButtonLoader, PasswordField} from "@/components";
import {useEffect, useMemo, useState} from "react";

type Props = {
    setIsDataReady: (isDataReady: boolean) => void;
    isDataValid: boolean;
    loading: boolean;

}

export const PasswordMethod = (props: Props) => {
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [repeatPasswordValue, setRepeatPasswordValue] = useState<string>('');
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

    const isPasswordSame = useMemo(() => {
        return (passwordValue === repeatPasswordValue);
    }, [passwordValue, repeatPasswordValue]);

    useEffect(() => {
        props.setIsDataReady(isPasswordValid && isPasswordSame);
    }, [isPasswordSame, isPasswordValid, props]);

    return (
        <>
            <PasswordField
                name={'password'}
                value={passwordValue}
                changeValue={setPasswordValue}
                label={'Password'}
                autocomplete={'new-password'}
                placeholder={'Enter your password'}
                loading={props.loading}
                showComplexity={true}
                onValidityChange={setIsPasswordValid}
            />
            <PasswordField
                name={'repeatPassword'}
                value={repeatPasswordValue}
                changeValue={setRepeatPasswordValue}
                label={'Repeat password'}
                autocomplete={'new-password'}
                placeholder={'Repeat your password'}
                loading={props.loading}
                error={isPasswordSame || repeatPasswordValue.length === 0 ? undefined : 'Passwords do not match'}
            />
            <button
                className={'flex flex-row justify-center items-center gap-2 mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md disabled:opacity-50 hover:bg-gray-600'}
                disabled={props.loading || !props.isDataValid}
                type={'submit'}
            >
                {
                    !props.loading ?
                        <span className={'font-semibold'}>Register with Password</span>
                        :
                        <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/>
                }
            </button>
        </>
    );
};