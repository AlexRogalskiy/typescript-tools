import * as rm from 'typed-rest-client/RestClient'

import WebSocket from 'ws'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { Callback } from '../../typings/function-types'

import { Networks } from './networks'

export namespace NetworkClients {
    import getQueryParams = Networks.getQueryParams

    export type RestClientSettings = {
        url: string
    }

    export enum RESTEndpoints {
        QUOTES = 'quotes',
        CONVERT = 'convert',
        MARKET_STATUS = 'market_status',
        SYMBOLS = 'symbols',
        QUOTA = 'quota',
    }

    export type Quota = {
        quota_used: number
        quota_limit: number
        quota_remaining: number
        hours_until_reset: number
    }

    const defaultRestClientSettings: RestClientSettings = {
        url: 'https://api.1forge.com/',
    }

    export class AxiosRestClient {
        private readonly axios: AxiosInstance

        static response(data: any): Response {
            return new Response(data)
        }

        private readonly baseConfig: AxiosRequestConfig = {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        }

        constructor(config?: AxiosRequestConfig) {
            this.axios = axios.create(Object.assign(this.baseConfig, config))
        }

        async getUser<R>(userId: string, headers?: string[]): Promise<R> {
            return await this.axios.get(`/api/users/profile/${userId}`, {
                headers: { ...headers },
            })
        }

