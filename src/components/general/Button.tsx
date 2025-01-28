// @flow
import * as React from 'react';
import {useMemo} from 'react';

type Props = {
    children: React.ReactNode,
    onClick?: () => void,
    type: 'small' | 'full-cover',
    background: 'transparent' | 'accent',
    className?: string[];
};

export const Button = (props: Props) => {
    const className = useMemo(() => {
        if (props.className === undefined) {
            return '';
        }
        return props.className.map(name => name.startsWith('!') ? `!${name}` : name).join(' ');
    }, [props.className]);

    return (
        <button
            className={`min-h-9 min-w-16 px-5 py-2 h-fit flex flex-row items-center justify-center ${className} ${props.background == 'transparent' ? 'bg-transparent border-black hover:bg-gray-100' : 'bg-gray-400 text-black hover:bg-gray-500'} ${props.type == 'small' ? 'rounded-3xl w-fit' : 'rounded-md w-full'}`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};