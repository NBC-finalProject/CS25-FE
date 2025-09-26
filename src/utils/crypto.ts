// utils/crypto.ts
function base64ToBytes(b64: string): Uint8Array {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

function utf8ToBytes(s: string): Uint8Array {
    return new TextEncoder().encode(s);
}

async function importAesCbcKeyFromUtf8(secret: string): Promise<CryptoKey> {
    const raw = utf8ToBytes(secret);
    return crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * cipherB64 = Base64( IV(16) || CIPHERTEXT )
 */
export async function decryptAesCbcB64(cipherB64: string, secretUtf8: string): Promise<string> {
    try {
        const data = base64ToBytes(cipherB64);
        if (data.length <= 16) throw new Error("cipher too short");

        const iv = data.slice(0, 16);
        const ciphertext = data.slice(16);

        const key = await importAesCbcKeyFromUtf8(secretUtf8);
        const plainBuf = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            key,
            ciphertext
        );
        return new TextDecoder().decode(plainBuf);
    } catch (e) {
        // 복호화 실패 시 원문 반환(깨짐 방지) 또는 null
        console.error("[crypto] decrypt fail:", e);
        return cipherB64;
    }
}

/** 간단 검증: Base64 형태인지 대충 체크 */
export function looksLikeBase64(s?: string | null): boolean {
    if (!s || typeof s !== "string") return false;
    // 너무 엄격하게 하면 정답 "2" 같은 것도 걸러질 수 있어서 느슨하게
    return /^[A-Za-z0-9+/=]+$/.test(s) && s.length >= 24;
}
