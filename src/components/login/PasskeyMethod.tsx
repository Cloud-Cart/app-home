import {Button} from "@/components";
import {beginPasskeyAuthentication, endPasskeyAuthentication} from "@/lib/api/auths";

type Props = {
    email: string,
};

export const PasskeyMethod = (props: Props) => {
    const loginPasskey = (email?: string) => {
        beginPasskeyAuthentication(email).then(res => {
            const options = JSON.parse(res.data);
            const base64Url = options.challenge.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
            options.challenge = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0));
            options.allowCredentials = options.allowCredentials.map(cred => {
                const base64Url = cred.id.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
                const id = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0)).buffer;
                return {
                    ...cred,
                    id,
                }
            })
            const abortController = new AbortController();

            navigator.credentials.get({
                publicKey: options,
                signal: abortController.signal,
                mediation: "optional"
            }).then(credential => {
                const publicKeyCredential = {
                    id: credential.id,
                    rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
                    response: {
                        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
                        authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credential.response.authenticatorData))),
                        signature: btoa(String.fromCharCode(...new Uint8Array(credential.response.signature))),
                        userHandle: btoa(String.fromCharCode(...new Uint8Array(credential.response.userHandle)),)
                    },
                    type: credential.type,
                }
                endPasskeyAuthentication(publicKeyCredential).then(console.log)
            }).catch(console.error);
        })
    }
    return (
        <Button type={'full-cover'} background={'accent'} className={['mt-2']} onClick={() => loginPasskey(props.email)}>
            Login to {props.email}
        </Button>
    );
};