// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Initialize product grid with products from local storage
    loadProductsFromLocalStorage();
    
    // Initialize cart
    initializeCart();
    
    // Add event listeners
    setupEventListeners();
    
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none';
    }, 800);
});
// Function to get farmer data from local storage
// Modify the getFarmerById function to use userId instead of id
function getFarmerById(farmerId) {
    // Get farmers from local storage
    const storedFarmers = localStorage.getItem('agriweb_farmers');
    
    if (!storedFarmers) {
        console.warn('No farmers found in local storage (agriweb_farmers)');
        return null;
    }
    
    try {
        const farmers = JSON.parse(storedFarmers);
        // Change this line to use userId instead of id
        const farmer = farmers.find(farmer => farmer.userId === farmerId);
        
        if (!farmer) {
            console.warn(`Farmer with userId ${farmerId} not found in local storage`);
            return null;
        }
        
        return farmer;
    } catch (error) {
        console.error('Error parsing farmers from local storage:', error);
        return null;
    }
}

// Load and display products from local storage
function loadProductsFromLocalStorage() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = ''; // Clear existing products
    
    // Get products from local storage (using the key where products are stored)
    const storedProducts = localStorage.getItem('agriweb_products');
    
    let products = [];
    
    if (storedProducts) {
        try {
            products = JSON.parse(storedProducts);
            
            // Update product count
            document.getElementById('product-count').textContent = products.length;
            
            // Display products in grid
            displayProducts(products);
            
            // Log success message
            console.log(`Successfully loaded ${products.length} products from agriweb_products`);
        } catch (error) {
            console.error('Error parsing products from local storage:', error);
            showToast('error', 'Error', 'Failed to load products from storage', 3000);
            productsGrid.innerHTML = '<div class="no-products"><h3>No products available</h3><p>There was an error loading products. Please check back later.</p></div>';
        }
    } else {
        // No products found in local storage
        document.getElementById('product-count').textContent = '0';
        productsGrid.innerHTML = '<div class="no-products"><h3>No products available</h3><p>There are currently no products available. Please check back later or visit the farmer\'s page to add products.</p></div>';
        console.log('No products found in agriweb_products');
        
        // Create sample products since none exist
        createSampleProducts();
    }
}

// Create sample products if none exist
// Update the createSampleProducts to include farmerId instead of embedding farmer data
// function createSampleProducts() {
//     // Check if there are farmers in local storage, if not create sample farmers
//     let farmers = JSON.parse(localStorage.getItem('agriweb_farmers')) || [];
    
//     if (farmers.length === 0) {
//         // Create sample farmers
//         farmers = [
//             {
//                 id: 'farmer-001',
//                 name: 'Rajesh Kumar',
//                 image: 'img/farmers/farmer1.jpg',
//                 rating: 4.5,
//                 location: 'Punjab',
//                 specialties: ['Vegetables', 'Grains']
//             },
//             {
//                 id: 'farmer-002',
//                 name: 'Suresh Patel',
//                 image: 'img/farmers/farmer2.jpg',
//                 rating: 4.2,
//                 location: 'Gujarat',
//                 specialties: ['Vegetables', 'Fruits']
//             },
//             {
//                 id: 'farmer-003',
//                 name: 'Amit Singh',
//                 image: 'img/farmers/farmer3.jpg',
//                 rating: 4.8,
//                 location: 'Haryana',
//                 specialties: ['Grains', 'Spices']
//             },
//             {
//                 id: 'farmer-004',
//                 name: 'Priya Sharma',
//                 image: 'img/farmers/farmer4.jpg',
//                 rating: 4.6,
//                 location: 'Himachal Pradesh',
//                 specialties: ['Fruits', 'Vegetables']
//             },
//             {
//                 id: 'farmer-005',
//                 name: 'Vikram Yadav',
//                 image: 'img/farmers/farmer5.jpg',
//                 rating: 4.3,
//                 location: 'Uttar Pradesh',
//                 specialties: ['Vegetables', 'Herbs']
//             }
//         ];
        
//         // Save sample farmers to local storage
//         localStorage.setItem('agriweb_farmers', JSON.stringify(farmers));
//         console.log('Sample farmer data created');
//     }
    
