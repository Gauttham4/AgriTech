// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    });
    	

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) { // Adjust the scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // Product Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to current button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTestimonial = 0;
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected testimonial
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Event listeners for next and previous buttons
    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto slide testimonials
    let testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Pause auto slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    });

    // pH Level Slider
    const phSlider = document.getElementById('ph-level');
    const phValue = document.querySelector('.ph-value');
    
    if (phSlider) {
        phSlider.addEventListener('input', function() {
            phValue.textContent = this.value;
        });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add to Cart Button Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Create and show notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<i class="fas fa-check-circle"></i> ${productName} added to cart`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });

    // Form Submissions
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to your server
            console.log('Contact Form Submission:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message. We will get back to you soon!');
            
            // Reset form
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the data to your server
            console.log('Newsletter Subscription:', { email });
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        });
    }

    // Crop Recommendation
    const recommendBtn = document.querySelector('.recommend-btn');
    
    if (recommendBtn) {
        recommendBtn.addEventListener('click', function() {
            const soilType = document.getElementById('soil-type').value;
            const season = document.getElementById('season').value;
            const phLevel = document.getElementById('ph-level').value;
            
            if (!soilType || !season) {
                alert('Please select both soil type and season.');
                return;
            }
            
            // Here you would typically make an API call to get recommendations
            // For now, we'll show static recommendations
            const recommendedCrops = document.querySelector('.recommended-crops');
            recommendedCrops.style.display = 'block';
            
            // You could customize the recommendations based on selections
            const cropsList = recommendedCrops.querySelector('ul');
            cropsList.innerHTML = '';
            
            let crops = [];
            
            if (soilType === 'clay' && season === 'winter') {
                crops = ['Wheat', 'Gram', 'Mustard'];
            } else if (soilType === 'sandy' && season === 'summer') {
                crops = ['Watermelon', 'Muskmelon', 'Groundnut'];
            } else if (soilType === 'loamy') {
                crops = ['Rice', 'Maize', 'Vegetables'];
            } else {
                crops = ['Rice', 'Wheat', 'Maize'];
            }
            
            crops.forEach(crop => {
                const li = document.createElement('li');
                li.textContent = crop;
                cropsList.appendChild(li);
            });
        });
    }

    // Animation on Scroll
    function checkVisible(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (rect.top <= windowHeight * 0.75);
    }
    
    function handleScrollAnimation() {
        const elements = document.querySelectorAll('[data-aos]');
        
        elements.forEach(element => {
            if (checkVisible(element)) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    // Initial check on load
    handleScrollAnimation();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);

    // Add CSS for notifications
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification i {
            margin-right: 10px;
        }
    `;
    
    document.head.appendChild(notificationStyle);
});


document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const currentUser = JSON.parse(sessionStorage.getItem('agriweb_currentUser'));
            
            if (!currentUser) {
                // User is not logged in, show login required modal
                showLoginRequiredModal();
            } else {
                // User is logged in, show confirmation dialog
                showLogoutConfirmation();
            }
        });
    }
    
    // Function to show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Function to show login required modal
    function showLoginRequiredModal() {
        const modal = document.createElement('div');
        modal.className = 'login-required-modal';
        modal.innerHTML = `
            <div class="login-required-content">
                <div class="login-required-header">
                    <h3>Login Required</h3>
                    <button class="close-login-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="login-required-body">
                    <p>You are not currently logged in. Please log in to access this feature.</p>
                </div>
                <div class="login-required-footer">
                    <button class="cancel-login-btn">Cancel</button>
                    <button class="login-now-btn">Login Now</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-login-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('.cancel-login-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('.login-now-btn').addEventListener('click', function() {
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Function to show logout confirmation
    function showLogoutConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Logout Confirmation</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to logout?</p>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">Cancel</button>
                    <button class="confirm-btn">Logout</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('.confirm-btn').addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('agriweb_currentUser');
            
            // Show success notification
            showNotification('You have been successfully logged out.', 'success');
            
            // Remove modal
            modal.remove();
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
});