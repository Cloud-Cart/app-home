'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {facebookSocialLogin} from "@/lib/api/auths";

const CallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleFacebookCallback = () => {
            const code = searchParams.get("code");
            if (code) {
                try {
                    facebookSocialLogin({
                        code,
                    }).then(response => {
                        router.replace("/auth/login/");
                    })
                } catch (error) {
                    router.replace("/auth/error/"); // Redirect to an error page
                }
            }
        };

        handleFacebookCallback();
    }, [router, searchParams]);

    return <p>Signing you in...</p>;
};

export default CallbackPage;
