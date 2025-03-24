// Preloader
window.addEventListener('load', function() {
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('hidden');
    }, 800);
});

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    let userType = 'customer'; // Default user type
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update user type
            userType = this.dataset.tab;
        });
    });

    // Password visibility toggle
    window.togglePassword = function(inputId) {
        const passwordInput = document.getElementById(inputId);
        const icon = passwordInput.nextElementSibling.nextElementSibling.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // Input animation
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            } else {
                this.parentElement.classList.add('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });

    // Form validation message
    function showMessage(form, type, text) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${text}`;
        
        // Insert before the first form element
        form.insertBefore(message, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = document.getElementById('userId').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Get users from local storage based on type
            const storageKey = userType === 'customer' ? 'agriweb_customers' : 'agriweb_farmers';
            const users = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            // Find user by ID
            const user = users.find(u => u.userId === userId);
            
            if (user && user.password === password) {
                // Successful login
                showMessage(loginForm, 'success', 'Login successful! Redirecting...');
                
                // Store logged in user info
                const userData = {
                    userId: user.userId,
                    name: user.name,
                    type: userType
                };
                
                // Store in session storage
                sessionStorage.setItem('agriweb_currentUser', JSON.stringify(userData));
                
                // If remember me is checked, store in local storage
                if (rememberMe) {
                    localStorage.setItem('agriweb_rememberedUser', JSON.stringify(userData));
                } else {
                    localStorage.removeItem('agriweb_rememberedUser');
                }
                
                // Redirect to home page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = userType === 'customer' ? 'index.html.html' : 'index.html';
                }, 1500);
            } else {
                // Failed login
                showMessage(loginForm, 'error', 'Invalid user ID or password. Please try again.');
            }
        });

        // Check if user was remembered
        const rememberedUser = JSON.parse(localStorage.getItem('agriweb_rememberedUser'));
        if (rememberedUser) {
            document.getElementById('userId').value = rememberedUser.userId;
            document.getElementById('rememberMe').checked = true;
            
            // Select the appropriate tab
            const userTypeTab = document.querySelector(`.tab-btn[data-tab="${rememberedUser.type}"]`);
            if (userTypeTab) userTypeTab.click();
        }
    }

    // Sign Up Form Submit
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const userId = document.getElementById('createUserId').value;
            const password = document.getElementById('createPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAgree = document.getElementById('termsAgree').checked;
            
            // Validation
            if (!termsAgree) {
                showMessage(signupForm, 'error', 'You must agree to the Terms & Conditions.');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage(signupForm, 'error', 'Passwords do not match.');
                return;
            }
            
            if (age < 18) {
                showMessage(signupForm, 'error', 'You must be at least 18 years old to register.');
                return;
            }
            
            // Get existing users
            const storageKey = userType === 'customer' ? 'agriweb_customers' : 'agriweb_farmers';
            const users = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            // Check if user ID already exists
            if (users.some(u => u.userId === userId)) {
                showMessage(signupForm, 'error', 'User ID already exists. Please choose another.');
                return;
            }
            
            // Add new user
            users.push({
                name,
                age,
                userId,
                password,
                registrationDate: new Date().toISOString()
            });
            
            // Save to local storage
            localStorage.setItem(storageKey, JSON.stringify(users));
            
            // Show success message
            showMessage(signupForm, 'success', 'Registration successful! Redirecting to login page...');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        const verifyBtn = document.getElementById('verifyBtn');
        const resetBtn = document.getElementById('resetBtn');
        const resetPasswordFields = document.querySelectorAll('.reset-password-fields');
        
        // Account verification step
        verifyBtn.addEventListener('click', function() {
            const userId = document.getElementById('resetUserId').value;
            const name = document.getElementById('resetName').value;
            
            // Get users from local storage based on type
            const storageKey = userType === 'customer' ? 'agriweb_customers' : 'agriweb_farmers';
            const users = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            // Find user by ID and name
            const user = users.find(u => u.userId === userId && u.name === name);
            
            if (user) {
                // Show password reset fields
                resetPasswordFields.forEach(field => field.classList.remove('hidden'));
                verifyBtn.classList.add('hidden');
                resetBtn.classList.remove('hidden');
                
                // Store userId in data attribute for the reset step
                resetBtn.dataset.userId = userId;
                
                showMessage(forgotPasswordForm, 'success', 'Account verified. Please set a new password.');
            } else {
                showMessage(forgotPasswordForm, 'error', 'User ID or name not found. Please try again.');
            }
        });
        
        // Password reset step
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = resetBtn.dataset.userId;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            // Validate passwords match
            if (newPassword !== confirmNewPassword) {
                showMessage(forgotPasswordForm, 'error', 'Passwords do not match.');
                return;
            }
            
            // Get users from local storage
            const storageKey = userType === 'customer' ? 'agriweb_customers' : 'agriweb_farmers';
            const users = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            // Find user and update password
            const userIndex = users.findIndex(u => u.userId === userId);
            
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                
                // Save updated users to local storage
                localStorage.setItem(storageKey, JSON.stringify(users));
                
                showMessage(forgotPasswordForm, 'success', 'Password reset successful! Redirecting to login page...');
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(forgotPasswordForm, 'error', 'An error occurred. Please try again.');
            }
        });
    }

    // // Check if user is logged in
    // function checkLoggedInUser() {
    //     const currentUser = JSON.parse(sessionStorage.getItem('agriweb_currentUser'));
        
    //     if (currentUser) {
    //         // User is logged in, redirect to appropriate dashboard
    //         const dashboardUrl = currentUser.type === 'customer' ? 'customer-dashboard.html' : 'farmer-dashboard.html';
            
    //         // Only redirect if on login, signup, or forgot password pages
    //         if (window.location.href.includes('login.html') || 
    //             window.location.href.includes('signup.html') || 
    //             window.location.href.includes('forgot-password.html')) {
    //             window.location.href = dashboardUrl;
    //         }
    //     }
    // }

    // Logout functionality
    window.logoutUser = function() {
        // Clear session storage
        sessionStorage.removeItem('agriweb_currentUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
    };

    // Check login status on page load (except for auth pages)
    checkLoggedInUser();
});


