import {Button} from "@/components";
import {LoginComponentProps} from "@/components/login/props";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FacebookMethod = (props: LoginComponentProps) => {
    const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_API_ID;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/facebook`

    const handleLogin = () => {
        window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile`;
    };



    return (
        <Button type={'full-cover'} background={'accent'} className={['mt-2']}
                onClick={handleLogin}>
            Login with Facebook
        </Button>
    );
};