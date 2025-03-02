import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';

export type PasskeyRegisterResponseData = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    options: PublicKeyCredentialCreationOptionsJSON;
}