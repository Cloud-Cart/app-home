'use client';
import {useEffect} from "react";

const CallbackPage = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && window.opener) {
            window.opener.postMessage({provider: "microsoft", code}, window.origin);
            window.close();
        }
    }, []);

    return <p>Signing you in...</p>;
};

export default CallbackPage;
