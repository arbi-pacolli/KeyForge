// Password Analyzer Core
console.log("ANALYZER: analyzer.js loaded");

class PasswordAnalyzer {
    constructor() {
        console.log("ANALYZER: New instance created");
        this.commonPasswords = new Set([
            'password', '123456', '12345678', 'qwerty', 'abc123',
            'password1', '12345', '123456789', 'letmein', 'welcome',
            'monkey', 'dragon', 'baseball', 'football', 'superman'
        ]);
        
        this.commonPatterns = [
            /(.)\1{2,}/, // Repeated characters (aaa)
            /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
            /(qwerty|asdfgh|zxcvbn)/i,
            /^[0-9]+$/, // Only numbers
            /^[a-z]+$/i // Only letters
        ];
    }
    
    analyze(password) {
        if (!password || password.length === 0) {
            return {
                score: 0,
                strength: 'Very Weak',
                feedback: ['Enter a password to begin analysis'],
                entropy: 0,
                length: 0
            };
        }
        
        let score = 0;
        const feedback = [];
        const length = password.length;
        
        // 1. Length scoring (0-40 points)
        const lengthScore = this.scoreLength(password);
        score += lengthScore;
        
        // 2. Character variety (0-30 points)
        const charsetScore = this.scoreCharset(password);
        score += charsetScore;
        
        // 3. Calculate entropy
        const entropy = this.calculateEntropy(password);
        
        // 4. Apply penalties
        const penalties = this.applyPenalties(password);
        score = Math.max(0, score + penalties);
        
        // 5. Normalize 70 points to 100 scale
        score = Math.min(100, Math.round((score / 70) * 100));
        
        // 6. Determine strength
        const strength = this.getStrengthLabel(score);
        
        // 7. Generate feedback
        this.generateFeedback(password, length, entropy, feedback);
        
        return {
            score,
            strength,
            feedback: feedback.slice(0, 4), // Max 4 tips
            entropy: Math.round(entropy * 10) / 10,
            length
        };
    }
    
    scoreLength(password) {
        const length = password.length;
        if (length < 8) return 0;
        if (length < 12) return 20;
        if (length < 16) return 30;
        return 40;
    }
    
    scoreCharset(password) {
        let score = 0;
        let types = 0;
        
        if (/[a-z]/.test(password)) types++;
        if (/[A-Z]/.test(password)) types++;
        if (/[0-9]/.test(password)) types++;
        if (/[^A-Za-z0-9]/.test(password)) types++;
        
        // Base points
        score += types * 5;
        
        // Bonus for mixed case
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            score += 10;
        }
        
        return Math.min(30, score);
    }
    
    calculateEntropy(password) {
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;
        
        if (charsetSize === 0) charsetSize = 26;
        
        return password.length * Math.log2(charsetSize);
    }
    
    applyPenalties(password) {
        let penalty = 0;
        const lowerPassword = password.toLowerCase();
        
        // Check for common passwords
        if (this.commonPasswords.has(lowerPassword)) {
            penalty -= 30;
        }
        
        // Check for patterns
        for (const pattern of this.commonPatterns) {
            if (pattern.test(password)) {
                penalty -= 10;
            }
        }
        
        // Check for years (1900-2025)
        if (/(19[0-9]{2}|20[0-2][0-5])/.test(password)) {
            penalty -= 15;
        }
        
        return penalty;
    }
    
    getStrengthLabel(score) {
        if (score < 20) return 'Very Weak';
        if (score < 40) return 'Weak';
        if (score < 60) return 'Fair';
        if (score < 80) return 'Strong';
        return 'Very Strong';
    }
    
    generateFeedback(password, length, entropy, feedback) {
        // Length feedback
        if (length < 8) {
            feedback.push('❌ Password is too short (min 8 characters)');
        } else if (length < 12) {
            feedback.push('✅ Good length, but 12+ characters is better');
        } else {
            feedback.push('✅ Excellent password length');
        }
        
        // Character variety feedback
        if (!/[a-z]/.test(password)) feedback.push('❌ Add lowercase letters');
        if (!/[A-Z]/.test(password)) feedback.push('❌ Add uppercase letters');
        if (!/[0-9]/.test(password)) feedback.push('❌ Add numbers');
        if (!/[^A-Za-z0-9]/.test(password)) feedback.push('❌ Add symbols (like !@#$%)');
        
        // Entropy feedback
        if (entropy < 40) {
            feedback.push(`⚠️ Low entropy (${entropy.toFixed(1)} bits)`);
        } else if (entropy < 60) {
            feedback.push(`✅ Good entropy (${entropy.toFixed(1)} bits)`);
        } else {
            feedback.push(`✅ Excellent entropy (${entropy.toFixed(1)} bits)`);
        }
    }
}

// Export for use in main app
window.PasswordAnalyzer = PasswordAnalyzer;