        async followUser<R>(followId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/users/follow',
                { followId },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async unfollowUser<R>(followId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/users/unfollow',
                { followId },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async deleteUser<R>(authUserId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.delete(`/api/users/${authUserId}`, {
                headers: { ...headers },
            })

            return data
        }

        async getAuthUser<R>(authUserId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.get(`/api/users/${authUserId}`, {
                headers: { ...headers },
            })

            return data
        }

        async updateUser<R>(authUserId: string, userData: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(`/api/users/${authUserId}`, userData, {
                headers: { ...headers },
            })

            return data
        }

        async getUserFeed<R>(authUserId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.get(`/api/users/feed/${authUserId}`, {
                headers: { ...headers },
            })

            return data
        }

        async addPost<R>(authUserId: string, post: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.post(`/api/posts/new/${authUserId}`, post, {
                headers: { ...headers },
            })

            return data
        }

        async getPostFeed<R>(authUserId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.get(`/api/posts/feed/${authUserId}`, {
                headers: { ...headers },
            })

            return data
        }

        async deletePost<R>(postId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.delete(`/api/posts/${postId}`, {
                headers: { ...headers },
            })

            return data
        }

        async likePost<R>(postId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/posts/like',
                { postId },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async unlikePost<R>(postId: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/posts/unlike',
                { postId },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async addComment<R>(postId: string, comment: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/posts/comment',
                {
                    postId,
                    comment,
                },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async deleteComment<R>(postId: string, comment: string, headers?: string[]): Promise<R> {
            const { data } = await this.axios.put(
                '/api/posts/uncomment',
                {
                    postId,
                    comment,
                },
                {
                    headers: { ...headers },
                },
            )

            return data
        }

        async get(url: string, config?: any): Promise<any> {
            return await this.axios.get(url, config)
        }

        async post(url: string, data: any, config?: any): Promise<any> {
            return await this.axios.post(url, data, config)
        }

        async patch(url: string, data: any, config?: any): Promise<any> {
            return await this.axios.patch(url, data, config)
        }

        async delete(url: string, config?: any): Promise<any> {
            return await this.axios.delete(url, config)
        }

        async getPostsByUser<R>(userId: string, headers?: string[]): Promise<R> {
            const { data } = await this.get(`/api/posts/by/${userId}`, {
                headers: { ...headers },
            })

            return data
        }
    }

    export class Response {
        private readonly code: number
        private readonly data: any

        constructor(response: AxiosResponse) {
            this.code = response.status
            this.data = response.data
        }

        getCode(): number {
            return this.code
        }

        getData(): any {
            return this.data
        }
    }

    export class RestClient {
        private fetch: rm.RestClient

        constructor(private readonly apiKey: string, private readonly settings?: RestClientSettings) {
            if (!this.settings) {
                this.settings = defaultRestClientSettings
            }

            this.fetch = new rm.RestClient(this.settings?.url)
        }

        async getQuotes<T>(symbols: string[] | string): Promise<T[]> {
            const pairs = Array.isArray(symbols) ? symbols.join(',') : symbols
            return this.get<T[]>(RESTEndpoints.QUOTES, { pairs })
        }

        async getSymbols(): Promise<string[]> {
            return this.get<string[]>(RESTEndpoints.SYMBOLS)
        }

        async getMarketStatus<T>(): Promise<T> {
            return this.get<T>(RESTEndpoints.MARKET_STATUS)
        }

        async getQuota(): Promise<Quota> {
            return this.get<Quota>(RESTEndpoints.QUOTA)
        }

        async convert<T>(from: string, to: string, quantity: number): Promise<T> {
            return this.get(RESTEndpoints.CONVERT, { from, to, quantity })
        }

        private async get<Type>(uri: string, parameters?: {}): Promise<Type> {
            const formattedParameters = getQueryParams({
                ...parameters,
                api_key: this.apiKey,
            })

            const response = await this.fetch.get<Type>(`${this.settings?.url}${uri}${formattedParameters}`)
            return response.result as Type
        }
    }
}

export namespace WebSocketClients {
    const url = 'wss://sockets.1forge.com/socket'

    export enum IncomingEvents {
        MESSAGE = 'message',
        FORCE_CLOSE = 'force_close',
        HEART = 'heart',
        LOGIN = 'login',
        POST_LOGIN_SUCCESS = 'post_login_success',
        UPDATE = 'update',
    }

    export enum OutgoingEvents {
        LOGIN = 'login',
        SUBSCRIBE_TO = 'subscribe_to',
        UNSUBSCRIBE_FROM = 'unsubscribe_from',
        SUBSCRIBE_TO_ALL = 'subscribe_to_all',
        UNSUBSCRIBE_FROM_ALL = 'unsubscribe_from_all',
    }

    export enum IOEvents {
        DISCONNECT = 'close',
        CONNECTION = 'open',
    }

    export class SocketClient {
        private socket: WebSocket
        private onConnectionCallback?: Callback
        private onMessageCallback?: Callback
        private onUpdateCallback?: Callback
        private onDisconnectCallback?: Callback

        constructor(private readonly apiKey: string) {
            // empty constructor
        }

        onMessage(onMessage: Callback): this {
            this.onMessageCallback = onMessage
            return this
        }

        onUpdate(onUpdate: Callback): this {
            this.onUpdateCallback = onUpdate
            return this
        }

        onConnect(onConnect: Callback): this {
            this.onConnectionCallback = onConnect
            return this
        }

        onDisconnect(onDisconnect: Callback): this {
            this.onDisconnectCallback = onDisconnect
            return this
        }

        subscribeTo(symbols: string[] | string): this {
            if (Array.isArray(symbols)) {
                for (const el of symbols) {
                    this.subscribeTo(el)
                }
                return this
            }

            this.emit(OutgoingEvents.SUBSCRIBE_TO, symbols)
            return this
        }

        subscribeToAll(): this {
            this.emit(OutgoingEvents.SUBSCRIBE_TO_ALL)
            return this
        }

        unsubscribeFrom(symbols: string[] | string): this {
            if (Array.isArray(symbols)) {
                for (const el of symbols) {
                    this.unsubscribeFrom(el)
                }
            }

            this.emit(OutgoingEvents.UNSUBSCRIBE_FROM, symbols)
            return this
        }

        unsubscribeFromAll(): this {
            this.emit(OutgoingEvents.UNSUBSCRIBE_FROM_ALL)
            return this
        }

        private disconnect(): this {
            if (this.socket) {
                this.socket.close()
                this.socket = undefined
            }
            return this
        }

        connect(): void {
            this.initializeSocketClient()
        }

        initializeSocketClient(): void {
            this.socket = new WebSocket(url)
            this.socket.on('close', this.handleDisconnect)
            this.socket.on('error', this.disconnect)
            this.socket.on('message', this.handleMessage)
            this.socket.on('open', this.handleOpen)
        }

        private handleLoginRequest = (): void => {
            this.emit(OutgoingEvents.LOGIN, this.apiKey)
        }

        private handleOpen = (): void => {
            this.emit(OutgoingEvents.LOGIN, this.apiKey)
        }

        private handlePostLoginSuccess = (): void => {
            if (!this.onConnectionCallback) {
                return
            }

            this.onConnectionCallback(this)
        }

        private handleMessage = (message: string): void => {
            const action = message.split('|')[0]
            const body = message.split('|').slice(1).join('|')
            if (action === IncomingEvents.LOGIN) {
                this.handleLoginRequest()
                return
            } else if (action === IncomingEvents.POST_LOGIN_SUCCESS) {
                this.handlePostLoginSuccess()
                return
            } else if (action === IncomingEvents.UPDATE) {
                this.handleUpdate(JSON.parse(body))
                return
            } else if (action === IncomingEvents.FORCE_CLOSE) {
                this.handleDisconnect()
                return
            } else if (action === IncomingEvents.HEART) {
                this.handleHeart()
                return
            }

            if (!this.onMessageCallback) {
                return
            }

            this.onMessageCallback(body)
        }

        private handleUpdate = <T>(data: T): void => {
            if (!this.onUpdateCallback) {
                return
            }

            this.onUpdateCallback(data, data)
        }

        private handleHeart = (): void => {
            this.emit('beat')
        }

        private handleDisconnect = (): void => {
            if (!this.onDisconnectCallback) {
                return
            }
            this.onDisconnectCallback()
        }

        private emit = (action: string, message?: any): void => {
            if (message == null) {
                this.socket.send(action)
            } else {
                this.socket.send(`${action}|${message}`)
            }
        }
    }
}
