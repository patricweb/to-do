import crypto from "crypto"

export function validateInitData(initData, botToken) {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    params.delete("hash");

    const sortedParams = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = sortedParams.map(([key, value]) => `${key}=${value}`).join("\n");

    const secretKey = crypto.createHash("sha256").update(botToken).digest();
    const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (hmac !== hash) {
        return false;
    }

    const userParam = params.get("user");
    return JSON.parse(userParam);
}