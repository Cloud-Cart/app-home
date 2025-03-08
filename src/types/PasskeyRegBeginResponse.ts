import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';

export type PasskeyRegBeginResponse = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    options: PublicKeyCredentialCreationOptionsJSON;
}