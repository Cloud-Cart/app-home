import {Button} from "@/components";


export const MicrosoftMethod = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_MSAL_CLIENT_ID;
    const TENANT_ID = process.env.NEXT_PUBLIC_MSAL_TENANT_ID
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/microsoft`

    const handleLogin = () => {
        window.location.href = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&response_mode=query&scope=User.Read`
    };


    return (
        <Button type={'full-cover'} background={'accent'} className={['mt-2']}
                onClick={handleLogin}>
            Login with Microsoft
        </Button>
    );
};