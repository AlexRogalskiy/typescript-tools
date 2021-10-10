import './dotenv'

export const PORT = process.env.PORT || process.env.BACKEND_PORT || 8080;
export const IP = process.env.IP || '0.0.0.0';
export const LOG_LEVEL = process.env.FASTIFY_LOG_LEVEL || process.env.LOG_LEVEL || 'info';
export const DEV_MODE = process.env.APP_ENV === 'development';
export const APP_ENV = process.env.APP_ENV;

export const yamlRegExp = /\.ya?ml$/;
export const mdRegExp = /\.md$/;

/**
 * Generates a random 75 char long string of alphanumeric characters
 */
export function generateSecretValue(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}
