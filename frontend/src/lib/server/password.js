import { hash, verify } from '@node-rs/argon2';

// 统一的密码加密配置
const ARGON2_CONFIG = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
};

/**
 * 加密密码
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 加密后的密码哈希
 */
export async function hashPassword(password) {
    return await hash(password, ARGON2_CONFIG);
}

/**
 * 验证密码
 * @param {string} hashedPassword - 数据库中的密码哈希
 * @param {string} plainPassword - 用户输入的明文密码
 * @returns {Promise<boolean>} 密码是否正确
 */
export async function verifyPassword(hashedPassword, plainPassword) {
    return await verify(hashedPassword, plainPassword, ARGON2_CONFIG);
}

/**
 * 验证密码格式
 * @param {string} password 
 * @returns {boolean}
 */
export function validatePassword(password) {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

/**
 * 验证用户名格式
 * @param {string} username 
 * @returns {boolean}
 */
export function validateUsername(username) {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 31 &&
        /^[a-z0-9_-]+$/.test(username)
    );
} 