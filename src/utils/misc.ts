export function getNewId() {
    return Date.now().toString(36) + "_" + Math.random().toString(36).substring(2);
}
