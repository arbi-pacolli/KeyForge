// Main Application - Complete
console.log("APP: app.js loaded");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("APP: Initializing application...");
    
    // Initialize modules
    const analyzer = new PasswordAnalyzer();
    const generator = new PasswordGenerator();
    const personalGenerator = new PersonalPasswordGenerator();
    
    // Get DOM elements
    const elements = {
        // Analyzer elements
        passwordInput: document.getElementById('password-input'),
        toggleBtn: document.getElementById('toggle-visibility'),
        meterFill: document.getElementById('meter-fill'),
        strengthLabel: document.getElementById('strength-label'),
        scoreValue: document.getElementById('score-value'),
        feedbackList: document.getElementById('feedback-list'),
        
        // Random generator elements
        lengthSlider: document.getElementById('length-slider'),
        lengthValue: document.getElementById('length-value'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
        generateRandomBtn: document.getElementById('generate-random-btn'),
        generatedPassword: document.getElementById('generated-password'),
        copyBtn: document.getElementById('copy-btn'),
        entropyValue: document.getElementById('entropy-value'),
        combinationsValue: document.getElementById('combinations-value'),
        
        // Personal generator elements
        toggleButtons: document.querySelectorAll('.toggle-btn'),
        generatorContents: document.querySelectorAll('.generator-content'),
        generatorDescription: document.getElementById('generator-description'),
        userName: document.getElementById('user-name'),
        userPet: document.getElementById('user-pet'),
        userNumber: document.getElementById('user-number'),
        userYear: document.getElementById('user-year'),
        userColor: document.getElementById('user-color'),
        userCity: document.getElementById('user-city'),
        addSymbols: document.getElementById('add-symbols'),
        addNumbers: document.getElementById('add-numbers'),
        mixCase: document.getElementById('mix-case'),
        generatePersonalBtn: document.getElementById('generate-personal-btn'),
        personalPassword: document.getElementById('personal-password'),
        copyPersonalBtn: document.getElementById('copy-personal-btn'),
        personalEntropy: document.getElementById('personal-entropy'),
        memorabilityScore: document.getElementById('memorability-score')
    };
    
    console.log("APP: All elements loaded");
    
    // ===== PASSWORD ANALYZER =====
    
    // Toggle password visibility
    elements.toggleBtn.addEventListener('click', function() {
        if (elements.passwordInput.type === 'password') {
            elements.passwordInput.type = 'text';
            this.textContent = '🙈 Hide';
        } else {
            elements.passwordInput.type = 'password';
            this.textContent = '👁️ Show';
        }
    });
    
    // Real-time password analysis
    elements.passwordInput.addEventListener('input', function() {
        const password = this.value;
        const result = analyzer.analyze(password);
        updateAnalyzerUI(result);
    });
    
    function updateAnalyzerUI(result) {
        // Update meter
        const width = Math.max(1, result.score);
        elements.meterFill.style.width = `${width}%`;
        
        // Update color based on score
        let color;
        if (result.score < 20) color = '#e53e3e';
        else if (result.score < 40) color = '#ed8936';
        else if (result.score < 60) color = '#ecc94b';
        else if (result.score < 80) color = '#48bb78';
        else color = '#38a169';
        
        elements.meterFill.style.backgroundColor = color;
        elements.strengthLabel.textContent = result.strength;
        elements.strengthLabel.style.color = color;
        elements.scoreValue.textContent = result.score;
        
        // Update feedback
        updateFeedbackList(result.feedback);
    }
    
    function updateFeedbackList(feedbackItems) {
        elements.feedbackList.innerHTML = '';
        
        if (!feedbackItems || feedbackItems.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Enter a password to get feedback';
            elements.feedbackList.appendChild(li);
            return;
        }
        
        feedbackItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            elements.feedbackList.appendChild(li);
        });
    }
    
    // ===== RANDOM PASSWORD GENERATOR =====
    
    // Update length display when slider moves
    elements.lengthSlider.addEventListener('input', function() {
        elements.lengthValue.textContent = this.value;
    });
    
    // Generate random password button
    elements.generateRandomBtn.addEventListener('click', function() {
        generateRandomPassword();
    });
    
    function generateRandomPassword() {
        try {
            const options = {
                length: parseInt(elements.lengthSlider.value),
                uppercase: elements.uppercase.checked,
                lowercase: elements.lowercase.checked,
                numbers: elements.numbers.checked,
                symbols: elements.symbols.checked
            };
            
            // Check if at least one option is selected
            if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
                alert('Please select at least one character type!');
                return;
            }
            
            const result = generator.generatePassword(options);
            
            // Display generated password
            elements.generatedPassword.value = result.password;
            
            // Display security metrics
            elements.entropyValue.textContent = result.entropy.toFixed(1);
            elements.combinationsValue.textContent = generator.formatCombinations(result.combinations);
            
            // Auto-analyze the generated password
            elements.passwordInput.value = result.password;
            const analysis = analyzer.analyze(result.password);
            updateAnalyzerUI(analysis);
            
            console.log("APP: Generated random password");
            
        } catch (error) {
            console.error("APP: Error generating password:", error);
            alert('Error: ' + error.message);
        }
    }
    
    // Copy random password to clipboard
    elements.copyBtn.addEventListener('click', function() {
        if (!elements.generatedPassword.value) {
            alert('Generate a password first!');
            return;
        }
        
        navigator.clipboard.writeText(elements.generatedPassword.value)
            .then(() => {
                const originalText = this.textContent;
                this.textContent = '✅ Copied!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
    });
    
    // ===== PERSONAL PASSWORD GENERATOR =====
    
    // Toggle between random and personal generator
    elements.toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // Update active button
            elements.toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update description
            if (type === 'random') {
                elements.generatorDescription.textContent = 'Generate completely random, secure passwords';
            } else {
                elements.generatorDescription.textContent = 'Create memorable passwords based on your information';
            }
            
            // Show/hide content
            elements.generatorContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${type}-generator`).classList.add('active');
            
            console.log(`APP: Switched to ${type} generator`);
        });
    });
    
    // Generate personal password
    elements.generatePersonalBtn.addEventListener('click', function() {
        try {
            const userInfo = {
                name: elements.userName.value.trim(),
                pet: elements.userPet.value.trim(),
                number: elements.userNumber.value ? parseInt(elements.userNumber.value) : null,
                year: elements.userYear.value ? parseInt(elements.userYear.value) : null,
                color: elements.userColor.value.trim(),
                city: elements.userCity.value.trim(),
                addSymbols: elements.addSymbols.checked,
                addNumbers: elements.addNumbers.checked,
                mixCase: elements.mixCase.checked
            };
            
            // Generate password
            const password = personalGenerator.generatePersonalPassword(userInfo);
            elements.personalPassword.value = password;
            
            // Calculate memorability
            const memorability = personalGenerator.calculateMemorability(password, userInfo);
            elements.memorabilityScore.textContent = memorability;
            
            // Analyze the password
            const analysis = analyzer.analyze(password);
            elements.personalEntropy.textContent = analysis.entropy.toFixed(1);
            
            // Also show in analyzer section
            elements.passwordInput.value = password;
            updateAnalyzerUI(analysis);
            
            console.log("APP: Generated personal password");
            
        } catch (error) {
            console.error("APP: Error generating personal password:", error);
            alert('Error: ' + error.message);
        }
    });
    
    // Copy personal password to clipboard
    elements.copyPersonalBtn.addEventListener('click', function() {
        if (!elements.personalPassword.value) {
            alert('Generate a personal password first!');
            return;
        }
        
        navigator.clipboard.writeText(elements.personalPassword.value)
            .then(() => {
                const originalText = this.textContent;
                this.textContent = '✅ Copied!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
    });
    
    // ===== INITIAL SETUP =====
    
    // Generate initial random password
    setTimeout(() => {
        generateRandomPassword();
        
        // Show example in analyzer
        elements.passwordInput.value = 'ExampleP@ssw0rd2024!';
        elements.passwordInput.dispatchEvent(new Event('input'));
    }, 500);
    
    console.log("APP: Application initialized successfully!");
});