'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {microsoftSocialLogin} from "@/lib/api/auths";

const CallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleMicrosoftCallback = () => {
            const code = searchParams.get("code");
            if (code) {
                try {
                    // Call the API with code and code_verifier
                    microsoftSocialLogin({
                        code,
                    }).then(response => {
                        localStorage.removeItem("pkce_code_verifier");

                        router.replace("/auth/login/");
                    })
                } catch (error) {
                    console.error("Error during Microsoft login:", error);
                    router.replace("/auth/error/"); // Redirect to an error page
                }
            }
        };

        handleMicrosoftCallback();
    }, [router, searchParams]);

    return <p>Signing you in...</p>;
};

export default CallbackPage;
