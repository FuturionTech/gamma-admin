import gql from 'graphql-tag';

export const meTenantQuery = gql`
    query MeTenant($input: MeInput!) {
        meTenant(input: $input) {
            success
            message
            user {
                id
                first_name
                last_name
                email
                phone
                profile_picture
                created_at
                updated_at
            }
        }
    }
`;

export const meAdministratorQuery = gql`
    query MeAdministrator($input: MeInput!) {
        meAdministrator(input: $input) {
            success
            message
            user {
                id
                first_name
                last_name
                email
                phone
                profile_picture
                created_at
                updated_at
            }
        }
    }
`;
