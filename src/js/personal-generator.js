// Personal Password Generator
console.log("PERSONAL GENERATOR: personal-generator.js loaded");

class PersonalPasswordGenerator {
    constructor() {
        this.strategies = [
            this.strategyInitialPetYear,
            this.strategyNameSymbolPet,
            this.strategyPetNumberName,
            this.strategyColorCityMix,
            this.strategyReverseMix
        ];
        
        this.symbols = '@#$%&*!?+-=';
        this.numberReplacements = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7'
        };
    }
    
    generatePersonalPassword(userInfo) {
        const { 
            name, 
            pet, 
            number, 
            year, 
            color, 
            city,
            addSymbols = true,
            addNumbers = true,
            mixCase = true
        } = userInfo;
        
        // Validate at least some info provided
        const filledFields = [name, pet, number, year, color, city].filter(f => f && f.toString().trim()).length;
        if (filledFields < 2) {
            throw new Error('Please fill at least 2 fields for a good password');
        }
        
        // Pick random strategy
        const strategyIndex = Math.floor(Math.random() * this.strategies.length);
        let password = this.strategies[strategyIndex].call(this, userInfo);
        
        // Apply transformations
        if (addNumbers) {
            password = this.addNumbers(password);
        }
        
        if (addSymbols) {
            password = this.addSymbols(password);
        }
        
        if (mixCase) {
            password = this.mixCase(password);
        }
        
        // Ensure minimum length
        password = this.ensureLength(password, 12);
        
        return password;
    }
    
    // Strategy 1: Initial + Pet + Year
    strategyInitialPetYear({ name, pet, year }) {
        const initial = name ? name.charAt(0) : 'U';
        const petPart = pet || 'Pet';
        const yearPart = year ? year.toString().slice(-2) : '24';
        
        return initial + petPart + yearPart;
    }
    
    // Strategy 2: Name + Symbol + Pet
    strategyNameSymbolPet({ name, pet }) {
        const namePart = name || 'User';
        const petPart = pet || 'Friend';
        
        return namePart + '@' + petPart;
    }
    
    // Strategy 3: Pet + Number + Name
    strategyPetNumberName({ pet, number, name }) {
        const petPart = pet || 'Companion';
        const numPart = number ? number.toString() : '99';
        const namePart = name ? name.slice(0, 3) : 'Usr';
        
        return petPart + numPart + namePart;
    }
    
    // Strategy 4: Color + City Mix
    strategyColorCityMix({ color, city, year }) {
        const colorPart = color || 'Color';
        const cityPart = city || 'City';
        const yearPart = year ? year.toString() : '2024';
        
        return cityPart + colorPart + yearPart.slice(-2);
    }
    
    // Strategy 5: Reverse Mix
    strategyReverseMix({ name, pet, number }) {
        const namePart = name ? this.reverseString(name.slice(0, 4)) : 'resU';
        const petPart = pet ? pet.slice(0, 3) : 'Pet';
        const numPart = number ? number.toString() : '123';
        
        return petPart + numPart + namePart;
    }
    
    // Helper methods
    addNumbers(password) {
        // Add number at random position or replace letters with numbers
        if (Math.random() > 0.5) {
            // Add number at end
            return password + Math.floor(Math.random() * 90 + 10);
        } else {
            // Replace some letters with numbers
            let newPassword = '';
            for (let char of password) {
                if (Math.random() > 0.7 && this.numberReplacements[char.toLowerCase()]) {
                    newPassword += this.numberReplacements[char.toLowerCase()];
                } else {
                    newPassword += char;
                }
            }
            return newPassword;
        }
    }
    
    addSymbols(password) {
        // Add symbol at random position
        const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        const position = Math.floor(Math.random() * (password.length + 1));
        
        return password.slice(0, position) + symbol + password.slice(position);
    }
    
    mixCase(password) {
        // Randomly mix case
        let result = '';
        for (let char of password) {
            if (Math.random() > 0.5 && /[a-zA-Z]/.test(char)) {
                result += Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
            } else {
                result += char;
            }
        }
        return result;
    }
    
    ensureLength(password, minLength) {
        if (password.length >= minLength) return password;
        
        // Add filler if too short
        const filler = '!@#$%1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (password.length < minLength) {
            const randomChar = filler[Math.floor(Math.random() * filler.length)];
            password += randomChar;
        }
        
        return password;
    }
    
    reverseString(str) {
        return str.split('').reverse().join('');
    }
    
    calculateMemorability(password, userInfo) {
        // Simple memorability score based on user info presence
        let score = 0;
        const { name, pet, number, year, color, city } = userInfo;
        
        // Check if password contains user info
        const userValues = [name, pet, number?.toString(), year?.toString(), color, city]
            .filter(v => v && v.toString().trim())
            .map(v => v.toString().toLowerCase());
        
        userValues.forEach(value => {
            if (password.toLowerCase().includes(value.toLowerCase())) {
                score += 20;
            }
        });
        
        // Length bonus
        if (password.length <= 15) score += 10;
        
        // Determine memorability level
        if (score >= 60) return 'Very Easy';
        if (score >= 40) return 'Easy';
        if (score >= 20) return 'Moderate';
        return 'Hard';
    }
}

// Export for use in main app
window.PersonalPasswordGenerator = PersonalPasswordGenerator;