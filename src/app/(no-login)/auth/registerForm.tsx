'use client'
import {useSearchParams} from "next/navigation";
import {ButtonLoader} from "@/components";
import {useMemo, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";


export const RegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false)
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

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

    return (
        <form className={'w-full'}>
            <div className={'mt-3 relative'}>
                <label htmlFor="password">Password</label>
                <input
                    name={'password'}
                    type={'password'}
                    className={'mt-2 outline-none rounded-md border w-full py-2 pl-2 pr-8'}
                    autoComplete={'current-password'}
                    placeholder={'Enter your password'}
                />
                <div className={'absolute bottom-2 right-2'}>
                    {passwordVisibilityIcon}
                </div>
            </div>
            <span className={'text-red-600 text-xs font-semibold'}>This is error</span>
            <button
                className={'mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md font-semibold flex flex-row justify-center items-center disabled:opacity-50'}
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