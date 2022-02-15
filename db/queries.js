import { gql } from "@apollo/client";

// ANCHOR QUERIES

export const GET_USER_BY_ID = `
  query GetUser($userId: Int!) {
    users(where: { id: { _eq: $userId } }) {
      created_at
      displayName
      email
      photoUrl
      id
    }
  }
`;

export const GET_USER_BY_POST_ID = `
  query GetUserPostsById($id: Int!) {
    users(where: { id: { _eq: $id }, order_by: {created_at: desc} }) {
      posts {
        created_at
        description
        id
        isLiked
        media
        updated_at
        user {
          displayName
          photoUrl
        }
      }
      comments {
        text
        created_at
        updated_at
        user {
          displayName
          photoUrl
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($limit: Int!) {
    posts(limit: $limit, order_by: { created_at: desc }) {
      created_at
      description
      id
      isLiked
      media
      updated_at
      user {
        displayName
        photoUrl
        userHandle
      }
      comments {
        text
        updated_at
        created_at
        id
        user {
          displayName
          id
          photoUrl
          userHandle
        }
      }
      post_likes_aggregate {
        aggregate {
          count
        }
        nodes {
          userId
        }
      }
    }
  }
`;

export const GET_POSTS_FROM_USER_ID = gql`
  query GetPostsFromUserId($limit: Int!, $userId: Int!) {
    posts(
      limit: $limit
      where: { userId: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      created_at
      description
      id
      isLiked
      media
      updated_at
      user {
        displayName
        photoUrl
        userHandle
        posts_aggregate {
          aggregate {
            count
          }
        }
      }
      comments {
        text
        updated_at
        created_at
        id
        user {
          displayName
          id
          photoUrl
          userHandle
        }
      }
      post_likes_aggregate {
        aggregate {
          count
        }
        nodes {
          userId
        }
      }
    }
  }
`;

export const GET_USER_BY_HANDLE = gql`
  query GetUserByHandle($userHandle: String!) {
    users(where: { userHandle: { _eq: $userHandle } }) {
      created_at
      displayName
      userHandle
      photoUrl
      id
    }
  }
`;

export const GET_FOLLOWERS_OF_USER = gql`
  query GetFollowersFromUserId($userId: Int!) {
    followers(where: { userId: { _eq: $userId } }) {
      id
      followerId
      user {
        displayName
        created_at
        photoUrl
        userHandle
        followers_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

export const GET_USERS_FOLLOWED = gql`
  query GetFollowers($userId: Int!) {
    followers(where: { followerId: { _eq: $userId } }) {
      id
      userByUserid {
        displayName
        email
        photoUrl
        id
        userHandle
        username
      }
    }
  }
`;

export const SEARCH = `
  query Search($search: String!) {
    posts(where: {_or: {description: {_ilike: $search}}}) {
      description
      id
      created_at
      media
      user {
        displayName
        email
        photoUrl
        id
        userHandle
      }
    }
    users(where: {_or: {userHandle: {_ilike: $search}, username: {_ilike: $search}, displayName: {_ilike: $search}}}) {
      displayName
      photoUrl
      userHandle
      username
      created_at
    }
  }
`;

export const USER_SETTING = gql`
  query UserSetting($userId: Int!) {
    user_settings(where: { userId: { _eq: $userId } }) {
      id
      timezone
      userId
    }
  }
`;

export const GET_CHAT_ROOM = `
  query GetChatRoom($roomName: String!) {
    chat_rooms(where: { name: { _eq: $roomName } }) {
      name
      id
    }
  }
`;
// ANCHOR MUTATIONS
export const INSERT_POST_LIKE = `
  mutation InsertPostLike($postId: Int!, $userId: Int!) {
    insert_post_likes_one(object: {postId: $postId, userId: $userId}) {
      id
    }
  }
`;

export const DELETE_POST_LIKE = `
  mutation DeletePostLike($postId: Int!, $userId: Int!) {
    delete_post_likes(where: {_and: {postId: {_eq: $postId}, userId: {_eq: $userId}}}) {
      returning {
        id
      }
    }
  }
`;

export const INSERT_POST_COMMENT = gql`
  mutation InsertComment($postId: Int!, $userId: Int!, $text: String!) {
    insert_comments_one(
      object: { postId: $postId, userId: $userId, text: $text }
      on_conflict: { constraint: comments_pkey, update_columns: text }
    ) {
      id
      text
      created_at
      user {
        displayName
        id
        photoUrl
        userHandle
      }
    }
  }
`;

export const DELETE_POST_COMMENT = `
  mutation DeleteComment($id: Int!) {
    delete_comments_by_pk(id: $id) {
      id
    }
  }
`;

export const UPLOAD_POST = gql`
  mutation UploadPost($description: String!, $media: String!, $userId: Int!) {
    insert_posts_one(
      object: { description: $description, media: $media, userId: $userId }
    ) {
      created_at
      description
      id
      isLiked
      media
      updated_at
      userId
    }
  }
`;

export const DELETE_USER_BY_ID = `
  mutation DeleteUser($userId: Int!) {
    delete_accounts(where: {user_id: {_eq: $userId}}) {
      returning {
        user_id
      }
    }
    delete_users(where: {id: {_eq: $userId}}) {
      returning {
        id
      }
    }
  }
`;

export const ADD_FOLLOWER = gql`
  mutation AddFollower($followerId: Int!, $userId: Int!) {
    insert_followers_one(object: { followerId: $followerId, userId: $userId }) {
      id
      followerId
      userId
    }
  }
`;

export const DELETE_FOLLOWER = gql`
  mutation DeleteFollower($followerId: Int!, $userId: Int!) {
    delete_followers(
      where: {
        _and: { followerId: { _eq: $followerId }, userId: { _eq: $userId } }
      }
    ) {
      returning {
        id
        followerId
        userId
      }
    }
  }
`;

export const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUserSettings(
    $userId: Int!
    $timezone: String = "Europe/Berlin"
  ) {
    insert_user_settings_one(
      object: { timezone: $timezone, userId: $userId }
      on_conflict: {
        constraint: user_settings_userId_key
        update_columns: timezone
        where: { userId: { _eq: $userId } }
      }
    ) {
      userId
      timezone
      id
    }
  }
`;

export const ADD_CHAT_MESSAGE = gql`
  mutation AddChatMessage(
    $fromUserId: Int!
    $toUserId: Int!
    $message: String!
    $roomId: uuid!
  ) {
    insert_chat_messages_one(
      object: {
        fromUserId: $fromUserId
        toUserId: $toUserId
        message: $message
        roomId: $roomId
      }
    ) {
      id
    }
  }
`;

export const CREATE_CHAT_ROOM = `
  mutation CreateChatRoom($roomName: String!) {
    insert_chat_rooms_one(
      object: { name: $roomName }
      on_conflict: { constraint: chat_rooms_pkey, update_columns: name }
    ) {
      id
      name
    }
  }
`;

// ANCHOR SUBSCRIPTIONS
export const SUBSCRIPTION_CHAT_MESSAGES = gql`
  subscription SubscriptionChatMessages($roomId: uuid!) {
    chat_messages(where: { roomId: { _eq: $roomId } }) {
      id
      message
      createdAt: created_at
      fromUser: user {
        displayName
        photoUrl
        id
        userHandle
        username
      }
      toUser: userByTouserid {
        displayName
        photoUrl
        id
        userHandle
        username
      }
    }
  }
`;
