import {ButtonLoader} from "@/components";
import {useEffect} from "react";
import {browserSupportsWebAuthn, platformAuthenticatorIsAvailable} from "@simplewebauthn/browser";

type Props = {
    isDataValid: boolean;
    loading: boolean;
    setIsDataReady: (isDataReady: boolean) => void;
}

export const PasskeyMethod = (props: Props) => {
    useEffect(
        () => {
            if (!browserSupportsWebAuthn())
                props.setIsDataReady(false);
            else
                platformAuthenticatorIsAvailable().then(value => props.setIsDataReady(value));
        },
        [props.setIsDataReady]
    );


    return (
        <button
            className={'flex flex-row justify-center items-center gap-2 mt-2 px-1 py-2 bg-gray-700 text-gray-200 w-full rounded-md disabled:opacity-50 hover:bg-gray-600'}
            disabled={!props.isDataValid || props.loading}
        >
            {
                !props.loading ?
                    <span className={'font-semibold'}>Register with Passkey</span>
                    :
                    <ButtonLoader fill={'#FFFFFF'} width={'1.5rem'} height={'1.5rem'}/>
            }
        </button>
    );
};