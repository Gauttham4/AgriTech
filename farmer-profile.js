// Farmer Profile Management System
document.addEventListener('DOMContentLoaded', function() {
    // Hide the page content initially
    document.body.style.visibility = 'hidden';
    
    // Only show the preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.visibility = 'visible';
    }
    
    // Check if user is already verified as a farmer
    const isVerified = sessionStorage.getItem('farmerVerified');
    
    if (isVerified === 'true') {
        // User is already verified in this session
        showPage();
    } else {
        // Perform verification
        verifyFarmer();
    }
    
    // Tab switching functionality
    setupTabs();
    
    // Product management functionality
    setupProductManagement();
    
    // Setup logout functionality
    setupLogout();
    
    // Scroll to top button
    setupScrollToTop();
    
    function verifyFarmer() {
        // Create verification overlay
        const overlay = document.createElement('div');
        overlay.className = 'verification-overlay';
        
        const verificationBox = document.createElement('div');
        verificationBox.className = 'verification-box';
        
        // Create verification content
        verificationBox.innerHTML = `
            <h2>Farmer Verification Required</h2>
            <p>Please enter your User ID to verify you are a registered farmer.</p>
            <div class="verification-form">
                <input type="text" id="farmer-id-input" placeholder="Enter your User ID">
                <button id="verify-button">Verify</button>
            </div>
            <div id="verification-message"></div>
        `;
        
        overlay.appendChild(verificationBox);
        document.body.appendChild(overlay);
        
        // Style the overlay
        const style = document.createElement('style');
        style.textContent = `
            .verification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
                visibility: visible;
            }
            
            .verification-box {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                text-align: center;
            }
            
            .verification-box h2 {
                color: #4CAF50;
                margin-bottom: 15px;
            }
            
            .verification-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin: 20px 0;
            }
            
            #farmer-id-input {
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            
            #verify-button {
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            #verify-button:hover {
                background-color: #388E3C;
            }
            
            #verification-message {
                margin-top: 15px;
                font-weight: bold;
            }
            
            .error-message {
                color: #f44336;
            }
            
            .success-message {
                color: #4CAF50;
            }
        `;
        
        document.head.appendChild(style);
        
        // Add event listener to verification button
        const verifyButton = document.getElementById('verify-button');
        const idInput = document.getElementById('farmer-id-input');
        const messageDiv = document.getElementById('verification-message');
        
        verifyButton.addEventListener('click', function() {
            const userId = idInput.value.trim();
            
            if (!userId) {
                messageDiv.textContent = 'Please enter your User ID';
                messageDiv.className = 'error-message';
                return;
            }
            
            // Check local storage for user details using the structure from your first paste
            const rememberedUserData = localStorage.getItem('agriweb_rememberedUser');
            const farmersData = localStorage.getItem('agriweb_farmers');
            
            if (!rememberedUserData || !farmersData) {
                messageDiv.textContent = 'User data not found. Please log in again.';
                messageDiv.className = 'error-message';
                return;
            }
            
            try {
                const rememberedUser = JSON.parse(rememberedUserData);
                const farmers = JSON.parse(farmersData);
                
                // Find the farmer with the matching user ID
                const farmer = farmers.find(f => f.userId === userId);
                
                if (farmer && rememberedUser.type === 'farmer') {
                    // Store verification status in session storage
                    sessionStorage.setItem('farmerVerified', 'true');
                    sessionStorage.setItem('currentUserId', userId);
                    
                    messageDiv.textContent = 'Verification successful! Redirecting to farmer dashboard...';
                    messageDiv.className = 'success-message';
                    
                    // Show success and remove overlay after a short delay
                    setTimeout(function() {
                        overlay.remove();
                        showPage();
                    }, 1500);
                } else {
                    messageDiv.textContent = 'Verification failed. You are not registered as a farmer.';
                    messageDiv.className = 'error-message';
                    
                    // Add a "Go Back" button
                    const goBackButton = document.createElement('button');
                    goBackButton.textContent = 'Go Back to Home';
                    goBackButton.style.marginTop = '15px';
                    goBackButton.style.padding = '10px';
                    goBackButton.style.backgroundColor = '#f44336';
                    goBackButton.style.color = 'white';
                    goBackButton.style.border = 'none';
                    goBackButton.style.borderRadius = '5px';
                    goBackButton.style.cursor = 'pointer';
                    
                    goBackButton.addEventListener('click', function() {
                        window.location.href = 'wt.html';
                    });
                    
                    verificationBox.appendChild(goBackButton);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.className = 'error-message';
            }
        });
        
        // Allow pressing Enter to submit
        idInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyButton.click();
            }
        });
        
        // Focus on the input field
        idInput.focus();
    }
    
    function showPage() {
        // Hide preloader and show the rest of the page
        if (preloader) {
            preloader.style.display = 'none';
        }
        document.body.style.visibility = 'visible';
        
        // Load farmer-specific data
        const currentUserId = sessionStorage.getItem('currentUserId');
        if (currentUserId) {
            loadFarmerData(currentUserId);
            loadProductsData(currentUserId);
        }
    }
    
    function loadFarmerData(userId) {
        // Get farmers from local storage
        const farmersData = localStorage.getItem('agriweb_farmers');
        const currentUserData = localStorage.getItem('currentUser');
        
        if (!farmersData) {
            console.error('Farmers data not found');
            showNotification('Error loading farmer data', 'error');
            return;
        }
        
        try {
            const farmers = JSON.parse(farmersData);
            const farmer = farmers.find(f => f.userId === userId);
            
            // If farmer profile data exists, populate the basic fields
            if (farmer) {
                // Update display name
                const farmerDisplayName = document.getElementById('farmer-display-name');
                if (farmerDisplayName) {
                    farmerDisplayName.textContent = farmer.name || 'Farmer';
                }
                
                // Populate basic profile info if available
                if (farmer.name) {
                    const farmerNameElement = document.getElementById('farmer-name');
                    if (farmerNameElement) {
                        farmerNameElement.value = farmer.name;
                    }
                }
                
                // Populate age if available
                if (farmer.age) {
                    const farmerAgeElement = document.getElementById('farmer-age');
                    if (farmerAgeElement) {
                        farmerAgeElement.value = farmer.age;
                    }
                }
                
                // Load registration date if available
                if (farmer.registrationDate) {
                    const registrationDateElement = document.getElementById('registration-date');
                    if (registrationDateElement) {
                        const date = new Date(farmer.registrationDate);
                        registrationDateElement.textContent = date.toLocaleDateString();
                    }
                } else {
                    // Set a default registration date if not available
                    const registrationDateElement = document.getElementById('registration-date');
                    if (registrationDateElement) {
                        registrationDateElement.textContent = new Date().toLocaleDateString();
                    }
                }
                
                // Now try to load additional profile data from currentUser
                if (currentUserData) {
                    try {
                        const profileData = JSON.parse(currentUserData);
                        
                        // Load profile image if available
                        if (profileData.profileImage) {
                            const profileImageElement = document.getElementById('farmer-profile-image');
                            if (profileImageElement) {
                                profileImageElement.src = profileData.profileImage;
                            }
                        }
                        
                        // Load bio if available
                        if (profileData.bio) {
                            const bioElement = document.getElementById('farmer-bio');
                            if (bioElement) {
                                bioElement.value = profileData.bio;
                            }
                        }
                        
                        // Load specialties if available
                        if (profileData.specialties && Array.isArray(profileData.specialties)) {
                            profileData.specialties.forEach(specialty => {
                                addSpecialtyTag(specialty);
                            });
                        }
                        
                        // Load contact information
                        if (profileData.email) {
                            const emailElement = document.getElementById('farmer-email');
                            if (emailElement) {
                                emailElement.value = profileData.email;
                            }
                        }
                        
                        if (profileData.phone) {
                            const phoneElement = document.getElementById('farmer-phone');
                            if (phoneElement) {
                                phoneElement.value = profileData.phone;
                            }
                        }
                        
                        if (profileData.location) {
                            const locationElement = document.getElementById('location-input');
                            const locationDisplay = document.getElementById('farmer-location');
                            
                            if (locationElement) {
                                locationElement.value = profileData.location;
                            }
                            
                            if (locationDisplay) {
                                locationDisplay.textContent = profileData.location;
                            }
                        }
                        
                        if (profileData.whatsapp) {
                            const whatsappElement = document.getElementById('whatsapp-number');
                            if (whatsappElement) {
                                whatsappElement.value = profileData.whatsapp;
                            }
                        }
                        
                        // Load farming experience
                        if (profileData.experience) {
                            const experienceElement = document.getElementById('farming-experience');
                            if (experienceElement) {
                                experienceElement.value = profileData.experience;
                            }
                        }
                        
                        // Load farm size
                        if (profileData.farmSize) {
                            const farmSizeElement = document.getElementById('farm-size');
                            if (farmSizeElement) {
                                farmSizeElement.value = profileData.farmSize;
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing profile data:', error);
                    }
                }
            } else {
                console.error('Farmer not found with ID:', userId);
                showNotification('Error: Farmer profile not found', 'error');
            }
        } catch (error) {
            console.error('Error parsing farmers data:', error);
            showNotification('Error loading profile data', 'error');
        }
    }
    
    // Function to add a specialty tag to the UI
    function addSpecialtyTag(specialty) {
        const specialtyTags = document.getElementById('specialty-tags');
        if (!specialtyTags) return;
        
        // Check if the tag already exists
        const existingTags = Array.from(specialtyTags.querySelectorAll('.specialty-tag'))
            .map(tag => tag.textContent.trim().replace(' ×', ''));
            
        if (existingTags.includes(specialty)) return;
        
        const tag = document.createElement('span');
        tag.className = 'specialty-tag';
        tag.innerHTML = `${specialty} <i class="fas fa-times remove-tag"></i>`;
        specialtyTags.appendChild(tag);
        
        // Add event listener to remove tag
        tag.querySelector('.remove-tag').addEventListener('click', function() {
            tag.remove();
            saveSpecialties();
        });
    }
    
    // Function to save specialties to local storage
    function saveSpecialties() {
        const userId = sessionStorage.getItem('currentUserId');
        if (!userId) return;
        
        const specialtyTags = document.getElementById('specialty-tags');
        if (!specialtyTags) return;
        
        const specialties = Array.from(specialtyTags.querySelectorAll('.specialty-tag'))
            .map(tag => tag.textContent.trim().replace(' ×', ''));
        
        // Get current user data
        const currentUserData = localStorage.getItem('currentUser');
        
        if (currentUserData) {
            try {
                const userData = JSON.parse(currentUserData);
                userData.specialties = specialties;
                
                // Save back to localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                showNotification('Specialties saved successfully!');
            } catch (error) {
                console.error('Error updating specialties:', error);
                showNotification('Error saving specialties', 'error');
            }
        } else {
            // Create new user data
            const userData = {
                userId: userId,
                specialties: specialties
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            showNotification('Specialties saved successfully!');
        }
    }
    
    // Setup tab switching functionality
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    // Event listeners for save buttons
    const saveBioBtn = document.getElementById('save-bio');
    if (saveBioBtn) {
        saveBioBtn.addEventListener('click', function() {
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) return;
            
            const bio = document.getElementById('farmer-bio').value;
            
            // Get current user data
            const currentUserData = localStorage.getItem('currentUser');
            
            if (currentUserData) {
                try {
                    const userData = JSON.parse(currentUserData);
                    userData.bio = bio;
                    
                    // Save back to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    showNotification('Bio saved successfully!');
                } catch (error) {
                    console.error('Error updating bio:', error);
                    showNotification('Error saving bio', 'error');
                }
            } else {
                // Create new user data
                const userData = {
                    userId: userId,
                    bio: bio
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                showNotification('Bio saved successfully!');
            }
        });
    }
    
    // Save basic information
    const saveBasicInfoBtn = document.getElementById('save-basic-info');
    if (saveBasicInfoBtn) {
        saveBasicInfoBtn.addEventListener('click', function() {
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) return;
            
            const name = document.getElementById('farmer-name')?.value;
            const age = document.getElementById('farmer-age')?.value;
            const experience = document.getElementById('farming-experience')?.value;
            const farmSize = document.getElementById('farm-size')?.value;
            
            // Update display name if element exists
            const farmerDisplayName = document.getElementById('farmer-display-name');
            if (farmerDisplayName && name) {
                farmerDisplayName.textContent = name;
            }
            
            // Get current user data
            const currentUserData = localStorage.getItem('currentUser');
            
            if (currentUserData) {
                try {
                    const userData = JSON.parse(currentUserData);
                    
                    if (name) userData.name = name;
                    if (age) userData.age = age;
                    if (experience) userData.experience = experience;
                    if (farmSize) userData.farmSize = farmSize;
                    
                    // Save back to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Also update in the farmers collection
                    updateFarmerInCollection(userId, { name, age });
                    
                    showNotification('Basic information saved successfully!');
                } catch (error) {
                    console.error('Error updating basic info:', error);
                    showNotification('Error saving basic information', 'error');
                }
            } else {
                // Create new user data
                const userData = {
                    userId: userId,
                    name: name,
                    age: age,
                    experience: experience,
                    farmSize: farmSize
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Also update in the farmers collection
                updateFarmerInCollection(userId, { name, age });
                
                showNotification('Basic information saved successfully!');
            }
        });
    }
    
    function updateFarmerInCollection(userId, updatedData) {
        const farmersData = localStorage.getItem('agriweb_farmers');
        
        if (farmersData) {
            try {
                const farmers = JSON.parse(farmersData);
                const farmerIndex = farmers.findIndex(f => f.userId === userId);
                
                if (farmerIndex !== -1) {
                    // Update existing farmer data
                    farmers[farmerIndex] = { ...farmers[farmerIndex], ...updatedData };
                    localStorage.setItem('agriweb_farmers', JSON.stringify(farmers));
                }
            } catch (error) {
                console.error('Error updating farmer in collection:', error);
            }
        }
    }
    
    const saveContactBtn = document.getElementById('save-contact');
    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', function() {
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) return;
            
            const email = document.getElementById('farmer-email')?.value;
            const phone = document.getElementById('farmer-phone')?.value;
            const location = document.getElementById('location-input')?.value;
            const whatsapp = document.getElementById('whatsapp-number')?.value;
            
            // Update location display if element exists
            const locationDisplay = document.getElementById('farmer-location');
            if (locationDisplay && location) {
                locationDisplay.textContent = location;
            }
            
            // Get current user data
            const currentUserData = localStorage.getItem('currentUser');
            
            if (currentUserData) {
                try {
                    const userData = JSON.parse(currentUserData);
                    
                    if (email) userData.email = email;
                    if (phone) userData.phone = phone;
                    if (location) userData.location = location;
                    if (whatsapp) userData.whatsapp = whatsapp;
                    
                    // Save back to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    showNotification('Contact information saved successfully!');
                } catch (error) {
                    console.error('Error updating contact info:', error);
                    showNotification('Error saving contact information', 'error');
                }
            } else {
                // Create new user data
                const userData = {
                    userId: userId,
                    email: email,
                    phone: phone,
                    location: location,
                    whatsapp: whatsapp
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                showNotification('Contact information saved successfully!');
            }
        });
    }
    
    // Add specialty button functionality
    const addSpecialtyBtn = document.getElementById('add-specialty-btn');
    const specialtyInput = document.getElementById('specialty-input');
    
    if (addSpecialtyBtn && specialtyInput) {
        addSpecialtyBtn.addEventListener('click', function() {
            const specialty = specialtyInput.value.trim();
            
            if (specialty) {
                addSpecialtyTag(specialty);
                specialtyInput.value = '';
                saveSpecialties();
            }
        });
        
        specialtyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSpecialtyBtn.click();
                e.preventDefault();
            }
        });
    }
    
    // Profile image upload functionality
    const profileImageInput = document.getElementById('profile-image-input');
    const profileImage = document.getElementById('farmer-profile-image');
    
    if (profileImageInput && profileImage) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    
                    // Save to localStorage
                    const currentUserData = localStorage.getItem('currentUser');
                    
                    if (currentUserData) {
                        try {
                            const userData = JSON.parse(currentUserData);
                            userData.profileImage = e.target.result;
                            
                            localStorage.setItem('currentUser', JSON.stringify(userData));
                            showNotification('Profile image updated successfully!');
                        } catch (error) {
                            console.error('Error updating profile image:', error);
                            showNotification('Error saving profile image', 'error');
                        }
                    } else {
                        // Create new user data
                        const userId = sessionStorage.getItem('currentUserId');
                        
                        if (userId) {
                            const userData = {
                                userId: userId,
                                profileImage: e.target.result
                            };
                            
                            localStorage.setItem('currentUser', JSON.stringify(userData));
                            showNotification('Profile image updated successfully!');
                        }
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }

    // Products Management Functions
