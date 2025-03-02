export type PublicKeyCredentialCreationOptionsInput = Omit<CredentialCreationOptions['publicKey'], 'user' | 'challenge' | 'excludeCredentials'> & {
    // @ts-expect-error user.id is not null
    user: { id: string | ArrayBuffer } & Omit<CredentialCreationOptions['publicKey']['user'], 'id'>;
    challenge: string | ArrayBuffer;
    // @ts-expect-error excludeCredentials.id is not null
    excludeCredentials: ({ id: string | ArrayBuffer } & Omit<CredentialCreationOptions['publicKey']['excludeCredentials'][number], 'id'>)[];
};