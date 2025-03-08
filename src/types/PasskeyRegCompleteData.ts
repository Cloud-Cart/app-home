import {RegistrationResponseJSON} from "@simplewebauthn/browser";

export type PasskeyRegCompleteData = {
    userId: string;
    response: RegistrationResponseJSON;
}