import gql from 'graphql-tag';

export const requestOtpMutation = gql`
    mutation RequestOtp($input: RequestOtpInput!) {
        requestOtp(input: $input) {
            success
            message
        }
    }
`;

export const verifyOtpMutation = gql`
    mutation VerifyOtp($input: VerifyOtpInput!) {
        verifyOtp(input: $input) {
            success
            message
            authToken
            expiresAt
        }
    }
`;
