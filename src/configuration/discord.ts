import { Message, User, Client, MessageReaction } from "discord.js";

type CommonArgs = {
    bot: Client;
};

export type HandleMessageArgs = CommonArgs & {
    msg: Message;
};

export type HandleReactionArgs = CommonArgs & {
    reaction: MessageReaction;
    user: User;
};

export type ChannelHandlers = {
    handleMessage?: (obj: HandleMessageArgs) => void;
    handleReaction?: (obj: HandleReactionArgs) => void;
};
