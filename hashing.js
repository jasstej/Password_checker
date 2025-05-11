// Function to generate SHA-256 hash
export async function generateSHA256Hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Function to generate MD5 hash (requires external library)
export function generateMD5Hash(password) {
    return CryptoJS.MD5(password).toString();
}
