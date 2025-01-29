import {useState} from "react";
import {PasskeyMethod} from "@/components/login/PasskeyMethod";
import {beginPasskeyRegistration, endPasskeyRegistration} from "@/lib/api/auths";
import {GoogleMethod} from "@/components/login/GoogleMethod";
import {Microsoft} from "@mui/icons-material";
import {MicrosoftMethod} from "@/components/login/MicrosoftMethod";

type Props = {
    email: string,
    loginMethods: string[],
    defaultMethod: string,
};

export const LoginMethods = (props: Props) => {
    const [selectedMethod, setSelectedMethod] = useState<string>(props.defaultMethod);

    const registerPasskey = () => {
        beginPasskeyRegistration().then(res => {
            const options = JSON.parse(res.data)

            options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));
            const base64Url = options.challenge.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
            options.challenge = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0));
            options.excludeCredentials = options.excludeCredentials.map(cred => {
                const base64Url = cred.id.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
                const id = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0)).buffer;
                return {
                    ...cred,
                    id,
                }
            })

            navigator.credentials.create({
                publicKey: options
            }).then(credential => {
                console.log('register id', credential.id);
                const publicKeyCredential = {
                    id: credential.id,
                    rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
                    type: credential.type,
                    response: {
                        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
                        attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                    }
                };
                endPasskeyRegistration(publicKeyCredential).then(console.log)
            })
                .catch(console.error);
        });
    }

    return (
        <>
            {/*<PasswordMethod email={props.email}/>*/}
            {/*<PasskeyMethod email={props.email}/>*/}
            {/*<GoogleMethod/>*/}
            <MicrosoftMethod/>
        </>
    );
};