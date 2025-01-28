import * as React from 'react';
import {ReactNode, useCallback, useState} from 'react';

type Props = {
    label?: string,
    type?: 'text' | 'password' | 'email',
    name?: string,
    onChange?: (value: string) => void,
    value?: string,
    readOnly?: boolean,
    required?: boolean,
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
    rightSideIcon?: ReactNode,
    className?: string,
};
export const InputField = (props: Props) => {
    const [value, setValue] = useState(props.value || '')

    const onChange = useCallback((value: string) => {
        if (props.onChange) {
            props.onChange(value)
        }
        setValue(value)
    }, [props]);

    return (
        <div className={'relative w-fit flex flex-col' + ((' ' + props.className) || '')}>
            {props.label && (<label className={'mb-2'}>{props.label}</label>)}
            <input
                type={props.type}
                name={props.name}
                className={'min-w-80 outline-none border-2 rounded-md p-1 ' +
                    (props.readOnly ? 'opacity-70' : '') +
                    (props.rightSideIcon ? 'pr-6' : '')
                }
                value={value}
                readOnly={props.readOnly}
                onChange={(e) => onChange(e.target.value)}
                onClick={props.onClick}
            />
            {props.rightSideIcon && <label className={"mt-2 absolute bottom-2 right-2"}>{props.rightSideIcon}</label>}
        </div>
    );
};