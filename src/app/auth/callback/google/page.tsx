'use client'

import {useEffect} from "react";

export default function GoogleCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && window.opener) {
            window.opener.postMessage({provider: "google", code}, window.origin);
            window.close();
        }
    }, []);

    return <p>Signing you in...</p>;
}
