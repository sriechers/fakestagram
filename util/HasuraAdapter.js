// const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
import createUserHandle from "../util/createUserHandle";

export const hasuraRequest = async ({ query, variables }) => {
  const result = await fetch(process.env.HASURA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  }).then((res) => res.json());

  return { ...result };
};

export const hasuraAuthRequest = async ({ token, query, variables }) => {
  const result = await fetch(process.env.HASURA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  }).then((res) => res.json());

  return { ...result };
};

export const hasuraClaims = async (id) => {
  const jwtSecret = JSON.parse(process.env.AUTH_PRIVATE_KEY);
  const token = jwt.sign(
    {
      userId: `${id}`,
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": `${id}`,
        "x-hasura-role": "user",
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
      },
      iat: Date.now() / 1000,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      sub: `${id}`,
    },
    jwtSecret.key,
    {
      algorithm: jwtSecret.type,
    }
  );
  return token;
};

export const hasuraDecodeToken = async (token) => {
  const jwtSecret = JSON.parse(process.env.AUTH_PRIVATE_KEY);
  const decodedToken = jwt.verify(token, jwtSecret.key, {
    algorithms: jwtSecret.type,
  });
  return decodedToken;
};

const CREATE_USER = `
  mutation CreateUser($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id
      photoUrl
      username
      displayName
      userHandle
      email
    }
  }
`;

const GET_USER_BY_ID = `
  query GetUserById($id: Int!) {
    users(where: { id: { _eq: $id } }) {
      id
      email
    }
  }
`;

const GET_USER_BY_EMAIL = `
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
    }
  }
`;

const GET_USER_BY_ACCOUNT = `
  query GetUser($provider: String!, $providerAccountId: String!) {
    accounts(
      where: {
        provider: { _eq: $provider }
        _and: { provider_account_id: { _eq: $providerAccountId } }
      }
    ) {
      provider_account_id
      provider
      user {
        created_at
        displayName
        email
        id
        username
        userHandle
        photoUrl
        updated_at
      }
    }
  }
`;

const LINK_ACCOUNT = `
  mutation LinkAccount($account: accounts_insert_input!) {
    insert_accounts_one(object: $account) {
      id
      user_id
      provider
      provider_type
      provider_account_id
      scope
      token_type
      id_token
      access_token
      access_token_expires
    }
  }
`;

/** @return { import("next-auth/adapters").Adapter } */
export const HasuraAdapter = (config = {}, options = {}) => {
  return {
    displayName: "HASURA",
    async createUser(profile) {
      const { data } = await hasuraRequest({
        query: CREATE_USER,
        variables: {
          user: {
            displayName: profile.name,
            username: profile.username ? profile.username : profile.name,
            email: profile.email,
            photoUrl: profile.image,
            userHandle: createUserHandle(
              profile.username ? profile.username : profile.name
            ),
          },
        },
      });
      return data?.insert_users_one || null;
    },
    async getUser(id) {
      const { data } = await hasuraRequest({
        query: GET_USER_BY_ID,
        variables: {
          id,
        },
      });
      return data?.users[0] || null;
    },
    async getUserByEmail(email) {
      const { data } = await hasuraRequest({
        query: GET_USER_BY_EMAIL,
        variables: {
          email,
        },
      });

      return data?.users[0] || null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const { data } = await hasuraRequest({
        query: GET_USER_BY_ACCOUNT,
        variables: {
          provider,
          providerAccountId,
        },
      });

      return data?.accounts[0]?.user || null;
    },
    async updateUser(user) {
      return null;
    },
    async deleteUser(userId) {
      return null;
    },
    async linkAccount({
      provider,
      type,
      providerAccountId,
      access_token,
      expires_at,
      token_type,
      scope,
      id_token,
      refresh_token,
      userId,
    }) {
      const { data } = await hasuraRequest({
        query: LINK_ACCOUNT,
        variables: {
          account: {
            user_id: userId,
            provider: provider,
            provider_type: type,
            provider_account_id: providerAccountId,
            // refresh_token: refresh_token,
            id_token: id_token,
            scope: scope,
            token_type: token_type,
            access_token: access_token,
            access_token_expires: new Date(Date.now() + expires_at * 1000), // FIXME
          },
        },
      });
      return data?.insert_accounts_one || null;
    },
    async unlinkAccount(userId, providerId, providerAccountId) {
      return null;
    },
    async createSession(user) {
      return null;
    },
    async getSessionAndUser(sessionToken) {
      return null;
    },
    async updateSession(session, force) {
      return null;
    },
    async deleteSession(sessionToken) {
      return null;
    },
    async createVerificationToken(identifier, url, token, secret, provider) {
      return null;
    },
    async useVerificationToken(identifier, token, secret, provider) {
      return null;
    },
  };
};
