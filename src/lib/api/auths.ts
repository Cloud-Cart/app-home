import publicInstance from "@/lib/api/instance";
import {isAxiosError} from "axios";

const getEmailAuthMethods = async (email: string) => {
    try {
        const result = await publicInstance.post(
            '/auth/methods/',
            {email}
        )
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                return Promise.reject({
                    status: error.status,
                    reason: error.response?.data.email[0]
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const authWithPassword = async (email: string, password: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/login/',
            {email, password}
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                const data = {
                    password: '',
                    email: ''
                }
                if (error.response?.data?.email) {
                    data.email = error.response?.data?.email[0]
                }
                if (error.response?.data?.password) {
                    data.password = error.response?.data?.password[0]
                }
                return Promise.reject({
                    status: error.status,
                    reason: 'Bad Request',
                    data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
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

const googleSocialLogin = (code: string, redirectUri: string) => {
    return publicInstance.post(
        '/auth/social-login/google/',
        {code, redirectUri}
    )
}

const microsoftSocialLogin = (code: string, redirectUri: string) => {
    return publicInstance.post(
        '/auth/social-login/microsoft/',
        {code, redirectUri}
    )
}

const facebookSocialLogin = (code: string, redirectUri: string) => {
    return publicInstance.post(
        '/auth/social-login/facebook/',
        {code, redirectUri}
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