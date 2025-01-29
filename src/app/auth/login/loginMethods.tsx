import {useMemo, useState} from "react";
import {PasswordMethod} from "@/components/login/PasswordMethod";
import {Button} from "@/components";
import {GoogleMethod} from "@/components/login/GoogleMethod";
import {MicrosoftMethod} from "@/components/login/MicrosoftMethod";
import {FacebookMethod} from "@/components/login/FacebookMethod";
import {PasskeyMethod} from "@/components/login/PasskeyMethod";

type Props = {
    email: string,
    loginMethods: string[],
    defaultMethod: string,
};


export const LoginMethods = (props: Props) => {
    const [selectedMethod, setSelectedMethod] = useState<string>(props.defaultMethod);
    const [otherOptionsOpened, setOtherOptionsOpened] = useState<boolean>(false);

    const otherOptions = useMemo(
        () => {
            return props.loginMethods.filter(method => method !== selectedMethod)
        },
        [props.loginMethods, selectedMethod]
    );

    const SelectedComponent = useMemo(() => {
        switch (selectedMethod) {
            case 'password':
                return PasswordMethod
            case 'passkey':
                return PasskeyMethod
            case 'google':
                return GoogleMethod
            case 'microsoft':
                return MicrosoftMethod
            case 'facebook':
                return FacebookMethod
            default:
                return PasswordMethod
        }
    }, [selectedMethod])

    return (
        <>
            {<SelectedComponent email={props.email}/>}
            {props.loginMethods.length > 0 &&
                <Button type={'full-cover'} background={'transparent'} className={['mt-2']}
                        onClick={() => setOtherOptionsOpened(prevState => !prevState)}>
                    Other options
                </Button>
            }
            <div className={'w-full h-fit transition-all duration-300'}>
                {otherOptionsOpened &&
                    otherOptions.map(method => {
                        switch (method) {
                            case 'google':
                                return <GoogleMethod email={props.email} key={method} />;
                            case 'facebook':
                                return <FacebookMethod email={props.email} key={method} />;
                            case 'microsoft':
                                return <MicrosoftMethod email={props.email} key={method} />;
                            case 'password':
                                return <Button
                                    type={'full-cover'}
                                    background={'transparent'}
                                    onClick={() => setSelectedMethod('password')}
                                    key={method}
                                >
                                    Sign in with Password
                                </Button>
                            default:
                                return <PasskeyMethod email={props.email} key={method} />;
                        }
                    })
                }
            </div>

            {/*<PasskeyMethod email={props.email}/>*/}
            {/*<GoogleMethod/>*/}
            {/*<MicrosoftMethod/>*/}
            {/*<FacebookMethod/>*/}
        </>
    );
};