//     // Sample product data with farmerId instead of embedded farmer object
//     const sampleProducts = [
//         {
//             id: 'prod-001',
//             name: 'Organic Tomatoes',
//             price: 80,
//             originalPrice: 100,
//             image: 'img/products/tomatoes.jpg',
//             description: 'Fresh organic tomatoes grown without pesticides.',
//             category: 'vegetables',
//             tags: ['organic', 'fresh', 'vegetable'],
//             quantity: 50,
//             farmerId: 'farmer-001'
//         },
//         {
//             id: 'prod-002',
//             name: 'Farm Fresh Potatoes',
//             price: 40,
//             originalPrice: 50,
//             image: 'img/products/potatoes.jpg',
//             description: 'Locally grown potatoes. Perfect for curries and fries.',
//             category: 'vegetables',
//             tags: ['fresh', 'vegetable', 'staple'],
//             quantity: 100,
//             farmerId: 'farmer-002'
//         },
//         {
//             id: 'prod-003',
//             name: 'Basmati Rice',
//             price: 120,
//             originalPrice: 150,
//             image: 'img/products/rice.jpg',
//             description: 'Premium quality Basmati rice grown in the foothills of Himalayas.',
//             category: 'grains',
//             tags: ['grain', 'staple', 'premium'],
//             quantity: 30,
//             farmerId: 'farmer-003'
//         },
//         {
//             id: 'prod-004',
//             name: 'Fresh Apples',
//             price: 160,
//             originalPrice: 200,
//             image: 'img/products/apples.jpg',
//             description: 'Crisp, juicy apples from the orchards of Himachal Pradesh.',
//             category: 'fruits',
//             tags: ['fruit', 'fresh', 'seasonal'],
//             quantity: 40,
//             farmerId: 'farmer-004'
//         },
//         {
//             id: 'prod-005',
//             name: 'Organic Spinach',
//             price: 50,
//             originalPrice: 60,
//             image: 'img/products/spinach.jpg',
//             description: 'Nutrient-rich organic spinach, freshly harvested.',
//             category: 'vegetables',
//             tags: ['organic', 'leafy', 'vegetable'],
//             quantity: 25,
//             farmerId: 'farmer-005'
//         }
//     ];
    
//     // Save sample products to local storage
//     localStorage.setItem('agriweb_products', JSON.stringify(sampleProducts));
//     console.log('Sample product data created');
    
//     // Display products
//     displayProducts(sampleProducts);
    
