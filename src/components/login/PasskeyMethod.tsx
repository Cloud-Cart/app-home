import {Button} from "@/components";
import {beginPasskeyAuthentication, endPasskeyAuthentication,} from "@/lib/api/auths";
import {LoginComponentProps} from "@/components/login/props";


export const PasskeyMethod = (props: LoginComponentProps) => {
    //
    // const registerPasskey = () => {
    //     beginPasskeyRegistration().then(res => {
    //         const options = JSON.parse(res.data)
    //
    //         options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));
    //         const base64Url = options.challenge.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
    //         options.challenge = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0));
    //         options.excludeCredentials = options.excludeCredentials.map(cred => {
    //             const base64Url = cred.id.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
    //             const id = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0)).buffer;
    //             return {
    //                 ...cred,
    //                 id,
    //             }
    //         })
    //
    //         navigator.credentials.create({
    //             publicKey: options
    //         }).then(credential => {
    //             console.log('register id', credential.id);
    //             const publicKeyCredential = {
    //                 id: credential.id,
    //                 rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
    //                 type: credential.type,
    //                 response: {
    //                     clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
    //                     attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
    //                 }
    //             };
    //             endPasskeyRegistration(publicKeyCredential).then(console.log)
    //         })
    //             .catch(console.error);
    //     });
    // }

    const loginPasskey = (email?: string) => {
        beginPasskeyAuthentication(email).then(res => {
            const options = JSON.parse(res.data);
            const base64Url = options.challenge.replace(/_/g, '/').replace(/-/g, '+');  // Replace URL-safe Base64 chars
            options.challenge = Uint8Array.from(atob(base64Url), c => c.charCodeAt(0));
            options.allowCredentials = options.allowCredentials.map((cred: { id: string, type: string }) => {
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
            }).then((credential) => {
                if (credential == null) {
                    return credential;
                }
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
        <Button type={'full-cover'} background={'accent'} className={['mt-2']}
                onClick={() => loginPasskey(props.email)}>
            Login to {props.email}
        </Button>
    );
};