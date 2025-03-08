import {HTMLInputAutoCompleteAttribute, RefObject, useCallback, useEffect, useMemo, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ErrorProgressBar} from "@/components";
import {checkPassword} from "@/lib/utils";

type Props = {
    value: string,
    changeValue: (value: string) => void,
    label?: string,
    loading?: boolean,
    ref?: RefObject<HTMLInputElement | null>,
    placeholder?: string,
    name?: string,
    autocomplete?: HTMLInputAutoCompleteAttribute,
    error?: string | string[],
    showComplexity?: boolean,
    onValidityChange?: (valid: boolean) => void,
}

export const PasswordField = (props: Props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [showPasswordComplexity, setShowPasswordComplexity] = useState(false);

    const passwordVisibilityIcon = useMemo(() => {
        return <button
            onMouseDown={() => setPasswordVisible(true)}
            onMouseUp={() => setPasswordVisible(false)}
            onMouseLeave={() => setPasswordVisible(false)}
            tabIndex={-1}
        >
            {passwordVisible ?
                <Visibility
                    fill={'#5C5F62'}
                    style={{width: '17px'}}
                /> :
                <VisibilityOff
                    fill={'#5C5F62'}
                    style={{width: '17px'}}
                />}
        </button>
    }, [passwordVisible]);

    const passwordComplexity = useMemo(() => {
        return checkPassword(props.value);
    }, [props.value]);

    const changeShowPasswordComplexity = useCallback((event: React.FocusEvent<HTMLInputElement>, value: boolean) => {
        if (event.relatedTarget?.classList.contains('visibility-icon')) return;
        setShowPasswordComplexity(value);
    }, []);

    useEffect(() => {
        if (props.onValidityChange) props.onValidityChange(passwordComplexity.isValid);
    }, [passwordComplexity.isValid, props]);

    const errorBorder = useMemo(() => {
        return !!((props.error || (props.showComplexity && !passwordComplexity.isValid)) && !props.loading && props.value);
    }, [passwordComplexity.isValid, props.error, props.loading, props.showComplexity, props.value]);

    return (
        <>
            <div className={'mt-3 relative'}>
                {props.label && <label htmlFor="password">{props.label}</label>}
                <input
                    name={props.name || 'password'}
                    type={passwordVisible ? 'text' : 'password'}
                    className={`mt-2 outline-none rounded-md border w-full py-2 pl-2 pr-8 ${errorBorder && 'border-red-600'}`}
                    onChange={e => props.changeValue(e.target.value)}
                    ref={props.ref}
                    autoComplete={props.autocomplete || 'password'}
                    placeholder={props.placeholder}
                    readOnly={props.loading}
                    value={props.value}
                    onFocus={e => changeShowPasswordComplexity(e, true)}
                    onBlur={e => changeShowPasswordComplexity(e, false)}
                />
                <div className={'absolute bottom-2 right-2'}>
                    {passwordVisibilityIcon}
                </div>
            </div>
            {
                showPasswordComplexity && props.showComplexity && (
                    <>
                        <ErrorProgressBar
                            max={passwordComplexity.max}
                            current={passwordComplexity.complexity}
                            className={'my-3'}
                        />
                        <div className={'mb-3'}>
                            {
                                passwordComplexity.errors.length > 0 ? (
                                        passwordComplexity.errors.map((error, index) => (
                                            <p key={index} className={'text-red-600 text-xs font-semibold'}>
                                                {error}
                                            </p>
                                        ))
                                    )
                                    :
                                    <p className={'text-green-600 text-xs font-semibold'}>
                                        Password is strong
                                    </p>

                            }
                        </div>
                    </>
                )
            }
            {props.error && (
                Array.isArray(props.error) ?
                    props.error.map((error, index) => (
                        <span
                            key={index}
                            className={'mt-2 text-red-600 text-xs font-semibold'}
                        >
                            {error}
                        </span>
                    ))
                    :
                    <span className={'mt-2 text-red-600 text-xs font-semibold'}>
                    {props.error}
                </span>
            )}
        </>
    );
};