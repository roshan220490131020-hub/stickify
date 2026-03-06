// ============ PRODUCT DATA ============
const products = [
  {
    id: 1,
    name: 'Racing Stripes',
    category: 'car',
    price: 199,
    description: 'Classic racing stripes for sports cars',
    icon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.imgworldstickets.com%2Fimg-worlds-plan-your-visit%2F&psig=AOvVaw2Hx7Q3v7m58yl2yOPCjp5k&ust=1772864155137000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNiLiuPPipMDFQAAAAAdAAAAABAE',
    rating: 5,
  },
  {
    id: 2,
    name: 'Chrome Skull',
    category: 'bike',
    price: 249,
    description: 'Bold skull design for bike enthusiasts',
    icon: '💀',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Dragon Design',
    category: 'cards',
    price: 149,
    description: 'Mythical dragon design cards',
    icon: '🐉',
    rating: 5,
  },
  {
    id: 4,
    name: 'Lion Badge',
    category: 'bike',
    price: 229,
    description: 'Majestic lion head design',
    icon: '🦁',
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Fire Flames',
    category: 'car',
    price: 179,
    description: 'Hot fire flames design',
    icon: '🔥',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'Galaxy Art',
    category: 'cards',
    price: 159,
    description: 'Beautiful galaxy themed cards',
    icon: '🌌',
    rating: 5,
  },
  {
    id: 7,
    name: 'Thunder Bolt',
    category: 'bike',
    price: 219,
    description: 'Electric thunder bolt design',
    icon: '⚡',
    rating: 4.6,
  },
  {
    id: 8,
    name: 'Sunset View',
    category: 'car',
    price: 189,
    description: 'Beautiful sunset landscape',
    icon: '🌅',
    rating: 4.9,
  },
  {
    id: 9,
    name: 'Ocean Waves',
    category: 'cards',
    price: 169,
    description: 'Serene ocean waves design',
    icon: '🌊',
    rating: 4.8,
  },
]

// ============ CART MANAGEMENT ============
let cart = []
let currentFilter = 'all'

// Initialize cart from localStorage
function initializeCart() {
  const savedCart = localStorage.getItem('stickifyCart')
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartCount()
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('stickifyCart', JSON.stringify(cart))
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const cartItem = cart.find((item) => item.id === productId)

  if (cartItem) {
    cartItem.quantity++
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  saveCart()
  updateCartCount()
  showNotification(`${product.name} added to cart!`)

  // Update button appearance
  const button = event.target
  button.textContent = '✓ Added'
  button.classList.add('added')
  setTimeout(() => {
    button.textContent = 'Add to Cart'
    button.classList.remove('added')
  }, 2000)
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartCount()
  renderCart()
}

// Update quantity
function updateQuantity(productId, change) {
  const cartItem = cart.find((item) => item.id === productId)
  if (cartItem) {
    cartItem.quantity += change
    if (cartItem.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart()
      renderCart()
    }
  }
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  document.getElementById('cart-count').textContent = count
}

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById('cart-items')

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `
    updateCartSummary()
    return
  }

  cartContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `,
    )
    .join('')

  updateCartSummary()
}

// Update cart summary
function updateCartSummary() {
  let subtotal = 0
  cart.forEach((item) => {
    subtotal += item.price * item.quantity
  })

  const shipping = subtotal > 0 ? 50 : 0
  const total = subtotal + shipping

  document.getElementById('subtotal').textContent = `₹${subtotal}`
  document.getElementById('shipping').textContent = `₹${shipping}`
  document.getElementById('total').textContent = `₹${total}`
}

// ============ PRODUCT RENDERING ============
function renderProducts(filter = 'all') {
  const productsGrid = document.getElementById('products-grid')

  let filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.category === filter)

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image"><img scr="${product.icon}"></div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="product-rating">
                    ${renderStars(product.rating)}
                    <span style="color: #999; font-size: 12px;">
                        (${product.rating})
                    </span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    )
    .join('')
}

// Render star rating
function renderStars(rating) {
  let stars = ''
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>'
  }

  if (hasHalfStar) {
    stars += '<span class="star">★</span>'
  }

  return stars
}

// Filter products
function filterProducts(category) {
  currentFilter = category
  renderProducts(category)

  // Update active button
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active')
  })
  event.target.classList.add('active')
}

// ============ CART SIDEBAR ============
function openCart() {
  document.getElementById('cart-sidebar').classList.add('active')
  renderCart()
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('active')
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  const cartSidebar = document.getElementById('cart-sidebar')
  const cartIcon = document.querySelector('.cart-icon')

  if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
    closeCart()
  }
})

// ============ AUTHENTICATION ============
function toggleForms() {
  document.getElementById('login-form').classList.toggle('active')
  document.getElementById('signup-form').classList.toggle('active')
}

function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  // Simple validation
  if (email && password) {
    // Save user session
    localStorage.setItem(
      'stickifyUser',
      JSON.stringify({
        email: email,
        loginTime: new Date().toISOString(),
      }),
    )

    showNotification('Login successful!')
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 1500)
  }
}

function handleSignup(event) {
  event.preventDefault()
  const name = document.getElementById('signup-name').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value
  const confirm = document.getElementById('signup-confirm').value

  if (password !== confirm) {
    showNotification('Passwords do not match!', 'error')
    return
  }

  if (name && email && password) {
    localStorage.setItem(
      'stickifyUser',
      JSON.stringify({
        name: name,
        email: email,
        signupTime: new Date().toISOString(),
      }),
    )

    showNotification('Account created successfully!')
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 1500)
  }
}

// ============ NAVIGATION ============
function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu')
  navMenu.classList.toggle('active')
}

// ============ NOTIFICATIONS ============
function showNotification(message, type = 'success') {
  const notification = document.createElement('div')
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#26C281' : '#ff6b6b'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 300;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// ============ SCROLL ANIMATIONS ============
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease forwards'
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  initializeCart()

  // Render products on home page
  if (document.getElementById('products-grid')) {
    renderProducts()

    // Observe product cards
    document.querySelectorAll('.product-card').forEach((card) => {
      observer.observe(card)
    })
  }

  // Add animation for sections
  document.querySelectorAll('.section-header, .info-item').forEach((elem) => {
    observer.observe(elem)
  })

  // Add keyframe animations
  if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style')
    style.setAttribute('data-animations', 'true')
    style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100px);
                    opacity: 0;
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `
    document.head.appendChild(style)
  }
})

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      toggleMenu() // Close menu on mobile
    }
  })
})