// Products Management Functions
function setupProductManagement() {
    // Product image upload preview
    const productImageUpload = document.getElementById('product-image-upload');
    const productPreview = document.getElementById('product-preview');
    
    if (productImageUpload && productPreview) {
        productImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    productPreview.src = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Product tag selection
    const tagOptions = document.querySelectorAll('.tag-option');
    const selectedTags = document.getElementById('selected-tags');
    
    if (tagOptions && selectedTags) {
        tagOptions.forEach(tag => {
            tag.addEventListener('click', function() {
                const tagText = this.getAttribute('data-tag');
                
                // Check if tag is already selected
                const existingTags = Array.from(selectedTags.querySelectorAll('.selected-tag'))
                    .map(tag => tag.getAttribute('data-tag'));
                    
                if (existingTags.includes(tagText)) return;
                
                // Create a new selected tag
                const newTag = document.createElement('span');
                newTag.className = 'selected-tag';
                newTag.setAttribute('data-tag', tagText);
                newTag.innerHTML = `${tagText} <i class="fas fa-times remove-product-tag"></i>`;
                
                selectedTags.appendChild(newTag);
                
                // Add event listener to remove tag
                newTag.querySelector('.remove-product-tag').addEventListener('click', function() {
                    newTag.remove();
                });
            });
        });
    }
    
    // Clear form button
    const clearFormBtn = document.getElementById('clear-form');
    const productForm = document.getElementById('product-form');
    
    if (clearFormBtn && productForm) {
        clearFormBtn.addEventListener('click', function() {
            productForm.reset();
            
            if (productPreview) {
                productPreview.src = 'img/placeholder-product.jpg';
            }
            
            // Clear selected tags
            if (selectedTags) {
                selectedTags.innerHTML = '';
            }
            
            // Reset submit button to default state
            const submitButton = document.querySelector('.submit-product-btn');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-upload"></i> Upload Product';
                submitButton.removeAttribute('data-mode');
                submitButton.removeAttribute('data-id');
            }
        });
    }
    
    // Submit product form
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) {
                showNotification('You must be logged in to add products', 'error');
                return;
            }
            
            const submitButton = document.querySelector('.submit-product-btn');
            const mode = submitButton ? submitButton.getAttribute('data-mode') : 'add';
            const productId = submitButton ? submitButton.getAttribute('data-id') : null;
            
            // Get form values
            const productName = document.getElementById('product-name').value;
            const productCategory = document.getElementById('product-category').value;
            const productPrice = document.getElementById('product-price').value;
            const productQuantity = document.getElementById('product-quantity').value;
            const productDescription = document.getElementById('product-description').value;
            
            // Get selected tags
            const tags = Array.from(selectedTags.querySelectorAll('.selected-tag'))
                .map(tag => tag.getAttribute('data-tag'));
            
            if (mode === 'update' && productId) {
                // Get existing product data
                const productsData = localStorage.getItem('agriweb_products');
                
                if (productsData) {
                    try {
                        const products = JSON.parse(productsData);
                        const existingProduct = products.find(p => p.id === productId);
                        
                        if (existingProduct) {
                            // Update product object
                            const updatedProduct = {
                                ...existingProduct,
                                name: productName,
                                category: productCategory,
                                price: parseFloat(productPrice),
                                quantity: parseFloat(productQuantity),
                                description: productDescription,
                                tags: tags,
                                image: productPreview.src,
                                updatedAt: new Date().toISOString()
                            };
                            
                            // Update product in local storage
                            updateProduct(productId, updatedProduct);
                            
                            // Show success notification
                            showNotification('Product updated successfully!');
                        }
                    } catch (error) {
                        console.error('Error updating product:', error);
                        showNotification('Error updating product', 'error');
                    }
                }
            } else {
                // Create new product object
                const product = {
                    id: 'prod_' + Date.now(),
                    farmerId: userId,
                    name: productName,
                    category: productCategory,
                    price: parseFloat(productPrice),
                    quantity: parseFloat(productQuantity),
                    description: productDescription,
                    tags: tags,
                    image: productPreview.src,
                    createdAt: new Date().toISOString()
                };
                
                // Save product to local storage
                saveProduct(product);
                
                // Show success notification
                showNotification('Product added successfully!');
            }
            
            // Clear form
            clearFormBtn.click();
            
            // Refresh products list - IMPORTANT: This was missing or not working properly
            loadProductsData(userId);
            
            // Scroll to products list section
            const productsSection = document.getElementById('products-tab');
            if (productsSection) {
                // Switch to products tab
                const productsTabBtn = document.querySelector('.tab-btn[data-tab="products"]');
                if (productsTabBtn) {
                    productsTabBtn.click();
                }
                
                // Scroll to products section
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Filter products
    const filterSelect = document.getElementById('filter-products');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const userId = sessionStorage.getItem('currentUserId');
            if (userId) {
                loadProductsData(userId, this.value);
            }
        });
    }
    
    // Refresh products list
    const refreshBtn = document.getElementById('refresh-list');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const userId = sessionStorage.getItem('currentUserId');
            if (userId) {
                loadProductsData(userId);
            }
        });
    }
}

    
function saveProduct(product) {
    // Get existing products
    const productsData = localStorage.getItem('agriweb_products');
    
    if (productsData) {
        try {
            const products = JSON.parse(productsData);
            products.push(product);
            localStorage.setItem('agriweb_products', JSON.stringify(products));
        } catch (error) {
            console.error('Error saving product:', error);
            
            // Create new products array
            const products = [product];
            localStorage.setItem('agriweb_products', JSON.stringify(products));
        }
    } else {
        // Create new products array
        const products = [product];
        localStorage.setItem('agriweb_products', JSON.stringify(products));
    }
    
    // Update product count
    updateProductCount();
}