//     // Update product count
//     document.getElementById('product-count').textContent = sampleProducts.length;
// }
// Display products in grid
// Modified display products function to use farmer data from agriweb_farmers
// Display products in grid - corrected version
function displayProducts(productsArray) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (!productsArray || productsArray.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><h3>No products available</h3><p>There are currently no products available. Please check back later or visit the farmer\'s page to add products.</p></div>';
        return;
    }
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        
        // Set default image if not provided
        const productImage = product.image || 'img/placeholder.jpg';
        
        // Calculate discount if originalPrice exists
        let discount = 0;
        if (product.originalPrice && product.price) {
            discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
        
        // Format tags to display
        const tags = product.tags ? product.tags : [];
        
        // Get farmer data from local storage using farmerId
        let farmerInfo = {
            name: "Local Farmer",
            image: "img/farmers/default.jpg",
            rating: 4.0
        };
        
        if (product.farmerId) {
            const farmerData = getFarmerById(product.farmerId);
            if (farmerData) {
                farmerInfo = {
                    name: farmerData.name || "Local Farmer",
                    image: farmerData.image || "img/farmers/default.jpg",
                    rating: farmerData.rating || 4.0
                };
            }
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${productImage}" alt="${product.name}">
                ${discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ''}
                <div class="quick-view-btn" data-product-id="${product.id}">Quick View</div>
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-farmer">
                    <img class="farmer-thumbnail" src="${farmerInfo.image}" alt="${farmerInfo.name}">
                    <span>${farmerInfo.name}</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price}/kg</span>
                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-tags">
                    ${tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                </div>
                <div class="product-actions">
                    <button class="add-btn" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Initialize cart functionality
function initializeCart() {
    // Check for cart in local storage
    let cart = JSON.parse(localStorage.getItem('agriconnect-cart')) || [];
    updateCartUI(cart);
    
    // Add event listener for cart icon
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // Add event listener for close cart button
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            toggleCart();
        });
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Update cart UI
function updateCartUI(cart) {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const shippingFee = 50; // Default shipping fee
    
    // Update cart count
    if (cartCount) cartCount.textContent = cart.length;
    if (cartItemCount) cartItemCount.textContent = cart.length;
    
    // Calculate cart total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + (subtotal > 0 ? shippingFee : 0);
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Enable/disable checkout button
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <img src="img/empty-cart.svg" alt="Empty Cart">
                    <p>Your cart is empty</p>
                    <a href="#products-grid" class="start-shopping-btn">Start Shopping</a>
                </div>
            `;
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.setAttribute('data-product-id', item.id);
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">
                            <span class="cart-item-current">₹${item.price}/kg</span>
                            ${item.originalPrice ? `<span class="cart-item-original">₹${item.originalPrice}</span>` : ''}
                        </div>
                        <div class="cart-item-quantity">
                            <button class="cart-qty-btn minus" data-product-id="${item.id}">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <span>kg</span>
                            <button class="cart-qty-btn plus" data-product-id="${item.id}">+</button>
                            <button class="cart-remove" data-product-id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
        }
    }
    
    // Save cart to local storage
    localStorage.setItem('agriconnect-cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('agriconnect-cart')) || [];
    
    // Get products from local storage
    const storedProducts = localStorage.getItem('agriweb_products');
    let products = [];
    
    if (storedProducts) {
        try {
            products = JSON.parse(storedProducts);
        } catch (error) {
            console.error('Error parsing products:', error);
            return;
        }
    } else {
        console.error('No products found in local storage');
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image || 'img/placeholder.jpg',
            quantity: quantity
        });
    }
    
    // Update UI
    updateCartUI(cart);
    
    // Show notification
    showToast('success', 'Added to Cart!', `${quantity}kg of ${product.name} added to your cart`, 3000);
}

// Remove product from cart
function removeFromCart(productId) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('agriconnect-cart')) || [];
    
    // Find the product before removing
    const productToRemove = cart.find(item => item.id === productId);
    
    // Remove item
    cart = cart.filter(item => item.id !== productId);
    
    // Update UI
    updateCartUI(cart);
    
    // Show notification if product was found
    if (productToRemove) {
        showToast('warning', 'Removed from Cart', `${productToRemove.name} has been removed from your cart`, 2000);
    }
}

// Update product quantity in cart
function updateCartQuantity(productId, change) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('agriconnect-cart')) || [];
    
    // Find item
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        // Calculate new quantity
        const newQuantity = cart[itemIndex].quantity + change;
        // If new quantity is 0 or less, remove item
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            // Update quantity
            cart[itemIndex].quantity = newQuantity;
            
            // Update UI
            updateCartUI(cart);
        }
    }
}

// Setup event listeners for the page
function setupEventListeners() {
    // Product card quick view button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            openQuickView(productId);
        }
    });
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        }
    });
    
    // Cart quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-qty-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            const change = e.target.classList.contains('plus') ? 1 : -1;
            updateCartQuantity(productId, change);
        }
    });
    
    // Remove from cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-remove') || e.target.closest('.cart-remove')) {
            const productId = e.target.closest('.cart-remove').getAttribute('data-product-id');
            removeFromCart(productId);
        }
    });
    
    // Modal add to cart button
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = parseInt(document.getElementById('modal-quantity-input').value);
            addToCart(productId, quantity);
            closeModal();
        });
    }
    
    // Modal quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const quantityInput = document.getElementById('modal-quantity-input');
            let quantity = parseInt(quantityInput.value);
            
            if (e.target.classList.contains('plus')) {
                quantity += 1;
            } else if (e.target.classList.contains('minus')) {
                quantity = Math.max(1, quantity - 1);
            }
            
            quantityInput.value = quantity;
        }
    });
    
    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeQuickViewModal();
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const productSearch = document.getElementById('product-search');
    
    if (searchBtn && productSearch) {
        searchBtn.addEventListener('click', function() {
            searchProducts(productSearch.value);
        });
        
        productSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts(this.value);
            }
        });
    }
    
    // Filter functionality
    const filterInputs = document.querySelectorAll('.filter-option input');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    // Price range inputs
    const priceSlider = document.getElementById('price-slider');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (priceSlider && minPriceInput && maxPriceInput) {
        priceSlider.addEventListener('input', function() {
            maxPriceInput.value = this.value;
            applyFilters();
        });
        
        minPriceInput.addEventListener('change', function() {
            applyFilters();
        });
        
        maxPriceInput.addEventListener('change', function() {
            priceSlider.value = this.value;
            applyFilters();
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    // Clear filters
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Open quick view modal
// Open quick view modal - corrected version
// Open quick view modal - updated to include farmer badge
function openQuickView(productId) {
    // Get products from local storage
    const storedProducts = localStorage.getItem('agriweb_products');
    let products = [];
    
    if (storedProducts) {
        try {
            products = JSON.parse(storedProducts);
        } catch (error) {
            console.error('Error parsing products:', error);
            return;
        }
    } else {
        console.error('No products found in local storage');
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get current user from local storage
    let currentUser = null;
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error('Error parsing current user:', error);
    }
    
    // Get modal elements
    const modal = document.getElementById('product-modal');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalProductName = document.getElementById('modal-product-name');
    const modalFarmerImage = document.getElementById('modal-farmer-image');
    const modalFarmerName = document.getElementById('modal-farmer-name');
    const modalFarmerRating = document.getElementById('modal-farmer-rating');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalOriginalPrice = document.getElementById('modal-original-price');
    const modalDiscount = document.getElementById('modal-discount');
    const modalDiscountBadge = document.querySelector('.discount-badge');
    const modalQuantity = document.getElementById('modal-quantity');
    const modalProductTags = document.getElementById('modal-product-tags');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
    
    // Set modal data
    modalMainImage.src = product.image || 'img/placeholder.jpg';
    modalProductName.textContent = product.name;
    
    // Get farmer data from local storage
    let farmerInfo = {
        name: "Local Farmer",
        image: "img/farmers/default.jpg",
        rating: 4.0
    };
    
    if (product.farmerId) {
        // Use the existing getFarmerById function to retrieve farmer data
        const farmerData = getFarmerById(product.farmerId);
        if (farmerData) {
            farmerInfo = {
                name: farmerData.name || "Local Farmer",
                image: farmerData.image || "img/farmers/default.jpg",
                rating: farmerData.rating || 4.0
            };
        }
    }
    
    // Set farmer info
    modalFarmerImage.src = farmerInfo.image;
    modalFarmerName.textContent = farmerInfo.name;
    modalFarmerRating.textContent = farmerInfo.rating;
    
    // Check if current user is the farmer and add badge if they are
    const farmerBadgeContainer = document.getElementById('modal-farmer-badge-container') || 
                                 document.querySelector('.modal-farmer-info .farmer-badge');
    
    if (farmerBadgeContainer) {
        // Clear previous badge if any
        farmerBadgeContainer.innerHTML = '';
        
        // Add badge if current user is the farmer of this product
        if (currentUser && product.farmerId === currentUser.userId) {
            const badgeImg = document.createElement('img');
            badgeImg.className = 'farmer-badge';
            badgeImg.src = currentUser.profileImage || 'img/farmer-badge.png';
            badgeImg.alt = 'Your product';
            
            const badgeTooltip = document.createElement('span');
            badgeTooltip.className = 'badge-tooltip';
            badgeTooltip.textContent = 'Your product';
            
            farmerBadgeContainer.appendChild(badgeImg);
            farmerBadgeContainer.appendChild(badgeTooltip);
            farmerBadgeContainer.style.display = 'inline-block';
        } else {
            farmerBadgeContainer.style.display = 'none';
        }
    }
    
    // Set price info
    modalProductPrice.textContent = product.price;
    
    // Handle discount
    if (product.originalPrice) {
        modalOriginalPrice.textContent = product.originalPrice;
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        modalDiscount.textContent = discount;
        modalDiscountBadge.style.display = 'inline-block';
    } else {
        modalOriginalPrice.textContent = '';
        modalDiscountBadge.style.display = 'none';
    }
    
    // Set quantity
    modalQuantity.textContent = product.quantity || 0;
    
    // Set tags
    modalProductTags.innerHTML = '';
    if (product.tags && product.tags.length > 0) {
        product.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'product-tag';
            tagElement.textContent = tag;
            modalProductTags.appendChild(tagElement);
        });
    }
    
    // Set description
    modalProductDescription.textContent = product.description || 'No description available';
    
    // Set product ID for add to cart button
    modalAddToCartBtn.setAttribute('data-product-id', productId);
    
    // Reset quantity input
    document.getElementById('modal-quantity-input').value = 1;
    
    // Show modal
    modal.style.display = 'block';
}

// Close quick view modal
function closeQuickViewModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
}

// Search products
function searchProducts(query) {
    if (!query) return;
    
    query = query.toLowerCase().trim();
    
    // Get products from local storage
    const storedProducts = localStorage.getItem('agriweb_products');
    let products = [];
    
    if (storedProducts) {
        try {
            products = JSON.parse(storedProducts);
        } catch (error) {
            console.error('Error parsing products:', error);
            return;
        }
    } else {
        console.error('No products found in local storage');
        return;
    }
    
    // Filter products by search query
    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query)) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    });
    
    // Display filtered products
    displayProducts(filteredProducts);
    
    // Update product count
    document.getElementById('product-count').textContent = filteredProducts.length;
    
    // Show notification
    showToast('info', 'Search Results', `Found ${filteredProducts.length} products matching "${query}"`, 3000);
}

// Apply filters
function applyFilters() {
    // Get products from local storage
    const storedProducts = localStorage.getItem('agriweb_products');
    let products = [];
    
    if (storedProducts) {
        try {
            products = JSON.parse(storedProducts);
        } catch (error) {
            console.error('Error parsing products:', error);
            return;
        }
    } else {
        console.error('No products found in local storage');
        return;
    }
    
    // Get filter values
    const selectedCategories = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
        .filter(input => input.closest('.filter-group').querySelector('h4').textContent === 'Categories')
        .map(input => input.value.toLowerCase());
    
    const selectedTags = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
        .filter(input => input.closest('.filter-group').querySelector('h4').textContent === 'Product Tags')
        .map(input => input.value.toLowerCase());
    
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || 1000;
    
    const minRating = document.querySelector('.filter-option input[name="rating"]:checked')
        ? parseInt(document.querySelector('.filter-option input[name="rating"]:checked').value)
        : 0;
    
    // Apply filters
    const filteredProducts = products.filter(product => {
        // Filter by category
        if (selectedCategories.length > 0 && (!product.category || !selectedCategories.includes(product.category.toLowerCase()))) {
            return false;
        }
        
        // Filter by price
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Filter by tags
        if (selectedTags.length > 0) {
            if (!product.tags || !product.tags.some(tag => selectedTags.includes(tag.toLowerCase()))) {
                return false;
            }
        }
        
        // Filter by rating
        if (minRating > 0) {
            if (!product.farmer || !product.farmer.rating || product.farmer.rating < minRating) {
                return false;
            }
        }
        
        return true;
    });
    
    // Display filtered products
    displayProducts(filteredProducts);
    
    // Update product count
    document.getElementById('product-count').textContent = filteredProducts.length;
}

// Sort products
function sortProducts(sortOption) {
    // Get products from local storage
    const productsGrid = document.getElementById('products-grid');
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    // Sort products
    products.sort((a, b) => {
        const aId = a.getAttribute('data-product-id');
        const bId = b.getAttribute('data-product-id');
        
        // Get product data from local storage
        const storedProducts = JSON.parse(localStorage.getItem('agriweb_products')) || [];
        const productA = storedProducts.find(p => p.id === aId);
        const productB = storedProducts.find(p => p.id === bId);
        
        if (!productA || !productB) return 0;
        
        switch (sortOption) {
            case 'price-low':
                return productA.price - productB.price;
            case 'price-high':
                return productB.price - productA.price;
            case 'rating':
                return (productB.farmer?.rating || 0) - (productA.farmer?.rating || 0);
            case 'date':
                // Use product ID as a proxy for date if creation date isn't available
                return bId.localeCompare(aId);
            default:
                return 0;
        }
    });
    
    // Reorder products in the DOM
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Clear all filters
function clearFilters() {
    // Reset checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Reset radio buttons
    document.querySelectorAll('.filter-option input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Reset price range
    document.getElementById('min-price').value = 0;
    document.getElementById('max-price').value = 1000;
    document.getElementById('price-slider').value = 1000;
    
    // Reset sort select
    document.getElementById('sort-select').value = 'featured';
    
    // Load all products
    loadProductsFromLocalStorage();
}

// Show toast notification
// Show animated toast notification
function showToast(type, title, message, duration = 5000) {
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    // Colors for different toast types
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icons[type]}" style="color: ${colors[type]}"></i>
            <div class="toast-message">
                <span class="toast-title">${title}</span>
                <p>${message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="toast-progress" style="background: ${colors[type]}"></div>
    `;
    
    // Add initial styling for animation
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.25, 1.35)';
    
    toastContainer.appendChild(toast);
    
    // Toast close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        dismissToast(toast);
    });
    
    // Trigger entrance animation
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
        
        // Add slight bounce effect
        setTimeout(() => {
            toast.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
        }, 300);
        
        // Handle progress bar animation
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${duration}ms linear`;
        
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 10);
        
        // Remove toast after duration
        let timeoutId = setTimeout(() => {
            dismissToast(toast);
        }, duration);
        
        // Pause timer on hover
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            progressBar.style.transitionProperty = 'none';
            const remainingWidth = progressBar.offsetWidth;
            progressBar.style.width = `${remainingWidth}px`;
        });
        
        // Resume timer on mouse leave
        toast.addEventListener('mouseleave', () => {
            const remainingPercentage = (progressBar.offsetWidth / toast.offsetWidth) * 100;
            const remainingTime = (remainingPercentage / 100) * duration;
            
            progressBar.style.transition = `width ${remainingTime}ms linear`;
            progressBar.style.width = '0%';
            
            timeoutId = setTimeout(() => {
                dismissToast(toast);
            }, remainingTime);
        });
        
    }, 10);
    
    // Function to dismiss toast with animation
    function dismissToast(toast) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        
        // Remove toast from DOM after animation completes
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 500);
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeQuickViewModal();
    }
});

// Handle keyboard escape key for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuickViewModal();
    }
});

// Handle pagination
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('page-number') && !e.target.classList.contains('active')) {
        // Get all page numbers
        const pageNumbers = document.querySelectorAll('.page-number');
        
        // Remove active class from all page numbers
        pageNumbers.forEach(page => page.classList.remove('active'));
        
        // Add active class to clicked page number
        e.target.classList.add('active');
        
        // TODO: Implement actual pagination logic
        // For now, just scroll to top of products grid
        document.getElementById('products-grid').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Handle pagination buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.pagination-btn')) {
        const button = e.target.closest('.pagination-btn');
        const pageNumbers = document.querySelectorAll('.page-number');
        const activePage = document.querySelector('.page-number.active');
        
        // Find current page index
        const currentIndex = Array.from(pageNumbers).indexOf(activePage);
        
        // Handle previous button
        if (button.querySelector('.fa-chevron-left')) {
            if (currentIndex > 0) {
                pageNumbers[currentIndex].classList.remove('active');
                pageNumbers[currentIndex - 1].classList.add('active');
            }
        }
        
        // Handle next button
        if (button.querySelector('.fa-chevron-right')) {
            if (currentIndex < pageNumbers.length - 1) {
                pageNumbers[currentIndex].classList.remove('active');
                pageNumbers[currentIndex + 1].classList.add('active');
            }
        }
        
        // Update pagination button states
        updatePaginationButtons();
        
        // TODO: Implement actual pagination logic
        // For now, just scroll to top of products grid
        document.getElementById('products-grid').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Update pagination button states
function updatePaginationButtons() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const activePage = document.querySelector('.page-number.active');
    const currentIndex = Array.from(pageNumbers).indexOf(activePage);
    
    const prevButton = document.querySelector('.pagination-btn:first-child');
    const nextButton = document.querySelector('.pagination-btn:last-child');
    
    if (currentIndex === 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
    
    if (currentIndex === pageNumbers.length - 1) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

// Handle wishlist buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.wishlist-btn')) {
        const wishlistBtn = e.target.closest('.wishlist-btn');
        const heartIcon = wishlistBtn.querySelector('i');
        
        // Toggle wishlist state
        if (heartIcon.classList.contains('far')) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            wishlistBtn.classList.add('active');
            showToast('success', 'Added to Wishlist', 'Product added to your wishlist', 2000);
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            wishlistBtn.classList.remove('active');
            showToast('info', 'Removed from Wishlist', 'Product removed from your wishlist', 2000);
        }
    }
});

// Scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
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
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
});

// Handle Buy Now button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-now-btn')) {
        const productId = document.getElementById('modal-add-to-cart').getAttribute('data-product-id');
        const quantity = parseInt(document.getElementById('modal-quantity-input').value);
        
        // Add to cart first
        addToCart(productId, quantity);
        
        // Close modal
        closeQuickViewModal();
        
        // Redirect to checkout page (placeholder)
        showToast('info', 'Redirecting...', 'Taking you to checkout page', 2000);
        
        // TODO: Implement actual checkout redirection
        // For demonstration, just open cart sidebar
        setTimeout(() => {
            toggleCart();
        }, 500);
    }
});

// Implement product search on input change
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('product-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length >= 3) {
                searchProducts(this.value);
            } else if (this.value.length === 0) {
                // Reset to all products when search is cleared
                loadProductsFromLocalStorage();
            }
        });
    }
});

// Add checkout button functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // For demonstration, just show a toast
            showToast('info', 'Checkout Feature', 'This feature is coming soon!', 3000);
        });
    }
});

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    // Update pagination buttons initial state
    updatePaginationButtons();
});

