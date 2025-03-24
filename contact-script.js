document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Toggle active class on FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Animate items with delay
    function animateWithDelay() {
        const animatedElements = document.querySelectorAll('[data-delay]');
        animatedElements.forEach(element => {
            const delay = element.getAttribute('data-delay');
            setTimeout(() => {
                element.style.visibility = 'visible';
            }, delay);
        });
    }
    
    // Input focus effects
    const formInputs = document.querySelectorAll('.focused-input input, .focused-input textarea, .focused-input select');
    formInputs.forEach(input => {
        // Set initial state if input has value
        if (input.value) {
            input.parentElement.classList.add('has-value');
        }
        
        // Focus event
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('has-value');
        });
        
        // Blur event
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('has-value');
            }
        });
    });

    // Handle form submission
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.querySelector('.form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (!validateForm()) {
                return false;
            }
            
            // Simulate form submission (replace with actual AJAX form submission)
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate server request
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                
                // Show success message
                setTimeout(() => {
                    if (formSuccess) {
                        formSuccess.classList.add('active');
                        
                        // Reset form after successful submission
                        contactForm.reset();
                        
                        // Reset the submit button after some time
                        setTimeout(() => {
                            submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                            submitBtn.disabled = false;
                        }, 3000);
                    }
                }, 500);
            }, 2000);
        });
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Remove any existing error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Validate Name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        }
        
        // Validate Email
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Phone
        if (!phone.value.trim()) {
            showError(phone, 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate Subject
        if (!subject.value || subject.value === "") {
            showError(subject, 'Please select a subject');
            isValid = false;
        }
        
        // Validate Message
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message is too short (min. 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        errorMessage.style.color = 'var(--error-color)';
        errorMessage.style.fontSize = '0.8rem';
        errorMessage.style.marginTop = '5px';
        formGroup.appendChild(errorMessage);
        
        input.style.borderColor = 'var(--error-color)';
        
        // Remove error on input change
        input.addEventListener('input', function() {
            if (formGroup.querySelector('.error-message')) {
                formGroup.querySelector('.error-message').remove();
                input.style.borderColor = '';
            }
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation (basic)
    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s+\-()]{10,15}$/;
        return phoneRegex.test(phone);
    }
    
    // Branch location selector
    const branchSelector = document.getElementById('branchLocation');
    if (branchSelector) {
        branchSelector.addEventListener('change', function() {
            // This would normally update the map to the selected location
            // For this example, we'll just simulate the change
            const mapIframe = document.querySelector('.map-container iframe');
            const locationValue = this.value;
            
            // Map URLs would be different for each location in a real implementation
            const mapUrls = {
                delhi: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.228006976187!2d77.19789485059001!3d28.566375182296386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1ddd9e735f8f%3A0x8fe3c52e0acef5e1!2sIndia%20Gate%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1647872612393!5m2!1sen!2sin",
                mumbai: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.4463835937296!2d72.82226861469852!3d19.045113487104818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8d80c769435%3A0x1766eee3c2b0a640!2sGateway%20Of%20India%20Mumbai!5e0!3m2!1sen!2sin!4v1647872765328!5m2!1sen!2sin",
                bangalore: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.991350140131!2d77.59620461482141!3d12.97566559085323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1673a4e127c1%3A0x999a7d72bc66255c!2sVidhana%20Soudha!5e0!3m2!1sen!2sin!4v1647872850304!5m2!1sen!2sin",
                chennai: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.7976888668124!2d80.24990631482229!3d13.059526090795787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f525e518ccf%3A0x20adca1a9ca6dce3!2sChennai%20Central!5e0!3m2!1sen!2sin!4v1647872904988!5m2!1sen!2sin",
                kolkata: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.630239832553!2d88.34286561476176!3d22.55851813790748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276e1a5598495%3A0xb2bad7e75bbe1508!2sVictoria%20Memorial!5e0!3m2!1sen!2sin!4v1647872954961!5m2!1sen!2sin"
            };
            
            // Update map source if URL exists for the selected location
            if (mapUrls[locationValue]) {
                mapIframe.src = mapUrls[locationValue];
            }
        });
    }
    
    // Scroll to top
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate__animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationClass = Array.from(entry.target.classList).find(className => 
                    className.startsWith('animate__') && className !== 'animate__animated'
                );
                
                if (animationClass) {
                    // If the element has a delay attribute, use it
                    const delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        setTimeout(() => {
                            entry.target.classList.add(animationClass + '--visible');
                        }, parseInt(delay));
                    } else {
                        entry.target.classList.add(animationClass + '--visible');
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
});