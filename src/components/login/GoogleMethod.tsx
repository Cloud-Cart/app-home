import {Button} from "@/components";
import {LoginComponentProps} from "@/components/login/props";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GoogleMethod = (props: LoginComponentProps) => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/google`

    const handleLogin = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile`; // Redirect to Google
    };


    return (
        <Button type={'full-cover'} background={'accent'} className={['mt-2']}
                onClick={handleLogin}>
            Login with Google
        </Button>
    );
};