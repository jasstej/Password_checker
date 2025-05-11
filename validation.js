// Function to validate password strength
export function validatePassword(password) {
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

// Improvement suggestions
export function getImprovementSuggestions(password) {
    const suggestions = [];
    if (!/.{8,}/.test(password)) suggestions.push("Use at least 8 characters.");
    if (!/[a-z]/.test(password)) suggestions.push("Add lowercase letters.");
    if (!/[A-Z]/.test(password)) suggestions.push("Add uppercase letters.");
    if (!/[0-9]/.test(password)) suggestions.push("Include numbers.");
    if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push("Add special characters.");
    return suggestions;
}

// Common/banned password check
export async function isBannedPassword(password) {
    const bannedPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123']; // Example list
    return bannedPasswords.includes(password);
}
