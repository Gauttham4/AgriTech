// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Preloader
    initPreloader();
    
    // Initialize AOS (Animate on Scroll)
    initAOS();
    
    // Initialize Statistics Counter
    initStatCounter();
    
    // Initialize Story Slider
    initStorySlider();
});

// Preloader Function
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

// Initialize AOS (Animate on Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }
}

// Statistics Counter Animation
function initStatCounter() {
    const statElements = document.querySelectorAll('.stat-value');
    
    if (statElements.length) {
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Function to animate the counter
        function animateCounter(element) {
            const targetValue = parseInt(element.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const frameRate = 60;
            const totalFrames = duration * frameRate / 1000;
            const increment = targetValue / totalFrames;
            let currentValue = 0;
            let counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    element.textContent = targetValue.toLocaleString();
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(currentValue).toLocaleString();
                }
            }, 1000/frameRate);
        }
        
        // Check if stats section is in view and start animation
        function checkStats() {
            statElements.forEach(element => {
                if (isInViewport(element) && !element.classList.contains('counted')) {
                    element.classList.add('counted');
                    animateCounter(element);
                }
            });
        }
        
        // Initial check and add scroll event listener
        checkStats();
        window.addEventListener('scroll', checkStats);
    }
}

// Story Slider Functionality
function initStorySlider() {
    const storyContainer = document.querySelector('.story-container');
    const stories = document.querySelectorAll('.story');
    const dots = document.querySelectorAll('.story-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (stories.length && dots.length && prevBtn && nextBtn) {
        let currentSlide = 0;
        
        // Function to update the active slide
        function updateSlide(index) {
            // Reset all slides and dots
            stories.forEach(story => story.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Set active slide and dot
            stories[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
        
        // Event listener for next button
        nextBtn.addEventListener('click', function() {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= stories.length) {
                nextSlide = 0;
            }
            updateSlide(nextSlide);
        });
        
        // Event listener for previous button
        prevBtn.addEventListener('click', function() {
            let prevSlide = currentSlide - 1;
            if (prevSlide < 0) {
                prevSlide = stories.length - 1;
            }
            updateSlide(prevSlide);
        });
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                updateSlide(index);
            });
        });
        
        // Auto slide functionality
        let slideInterval = setInterval(function() {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= stories.length) {
                nextSlide = 0;
            }
            updateSlide(nextSlide);
        }, 5000);
        
        // Pause auto slide on hover
        storyContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        // Resume auto slide on mouse leave
        storyContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(function() {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= stories.length) {
                    nextSlide = 0;
                }
                updateSlide(nextSlide);
            }, 5000);
        });
    }
}

// Text animation for hero section
document.addEventListener('DOMContentLoaded', function() {
    const animateText = document.querySelectorAll('.animate-text');
    
    animateText.forEach(element => {
        element.classList.add('visible');
    });
});