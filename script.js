import { generateSHA256Hash, generateMD5Hash } from './hashing.js';
import { calculateEntropy, estimateCrackingTime } from './entropy.js';
import { validatePassword, getImprovementSuggestions, isBannedPassword } from './validation.js';
import { generatePassword, copyToClipboard } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Ensure DOM is fully loaded before adding event listeners
    const passwordInput = document.getElementById('password');
    const sha256HashElement = document.getElementById('sha256-hash');
    const md5HashElement = document.getElementById('md5-hash');
    const entropyElement = document.getElementById('entropy');
    const crackingTimeElement = document.getElementById('cracking-time');
    const feedbackElement = document.getElementById('password-feedback');
    const improvementSuggestionsElement = document.getElementById('improvement-suggestions');
    const bannedWarningElement = document.getElementById('banned-warning');
    const strengthMeter = document.getElementById('strength-meter');

    if (!passwordInput || !sha256HashElement || !md5HashElement || !entropyElement || !crackingTimeElement || !feedbackElement || !improvementSuggestionsElement || !bannedWarningElement || !strengthMeter) {
        console.error('One or more DOM elements are missing. Please check the HTML structure.');
        return;
    }

    passwordInput.addEventListener('input', async (event) => {
        const password = event.target.value;

        try {
            // Update SHA-256 hash
            const sha256Hash = password ? await generateSHA256Hash(password) : 'N/A';
            sha256HashElement.textContent = sha256Hash;

            // Update MD5 hash
            const md5Hash = password ? generateMD5Hash(password) : 'N/A';
            md5HashElement.textContent = md5Hash;

            // Calculate entropy and estimate cracking time
            const entropy = calculateEntropy(password);
            const crackingTime = entropy > 0 ? estimateCrackingTime(entropy) : 'N/A';

            // Display results
            entropyElement.textContent = entropy.toFixed(2) + ' bits';
            crackingTimeElement.textContent = crackingTime;

            // Validate password and display feedback
            const validationResults = validatePassword(password);
            feedbackElement.innerHTML = validationResults
                .map(result => result.met
                    ? `<li style="color: green;">✅ ${result.message}</li>`
                    : `<li style="color: red;">❌ ${result.message}</li>`)
                .join('');

            // Change overall feedback color to green if all requirements are met
            const allMet = validationResults.every(result => result.met);
            feedbackElement.style.color = allMet ? 'green' : 'red';

            // Update strength meter
            const strength = calculateEntropy(password) / 128; // Normalize to a 0-1 scale
            strengthMeter.value = Math.min(strength, 1); // Cap at 1

            // Display improvement suggestions
            const suggestions = getImprovementSuggestions(password);
            improvementSuggestionsElement.innerHTML = suggestions
                .map(suggestion => `<li>${suggestion}</li>`)
                .join('');

            // Check for banned passwords
            const banned = await isBannedPassword(password);
            bannedWarningElement.textContent = banned ? "This password is too common and insecure." : "";
        } catch (error) {
            console.error('Error processing password input:', error);
        }
    });

    // Password generator button
    document.getElementById('generate-password').addEventListener('click', () => {
        const generatedPassword = generatePassword();
        passwordInput.value = generatedPassword;
        passwordInput.dispatchEvent(new Event('input'));
    });

    // Clipboard copy buttons
    document.getElementById('copy-sha256').addEventListener('click', () => {
        const text = sha256HashElement.textContent;
        copyToClipboard(text);
    });

    document.getElementById('copy-md5').addEventListener('click', () => {
        const text = md5HashElement.textContent;
        copyToClipboard(text);
    });
});
