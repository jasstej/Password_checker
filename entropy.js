// Debugging: Log password and character set size
export function calculateEntropy(password) {
    const length = password.length;
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26; // Lowercase letters
    if (/[A-Z]/.test(password)) charsetSize += 26; // Uppercase letters
    if (/[0-9]/.test(password)) charsetSize += 10; // Numbers
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // Special characters

    console.log(`Password: "${password}", Charset Size: ${charsetSize}`);
    return length > 0 ? Math.log2(charsetSize) * length : 0; // Entropy in bits
}

// Function to estimate brute-force cracking time
export function estimateCrackingTime(entropy) {
    const guessesPerSecond = 1e9; // Assume 1 billion guesses per second
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSecond;

    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hours`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(2)} days`;
    return `${(seconds / 31536000).toFixed(2)} years`;
}
