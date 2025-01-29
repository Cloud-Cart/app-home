import publicInstance from "@/lib/api/instance";

const getEmailAuthMethods = async (email: string) => {
    return publicInstance.post(
        '/auth/methods/',
        {email}
    )
}

const authWithPassword = async (email: string, password: string) => {
    return publicInstance.post(
        '/auth/login/',
        {email, password}
    )
}

const beginPasskeyRegistration = async () => {
    return publicInstance.get(
        '/auth/b-passkey-registration/',
    )
}

const endPasskeyRegistration = async (publicKeyCredential: {
    id: string,
    rawId: string,
    type: string,
    response: any
}) => {
    return publicInstance.post(
        '/auth/c-passkey-register/',
        publicKeyCredential,
        {
            withCredentials: true,
        }
    )
}

const beginPasskeyAuthentication = (email?: string) => {
    return publicInstance.get(
        '/auth/b-passkey-authentication/',
        {
            params: {
                email,
            }
        }
    )
}

const endPasskeyAuthentication = (data: any) => {
    return publicInstance.post(
        '/auth/c-passkey-authentication/',
        data
    )
}

const googleSocialLogin = (code: string) => {
    return publicInstance.post(
        '/auth/social-login/google/',
        {code}
    )
}

const microsoftSocialLogin = ({code}: { code: string; }) => {
    return publicInstance.post(
        '/auth/social-login/microsoft/',
        {code}
    )
}

const facebookSocialLogin = ({code}: { code: string; }) => {
    return publicInstance.post(
        '/auth/social-login/facebook/',
        {code}
    )
}

export {
    getEmailAuthMethods,
    authWithPassword,
    beginPasskeyRegistration,
    endPasskeyRegistration,
    beginPasskeyAuthentication,
    endPasskeyAuthentication,
    googleSocialLogin,
    microsoftSocialLogin,
    facebookSocialLogin
}