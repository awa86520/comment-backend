export const maskUsername = (username: string) => {
    return username.substring(0, 2) + '***' + username.substring(username.length - 1);
};
