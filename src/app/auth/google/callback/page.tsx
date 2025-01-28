'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {googleSocialLogin} from "@/lib/api/auths";

export default function GoogleCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleGoogleCallback = () => {
            const code = searchParams.get('code');
            if (code) {
                googleSocialLogin(code).then(response => {
                    router.replace('/auth/login/');
                })
            }
        };

        handleGoogleCallback();
    }, [router, searchParams]);

    return <p>Signing you in...</p>;
}
