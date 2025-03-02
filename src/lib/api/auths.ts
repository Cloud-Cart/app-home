import publicInstance from "@/lib/api/instance";
import {AxiosResponse, isAxiosError} from "axios";
import {PasskeyRegBeginData} from "@/types/PasskeyRegBeginData";
import {PasskeyRegBeginResponse} from "@/types/PasskeyRegBeginResponse";
import {AuthTokens} from "@/types/AuthTokens";
import {RegisterPasswordData} from "@/types/RegisterPasswordData";
import {PasskeyRegCompleteData} from "@/types/PasskeyRegCompleteData";
import {SocialLoginData} from "@/types/SocialLoginData";
import {PasswordAuthData} from "@/types/PasswordAuthData";
import {PasskeyAuthBeginData} from "@/types/PasskeyAuthBeginData";
import {PasskeyAuthBeginResponse} from "@/types/PasskeyAuthBeginResponse";
import {PasskeyAuthCompleteData} from "@/types/PasskeyAuthCompleteData";

const storeCreds = (access: string, refresh: string) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
}

const getEmailAuthMethods = async (email: string) => {
    try {
        const result = await publicInstance.post(
            '/auth/login/methods/',
            {email}
        )
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 403].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    reason: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const authWithPassword = async (data: PasswordAuthData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/login/password/',
            data
        )
        if (response.status === 200)
            storeCreds(response.data.access, response.data.refresh)
        if (response.status === 206) {
            return Promise.reject({
                status: 206,
                reason: 'Multi-Factor Authentication Required',
                data: response.data
            })
        }
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

const getSecondStepMethods = async () => {
    return publicInstance.get(
        '/auth/second-step/2fa-methods/'
    ).then((response) => {
        if (response.status === 200) {
            const methods: string[] = []
            if (!response.data.is2faEnabled)
                return Promise.reject({
                    status: 403,
                    reason: 'Forbidden'
                })
            if (response.data.otp2faEnabled)
                methods.push('otp')
            if (response.data.hotpVerficationEnabled)
                methods.push('authenticator')
            return {
                email: response.data.email,
                methods
            }
        }
        return {
            email: null,
            methods: []
        }
    }).catch((error) => {
        if (isAxiosError(error)) {
            if (error.response?.status === 403) {
                return Promise.reject({
                    status: 403,
                    reason: 'Forbidden'
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    })
}

const sendSecondStepOTP = async () => {
    try {
        const response = await publicInstance.get(
            '/auth/second-step/request-2fa-otp/',
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 403)
                return Promise.reject({
                    status: 403,
                    reason: 'Forbidden'
                });
            if (error.response?.status === 401)
                return Promise.reject({
                    status: 405,
                    reason: 'Method Not Allowed'
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const verifyEmailLoginOTP = async (otp: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/second-step/verify-email-otp/',
            {otp}
        );
        storeCreds(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
            if (error.response?.status === 403)
                return Promise.reject({
                    status: 403,
                    reason: 'Forbidden'
                });
            if (error.response?.status === 401)
                return Promise.reject({
                    status: 401,
                    reason: 'Unauthorized'
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const verifyAuthenticatorAppOTP = async (otp: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/second-step/verify-app-otp/',
            {otp}
        );
        storeCreds(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
            if (error.response?.status === 403)
                return Promise.reject({
                    status: 403,
                    reason: 'Forbidden'
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}


const beginPasskeyAuthentication = async (data: PasskeyAuthBeginData) => {
    try{
        const response: AxiosResponse<PasskeyAuthBeginResponse> = await publicInstance.post(
            '/auth/login/begin-passkey/',
            data
        )
        return response.data
    }
    catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const endPasskeyAuthentication = async (data: PasskeyAuthCompleteData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/login/complete-passkey/',
            data
        )
        if (response.status === 206) {
            return Promise.reject({
                status: 206,
                reason: 'Multi-Factor Authentication Required',
                data: response.data
            })
        }
        storeCreds(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const googleSocialLogin = async (data: SocialLoginData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/login/google/',
            data
        );

        if (response.status === 206) {
            return Promise.reject({
                status: 206,
                reason: 'Multi-Factor Authentication Required',
                data: response.data
            })
        }

        storeCreds(response.data.access, response.data.refresh);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 400) {
            return Promise.reject({
                status: 400,
                reason: 'Bad Request',
                data: error.response?.data
            })
        }

        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
};

const microsoftSocialLogin = async (data: SocialLoginData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/login/microsoft/',
            data
        )
        if (response.status === 206) {
            return Promise.reject({
                status: 206,
                reason: 'Multi-Factor Authentication Required',
                data: response.data
            })
        }
        storeCreds(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const facebookSocialLogin = async (data: SocialLoginData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/login/facebook/',
            data
        )
        if (response.status === 206) {
            return Promise.reject({
                status: 206,
                reason: 'Multi-Factor Authentication Required',
                data: response.data
            })
        }
        storeCreds(response.data.access, response.data.refresh)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const sendResetPasswordEmail = async (email: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/reset-password/send-email/',
            {email}
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
}

const setResetPassword = async (password1: string, password2: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/reset-password/reset/',
            {password1, password2}
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                });
            if (error.response?.status === 401) {
                return Promise.reject({
                    status: 401,
                    reason: 'Unauthorized'
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        });
    }
};


const verifyResetPasswordChallenge = async (token: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/reset-password/verify-challenge/',
            {token}
        )
        return response.data
    } catch (e) {
        if (isAxiosError(e)) {
            if (e.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: e.response?.data
                })
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const recoverAccount = async (code: string) => {
    try {
        const response = await publicInstance.post(
            '/auth/second-step/recover-account/',
            {recoveryCode: code}
        )
        return response.data
    } catch (e) {
        if (isAxiosError(e)) {
            if (e.response?.status === 400)
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: e.response?.data
                })
            if (e.response?.status === 401)
                return Promise.reject({
                    status: 401,
                    reason: 'Unauthorized'
                })
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const registerWithPassword = async (data: RegisterPasswordData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/register/password/',
            data
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const registerWithPasskey = async (data: PasskeyRegBeginData) => {
    try {
        const response: AxiosResponse<PasskeyRegBeginResponse> = await publicInstance.post(
            '/auth/register/begin-passkey/',
            data
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const completeRegisterWithPasskey = async (data: PasskeyRegCompleteData) => {
    try {
        const response: AxiosResponse<AuthTokens> = await publicInstance.post(
            '/auth/register/complete-passkey/',
            data
        )
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 400) {
                return Promise.reject({
                    status: 400,
                    reason: 'Bad Request',
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

export {
    getEmailAuthMethods,
    authWithPassword,
    beginPasskeyAuthentication,
    endPasskeyAuthentication,
    googleSocialLogin,
    microsoftSocialLogin,
    facebookSocialLogin,
    getSecondStepMethods,
    sendSecondStepOTP,
    verifyEmailLoginOTP,
    verifyAuthenticatorAppOTP,
    sendResetPasswordEmail,
    verifyResetPasswordChallenge,
    setResetPassword,
    recoverAccount,
    registerWithPassword,
    registerWithPasskey,
    completeRegisterWithPasskey
}