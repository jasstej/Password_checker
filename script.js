// Function to generate SHA-256 hash
async function generateSHA256Hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Function to generate MD5 hash (requires external library)
function generateMD5Hash(password) {
    // Assuming CryptoJS is included for MD5 hashing
    return CryptoJS.MD5(password).toString();
}

// Debugging: Log password and character set size
function calculateEntropy(password) {
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
function estimateCrackingTime(entropy) {
    const guessesPerSecond = 1e9; // Assume 1 billion guesses per second
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSecond;

    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hours`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(2)} days`;
    return `${(seconds / 31536000).toFixed(2)} years`;
}

// Function to validate password strength
function validatePassword(password) {
    const requirements = [
        { regex: /.{8,}/, message: "At least 8 characters long" },
        { regex: /[a-z]/, message: "At least one lowercase letter" },
        { regex: /[A-Z]/, message: "At least one uppercase letter" },
        { regex: /[0-9]/, message: "At least one number" },
        { regex: /[^a-zA-Z0-9]/, message: "At least one special character" },
    ];

    return requirements.map(req => ({
        met: req.regex.test(password),
        message: req.message,
    }));
}

// Real-time password input listener
document.getElementById('password').addEventListener('input', async (event) => {
    const password = event.target.value;

    // Update SHA-256 hash
    const sha256Hash = password ? await generateSHA256Hash(password) : 'N/A';
    document.getElementById('sha256-hash').textContent = sha256Hash;

    // Update MD5 hash
    const md5Hash = password ? generateMD5Hash(password) : 'N/A';
    document.getElementById('md5-hash').textContent = md5Hash;

    // Calculate entropy and estimate cracking time
    const entropy = calculateEntropy(password);
    const crackingTime = entropy > 0 ? estimateCrackingTime(entropy) : 'N/A';

    // Display results
    document.getElementById('entropy').textContent = entropy.toFixed(2) + ' bits';
    document.getElementById('cracking-time').textContent = crackingTime;

    // Validate password and display feedback
    const validationResults = validatePassword(password);
    const feedbackElement = document.getElementById('password-feedback');
    feedbackElement.innerHTML = validationResults
        .map(result => result.met
            ? `<li style="color: green;">✅ ${result.message}</li>`
            : `<li style="color: red;">❌ ${result.message}</li>`)
        .join('');

    // Change overall feedback color to green if all requirements are met
    const allMet = validationResults.every(result => result.met);
    feedbackElement.style.color = allMet ? 'green' : 'red';
});
