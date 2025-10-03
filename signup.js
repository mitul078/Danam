// Signup Page JavaScript Functionality

// DOM Elements
const signupForm = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const signupBtn = document.querySelector('.signup-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

// Initialize signup page
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupForm();
    initializeFormValidation();
    initializePasswordStrength();
    initializeAnimations();
});

// Initialize signup form
function initializeSignupForm() {
    signupForm.addEventListener('submit', handleSignupSubmission);
    
    // Real-time validation
    const inputs = signupForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    
    // Phone number formatting
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Email validation
    emailInput.addEventListener('input', validateEmail);
}

// Handle form submission
function handleSignupSubmission(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
        showMessage('Please fix the errors below before submitting.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(signupForm);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            userType: formData.get('userType'),
            interests: formData.getAll('interests'),
            newsletter: formData.get('newsletter') === 'on'
        };
        
        // Simulate successful signup
        simulateSignupSuccess(userData);
    }, 2000);
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'userType'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Clear previous errors
    clearFieldError({ target: field });
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required`);
        return false;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
            break;
            
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'password':
            if (value && !isValidPassword(value)) {
                showFieldError(field, 'Password must be at least 8 characters with uppercase, lowercase, and number');
                return false;
            }
            break;
            
        case 'confirmPassword':
            if (value && value !== passwordInput.value) {
                showFieldError(field, 'Passwords do not match');
                return false;
            }
            break;
    }
    
    // Mark field as valid
    markFieldAsValid(field);
    return true;
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
}

// Mark field as valid
function markFieldAsValid(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate password match
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        markFieldAsValid(confirmPasswordInput);
        return true;
    }
    
    return true;
}

// Validate email
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    } else if (email && isValidEmail(email)) {
        markFieldAsValid(emailInput);
        return true;
    }
    
    return true;
}

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    
    e.target.value = value;
}

// Initialize password strength indicator
function initializePasswordStrength() {
    passwordInput.addEventListener('input', updatePasswordStrength);
}

// Update password strength
function updatePasswordStrength() {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    // Remove existing strength indicator
    const existingIndicator = document.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (password.length > 0) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        for (let i = 0; i < 4; i++) {
            const bar = document.createElement('div');
            bar.className = 'strength-bar';
            
            if (i < strength.level) {
                bar.classList.add(strength.class);
            }
            
            strengthIndicator.appendChild(bar);
        }
        
        const formGroup = passwordInput.closest('.form-group');
        formGroup.appendChild(strengthIndicator);
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) {
        return { level: 1, class: 'weak' };
    } else if (score < 4) {
        return { level: 2, class: 'medium' };
    } else {
        return { level: 3, class: 'strong' };
    }
}

// Show loading state
function showLoadingState() {
    signupBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
}

// Hide loading state
function hideLoadingState() {
    signupBtn.disabled = false;
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
}

// Simulate successful signup
function simulateSignupSuccess(userData) {
    hideLoadingState();
    
    // Show success message
    showMessage('Account created successfully! Welcome to DoNation!', 'success');
    
    // Add success animation to button
    signupBtn.classList.add('success');
    
    // Redirect to home page after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}-message`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Insert message at the top of the form
    const form = document.querySelector('.signup-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Initialize form validation
function initializeFormValidation() {
    // Add validation styles to CSS
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        }
        
        .form-message.success-message {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid #10b981;
        }
        
        .form-message.error-message {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
function initializeAnimations() {
    // Animate form elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(group);
    });
}

// Utility functions
function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone Number',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        userType: 'User Type'
    };
    return labels[fieldName] || fieldName;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function isValidPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinimumLength = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinimumLength;
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.parentNode.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Handle interest checkboxes
document.addEventListener('DOMContentLoaded', function() {
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.checkbox-label');
            if (this.checked) {
                label.style.background = '#f0f9ff';
                label.style.borderColor = '#2563eb';
            } else {
                label.style.background = '';
                label.style.borderColor = '';
            }
        });
    });
});

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.signup-btn, .password-toggle');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
            const inputs = Array.from(form.querySelectorAll('input, select'));
            const currentIndex = inputs.indexOf(e.target);
            const nextInput = inputs[currentIndex + 1];
            
            if (nextInput) {
                nextInput.focus();
            } else {
                form.querySelector('button[type="submit"]').click();
            }
        }
    }
});

// Add form auto-save functionality
let formData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Load saved form data
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
        formData = JSON.parse(savedData);
        populateForm();
    }
    
    // Save form data on input
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});

function saveFormData() {
    const form = document.getElementById('signupForm');
    const formDataObj = new FormData(form);
    
    formData = {};
    for (let [key, value] of formDataObj.entries()) {
        if (formData[key]) {
            if (Array.isArray(formData[key])) {
                formData[key].push(value);
            } else {
                formData[key] = [formData[key], value];
            }
        } else {
            formData[key] = value;
        }
    }
    
    localStorage.setItem('signupFormData', JSON.stringify(formData));
}

function populateForm() {
    Object.keys(formData).forEach(key => {
        const field = document.getElementById(key) || document.querySelector(`input[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = formData[key] === 'on';
            } else {
                field.value = formData[key];
            }
        }
    });
}

// Clear saved data on successful submission
function clearSavedData() {
    localStorage.removeItem('signupFormData');
}