function loadProductsData(userId, category = 'all') {
    const productsList = document.getElementById('products-list');
    if (!productsList) {
        console.error('Products list element not found');
        return;
    }
    
    // Get products from local storage
    const productsData = localStorage.getItem('agriweb_products');
    
    if (productsData) {
        try {
            const products = JSON.parse(productsData);
            
            // Filter products by farmer ID and category
            const farmerProducts = products.filter(p => p.farmerId === userId && 
                (category === 'all' || p.category === category));
            
            // Update product count
            updateProductCount(farmerProducts.length);
            
            // Clear current list
            productsList.innerHTML = '';
            
            if (farmerProducts.length === 0) {
                // Show empty message
                productsList.innerHTML = `
                    <div class="empty-list">
                        <i class="fas fa-leaf"></i>
                        <p>${category === 'all' ? "You haven't added any products yet." : "No products in this category."}</p>
                    </div>
                `;
                return;
            }
            
            // Add products to list
            farmerProducts.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.setAttribute('data-id', product.id);
                
                productItem.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p class="product-price">₹${product.price}/kg</p>
                        <p class="product-stock">In Stock: ${product.quantity} kg</p>
                        <div class="product-tags">
                            ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="edit-product-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-product-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>`;
                
                productsList.appendChild(productItem);
                
                // Add event listeners to the buttons
                const editButton = productItem.querySelector('.edit-product-btn');
                const deleteButton = productItem.querySelector('.delete-product-btn');
                
                editButton.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    editProduct(productId);
                });
                
                deleteButton.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    deleteProduct(productId);
                });
            });
        } catch (error) {
            console.error('Error loading products:', error);
            showNotification('Error loading products', 'error');
            
            // Show error message in products list
            productsList.innerHTML = `
                <div class="empty-list error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading products. Please try again.</p>
                </div>
            `;
        }
    } else {
        // No products yet
        productsList.innerHTML = `
            <div class="empty-list">
                <i class="fas fa-leaf"></i>
                <p>You haven't added any products yet.</p>
            </div>
        `;
        
        // Set product count to 0
        updateProductCount(0);
    }
}

