export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
};

export type Query = {
    __typename?: 'Query';
    me: User;
    user?: Maybe<User>;
    allUsers?: Maybe<Array<Maybe<User>>>;
    search: Array<SearchResult>;
    myChats: Array<Chat>;
};


export type QueryUserArgs = {
    id: Scalars['ID'];
};


export type QuerySearchArgs = {
    term: Scalars['String'];
};

export enum Role {
    User = 'USER',
    Admin = 'ADMIN'
}

export type Node = {
    id: Scalars['ID'];
};

export type SearchResult = User | Chat | ChatMessage;

export type User = Node & {
    __typename?: 'User';
    id: Scalars['ID'];
    username: Scalars['String'];
    email: Scalars['String'];
    role: Role;
};

export type Chat = Node & {
    __typename?: 'Chat';
    id: Scalars['ID'];
    users: Array<User>;
    messages: Array<ChatMessage>;
};

export type ChatMessage = Node & {
    __typename?: 'ChatMessage';
    id: Scalars['ID'];
    content: Scalars['String'];
    time: Scalars['Date'];
    user: User;
};
