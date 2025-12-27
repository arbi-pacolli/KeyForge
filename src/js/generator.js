// Random Password Generator
console.log("GENERATOR: generator.js loaded");

class PasswordGenerator {
    constructor() {
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        console.log("GENERATOR: Initialized with character sets");
    }
    
    // Generate secure random password using Web Crypto API
    generatePassword(options) {
        const {
            length = 12,
            uppercase = true,
            lowercase = true,
            numbers = true,
            symbols = true
        } = options;
        
        // Build character pool based on selected options
        let charPool = '';
        const selectedSets = [];
        
        if (uppercase) {
            charPool += this.charSets.uppercase;
            selectedSets.push(this.charSets.uppercase);
        }
        if (lowercase) {
            charPool += this.charSets.lowercase;
            selectedSets.push(this.charSets.lowercase);
        }
        if (numbers) {
            charPool += this.charSets.numbers;
            selectedSets.push(this.charSets.numbers);
        }
        if (symbols) {
            charPool += this.charSets.symbols;
            selectedSets.push(this.charSets.symbols);
        }
        
        // Check if at least one character set is selected
        if (charPool.length === 0) {
            throw new Error('Please select at least one character type');
        }
        
        // Generate cryptographically secure random password
        const passwordArray = new Uint32Array(length);
        window.crypto.getRandomValues(passwordArray);
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charPool[passwordArray[i] % charPool.length];
        }
        
        // Ensure at least one character from each selected set is included
        password = this.ensureCharacterVariety(password, selectedSets, charPool);
        
        // Calculate security metrics
        const charsetSize = charPool.length;
        const entropy = this.calculateEntropy(length, charsetSize);
        const combinations = this.calculateCombinations(length, charsetSize);
        
        return {
            password,
            entropy,
            combinations,
            charsetSize,
            length
        };
    }
    
    // Ensure at least one character from each selected set
    ensureCharacterVariety(password, selectedSets, charPool) {
        const passwordArray = password.split('');
        const hasCharacters = selectedSets.map(set => {
            return passwordArray.some(char => set.includes(char));
        });
        
        // If all character types are already present, return as is
        if (hasCharacters.every(has => has)) {
            return password;
        }
        
        // Replace some positions to ensure variety
        const secureRandom = new Uint32Array(selectedSets.length);
        window.crypto.getRandomValues(secureRandom);
        
        selectedSets.forEach((set, index) => {
            if (!hasCharacters[index]) {
                // Pick a random position to replace
                const position = secureRandom[index] % password.length;
                // Pick a random character from the missing set
                const charIndex = secureRandom[(index + 1) % secureRandom.length] % set.length;
                passwordArray[position] = set[charIndex];
            }
        });
        
        return passwordArray.join('');
    }
    
    calculateEntropy(length, charsetSize) {
        return length * Math.log2(charsetSize);
    }
    
    calculateCombinations(length, charsetSize) {
        return Math.pow(charsetSize, length);
    }
    
    formatCombinations(number) {
        if (number >= 1e12) return (number / 1e12).toFixed(2) + ' trillion';
        if (number >= 1e9) return (number / 1e9).toFixed(2) + ' billion';
        if (number >= 1e6) return (number / 1e6).toFixed(2) + ' million';
        if (number >= 1e3) return (number / 1e3).toFixed(2) + ' thousand';
        return number.toString();
    }
}

// Export for use in main app
window.PasswordGenerator = PasswordGenerator;