function editProduct(productId) {
    // Get products from local storage
    const productsData = localStorage.getItem('agriweb_products');
    
    if (productsData) {
        try {
            const products = JSON.parse(productsData);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                // Switch to upload tab
                const uploadTabBtn = document.querySelector('.tab-btn[data-tab="upload"]');
                if (uploadTabBtn) {
                    uploadTabBtn.click();
                }
                
                // Populate form with product data
                const nameField = document.getElementById('product-name');
                const categoryField = document.getElementById('product-category');
                const priceField = document.getElementById('product-price');
                const quantityField = document.getElementById('product-quantity');
                const descriptionField = document.getElementById('product-description');
                const previewImg = document.getElementById('product-preview');
                
                if (nameField) nameField.value = product.name;
                if (categoryField) categoryField.value = product.category;
                if (priceField) priceField.value = product.price;
                if (quantityField) quantityField.value = product.quantity;
                if (descriptionField) descriptionField.value = product.description;
                if (previewImg) previewImg.src = product.image;
                
                // Clear and repopulate selected tags
                const selectedTags = document.getElementById('selected-tags');
                if (selectedTags) {
                    selectedTags.innerHTML = '';
                    
                    product.tags.forEach(tag => {
                        const newTag = document.createElement('span');
                        newTag.className = 'selected-tag';
                        newTag.setAttribute('data-tag', tag);
                        newTag.innerHTML = `${tag} <i class="fas fa-times remove-product-tag"></i>`;
                        
                        selectedTags.appendChild(newTag);
                        
                        // Add event listener to remove tag
                        newTag.querySelector('.remove-product-tag').addEventListener('click', function() {
                            newTag.remove();
                        });
                    });
                }
                
                // Change form to update mode
                const submitButton = document.querySelector('.submit-product-btn');
                if (submitButton) {
                    submitButton.innerHTML = '<i class="fas fa-save"></i> Update Product';
                    submitButton.setAttribute('data-mode', 'update');
                    submitButton.setAttribute('data-id', productId);
                }
                
                // Scroll to form
                const formContainer = document.querySelector('.upload-form-container');
                if (formContainer) {
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                showNotification('Product not found', 'error');
            }
        } catch (error) {
            console.error('Error editing product:', error);
            showNotification('Error editing product', 'error');
        }
    }
}

    function resetProductForm() {
        // Reset form fields
        document.getElementById('product-form').reset();
        document.getElementById('product-preview').src = 'img/placeholder-product.jpg';
        
        // Clear selected tags
        document.getElementById('selected-tags').innerHTML = '';
        
        // Reset submit button
        const submitButton = document.querySelector('.submit-product-btn');
        submitButton.innerHTML = '<i class="fas fa-upload"></i> Upload Product';
        submitButton.removeAttribute('data-mode');
        submitButton.removeAttribute('data-id');
    }
    
    function updateProduct(productId, updatedProduct) {
        // Get products from local storage
        const productsData = localStorage.getItem('agriweb_products');
        
        if (productsData) {
            try {
                const products = JSON.parse(productsData);
                const productIndex = products.findIndex(p => p.id === productId);
                
                if (productIndex !== -1) {
                    // Update product
                    products[productIndex] = updatedProduct;
                    localStorage.setItem('agriweb_products', JSON.stringify(products));
                    
                    // Refresh product list
                    const userId = sessionStorage.getItem('currentUserId');
                    if (userId) {
                        loadProductsData(userId);
                    }
                }
            } catch (error) {
                console.error('Error updating product:', error);
                showNotification('Error updating product', 'error');
            }
        }
    }
    function deleteProduct(productId) {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        // Get products from local storage
        const productsData = localStorage.getItem('agriweb_products');
        
        if (productsData) {
            try {
                const products = JSON.parse(productsData);
                const updatedProducts = products.filter(p => p.id !== productId);
                
                // Update local storage
                localStorage.setItem('agriweb_products', JSON.stringify(updatedProducts));
                
                // Show success notification
                showNotification('Product deleted successfully!');
                
                // Refresh products list
                const userId = sessionStorage.getItem('currentUserId');
                if (userId) {
                    loadProductsData(userId);
                }
                
                // Update product count
                updateProductCount();
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Error deleting product', 'error');
            }
        }
    }
    
    function updateProductCount(count) {
        const productCountElement = document.getElementById('product-count');
        if (!productCountElement) return;
        
        if (count !== undefined) {
            productCountElement.textContent = count;
            return;
        }
        
        // Calculate count from products data
        const productsData = localStorage.getItem('agriweb_products');
        const userId = sessionStorage.getItem('currentUserId');
        
        if (productsData && userId) {
            try {
                const products = JSON.parse(productsData);
                const farmerProducts = products.filter(p => p.farmerId === userId);
                productCountElement.textContent = farmerProducts.length;
            } catch (error) {
                console.error('Error updating product count:', error);
                productCountElement.textContent = '0';
            }
        } else {
            productCountElement.textContent = '0';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (!notification || !notificationMessage) return;
        
        // Set message and type
        notificationMessage.textContent = message;
        notification.className = 'notification ' + (type === 'error' ? 'notification-error' : 'notification-success');
        
        // Show notification
        notification.style.display = 'block';
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                notification.style.display = 'none';
            }, 500);
        }, 3000);
    }
    // Setup logout functionality
    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                // Clear session storage
                sessionStorage.removeItem('farmerVerified');
                sessionStorage.removeItem('currentUserId');
                
                // Redirect to home page
                window.location.href = 'wt.html';
            });
        }
    }
    
    // Scroll to top button functionality
    function setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        if (scrollToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    scrollToTopBtn.style.display = 'flex';
                } else {
                    scrollToTopBtn.style.display = 'none';
                }
            });
            
            // Scroll to top when clicked
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Show notification
    // function showNotification(message, type = 'success') {
    //     const notification = document.getElementById('notification');
    //     const notificationMessage = document.getElementById('notification-message');
        
    //     if (!notification || !notificationMessage) return;
        
    //     // Set message and type
    //     notificationMessage.textContent = message;
    //     notification.className = 'notification ' + (type === 'error' ? 'notification-error' : 'notification-success');
        
    //     // Show notification
    //     notification.style.display = 'block';
    //     notification.style.opacity = '1';
        
    //     // Hide after 3 seconds
    //     setTimeout(function() {
    //         notification.style.opacity = '0';
    //         setTimeout(function() {
    //             notification.style.display = 'none';
    //         }, 500);
    //     }, 3000);
    // }
    
    // Close notification
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            const notification = document.getElementById('notification');
            if (notification) {
                notification.style.opacity = '0';
                setTimeout(function() {
                    notification.style.display = 'none';
                }, 500);
            }
        });
    }
});