import {HTMLInputAutoCompleteAttribute, RefObject, useMemo, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";

type Props = {
    value: string,
    changeValue: (value: string) => void,
    label?: string,
    loading?: boolean,
    ref?: RefObject<HTMLInputElement | null>,
    placeholder?: string,
    name?: string,
    autocomplete?: HTMLInputAutoCompleteAttribute,
    error?: string
}

export const PasswordField = (props: Props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const passwordVisibilityIcon = useMemo(() => {
        return <button
            onMouseDown={() => setPasswordVisible(true)}
            onMouseUp={() => setPasswordVisible(false)}
            onMouseLeave={() => setPasswordVisible(false)}
            tabIndex={-1}
        >
            {passwordVisible ? <Visibility fill={'#5C5F62'} style={{width: '17px'}}/> :
                <VisibilityOff fill={'#5C5F62'} style={{width: '17px'}}/>}
        </button>
    }, [passwordVisible]);

    return (
        <>
            <div className={'mt-3 relative'}>
                {props.label && <label htmlFor="password">{props.label}</label>}
                <input
                    name={props.name || 'password'}
                    type={passwordVisible ? 'text' : 'password'}
                    className={'mt-2 outline-none rounded-md border w-full py-2 pl-2 pr-8'}
                    onChange={e => props.changeValue(e.target.value)}
                    ref={props.ref}
                    autoComplete={props.autocomplete || 'password'}
                    placeholder={props.placeholder}
                    readOnly={props.loading}
                    value={props.value}
                />
                <div className={'absolute bottom-2 right-2'}>
                    {passwordVisibilityIcon}
                </div>
            </div>
            {props.error && (<span className={'text-red-600 text-xs font-semibold'}>{props.error}</span>)}
        </>
    );
};