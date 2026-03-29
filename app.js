// Firebase configuration (unchanged)
const firebaseConfig = {
  apiKey: "AIzaSyCsHFigH6JMpBJIuOrQqwS_hldjuYTV7oE",
  authDomain: "tech-shop-75a2e.firebaseapp.com",
  databaseURL: "https://tech-shop-75a2e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tech-shop-75a2e",
  storageBucket: "tech-shop-75a2e.firebasestorage.app",
  messagingSenderId: "302591694426",
  appId: "1:302591694426:web:3839f375bb53d4efd0aa63",
  measurementId: "G-Q2L4L100CH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Product data (unchanged)
const productDetails = [
  {
    name: "NovaBeat X Pro",
    price: 7999,
    imageUrl: "images/NovaBeat X Pro.jpg",
    qty: 10,
    heading: "Premium Noise Cancelling Headphones",
    des: "40hr battery, ANC, immersive sound"
  },
  // ... (all other products)
  {
    name: "Null Product X",
    price: 0,
    imageUrl: "images/Null Product X.jpg",
    qty: 1,
    heading: "Unavailable Item",
    des: "This item is currently unavailable."
  }
];

const cartDetails = [];

// Helper functions for UI components
function AddBtn() {
  return `
    <div>
      <button onclick='addItem(this)' class='add-btn'>Add <i class='fas fa-chevron-right'></i></button>
    </div>`;
}

function QtyBtn(qty = 1) {
  if (qty === 0) return AddBtn();
  return `
    <div>
      <button class='btn-qty' onclick="qtyChange(this,'sub')"><i class='fas fa-chevron-left'></i></button>
      <p class='qty'>${qty}</p>
      <button class='btn-qty' onclick="qtyChange(this,'add')"><i class='fas fa-chevron-right'></i></button>
    </div>`;
}

// Product card HTML
function Product(product = {}) {
  let { name, price, imageUrl, heading, des } = product;
  return `
    <div class='card'>
      <div class='top-bar'>
        <i class='fab fa-apple'></i>
        <em class="stocks">In Stock</em>
      </div>
      <div class='img-container'>
        <img class='product-img' src='${imageUrl}' alt='' />
      </div>
      <div class='details'>
        <div class='name-fav'>
          <strong class='product-name'>${name}</strong>
          <button onclick='this.classList.toggle("fav")' class='heart'><i class='fas fa-heart'></i></button>
        </div>
        <div class='wrapper'>
          <h5>${heading}</h5>
          <p>${des}</p>
        </div>
        <div class='purchase'>
          <p class='product-price'>₹ ${price}</p>
          <span class='btn-add'>${AddBtn()}</span>
        </div>
      </div>
      <div class='out-of-stock-cover' style='display:none;'>Out of Stock</div>
    </div>`;
}

// Cart item HTML (new function)
function CartItems(item) {
  return `
    <div class='cart-item'>
      <img src='${item.imgSrc}' alt='${item.name}' class='cart-img' />
      <div class='cart-details'>
        <strong class='name'>${item.name}</strong>
        <p>₹ ${item.price}</p>
        <div class='cart-qty'>
          <button onclick="qtyChange(this, 'sub')">-</button>
          <span>${item.qty}</span>
          <button onclick="qtyChange(this, 'add')">+</button>
        </div>
      </div>
      <button onclick='removeItem(this)' class='remove-btn'>✖</button>
    </div>`;
}

// Side navigation HTML
function CartSideNav() {
  return `
    <div class='side-nav'>
      <button onclick='toggleSideNav()'><i class='fas fa-times'></i></button>
      <h2>Cart</h2>
      <div class='cart-items'></div>
      <div class='final'>
        <strong>Total: ₹ <span class='total'>0</span>.00/-</strong>
        <div class='action'>
          <button onclick='buy(1)' class='btn buy'>Purchase <i class='fas fa-credit-card'></i></button>
          <button onclick='clearCart()' class='btn clear'>Clear Cart <i class='fas fa-trash'></i></button>
        </div>
      </div>
    </div>`;
}

// Purchase invoice HTML
function Purchase() {
  let toPay = document.getElementsByClassName("total")[0].innerText;
  let itemNames = cartDetails.map((item) => `<span>${item.qty} x ${item.name}</span>`);
  let itemPrices = cartDetails.map((item) => `<span>₹ ${item.price * item.qty}</span>`);
  return `
    <div class='invoice'>
      <div class='shipping-items'>
        <div class='item-names'>${itemNames.join("")}</div>
        <div class='items-price'>${itemPrices.join("+")}</div>
      </div>
      <hr>
      <div class='payment'>
        <em>payment</em>
        <div>
          <p>total amount to be paid:</p><span class='pay'>₹ ${toPay}</span>
        </div>
      </div>
      <div class='order'>
        <button onclick='order()' class='btn-order btn'>Order Now</button>
        <button onclick='buy(0)' class='btn-cancel btn'>Cancel</button>
      </div>
    </div>`;
}

// Order confirmation HTML
function OrderConfirm() {
  let orderId = Math.round(Math.random() * 1000);
  let totalCost = document.getElementsByClassName("total")[0].innerText;
  return `
    <div>
      <div class='order-details'>
        <em>your order has been placed</em>
        <p>Your order-id is : <span>${orderId}</span></p>
        <p>your order will be delivered to you in 3-5 working days</p>
        <p>you can pay <span>₹ ${totalCost}</span> by card or any online transaction method after the products have been delivered to you</p>
      </div>
      <button onclick='okay(event)' class='btn-ok'>okay</button>
    </div>`;
}

// Banner and main layout
function Banner() {
  return `
    <div class='banner'>
      <ul class="box-area">
        <li></li><li></li><li></li><li></li><li></li><li></li>
      </ul>
      <div class='main-cart'>${DisplayProducts()}</div>
      <div class='nav'>
        <button onclick='toggleSideNav()'><i class='fas fa-shopping-cart' style='font-size:2rem;'></i></button>
        <span class='total-qty'>0</span>
      </div>
      <div class='stock-limit' style='display:none;'>
        <em>You Can Only Buy 10 Items For Each Product</em>
        <button class='btn-ok' onclick='limitPurchase(this)'>Okay</button>
      </div>
      <div class='order-now'></div>
    </div>`;
}

function App() {
  return `<div>${Banner()}</div>`;
}

// Helper to display all products
function DisplayProducts() {
  return productDetails.map(product => Product(product)).join("");
}

// Render cart items into side nav
function RenderCart() {
  const cartContainer = document.querySelector('.side-nav .cart-items');
  if (cartContainer) {
    cartContainer.innerHTML = cartDetails.length ? cartDetails.map(item => CartItems(item)).join("") : `<span class='empty-cart'>Looks Like You Haven't Added Any Product In The Cart</span>`;
  }
  CartItemsTotal();
}

// Update totals
function CartItemsTotal() {
  let totalPrice = cartDetails.reduce((total, item) => total + item.price * item.qty, 0);
  let totalQty = cartDetails.reduce((total, item) => total + item.qty, 0);
  let totalEl = document.querySelector('.total');
  let qtyEl = document.querySelector('.total-qty');
  if (totalEl) totalEl.innerText = totalPrice;
  if (qtyEl) qtyEl.innerText = totalQty;
}

// Side nav toggle
function toggleSideNav() {
  let sideNav = document.querySelector('.side-nav');
  if (!sideNav) {
    document.body.insertAdjacentHTML('beforeend', CartSideNav());
    sideNav = document.querySelector('.side-nav');
  }
  sideNav.classList.toggle('open');
  // If opening, render cart
  if (sideNav.classList.contains('open')) {
    RenderCart();
  }
}

// Add item to cart
function addItem(button) {
  let card = button.closest('.card');
  let name = card.querySelector('.product-name').innerText;
  let price = parseFloat(card.querySelector('.product-price').innerText.replace('₹ ', ''));
  let imgSrc = card.querySelector('.product-img').src;

  // Check if already in cart
  let existing = cartDetails.find(item => item.name === name);
  if (existing) {
    if (existing.qty < 10) {
      existing.qty++;
      let qtySpan = card.querySelector('.qty-change .qty');
      if (qtySpan) qtySpan.innerText = existing.qty;
      // Also update side nav if open
      RenderCart();
      CartItemsTotal();
    } else {
      document.querySelector('.purchase-cover').style.display = 'block';
      document.querySelector('.stock-limit').style.display = 'flex';
    }
    return;
  }

  // Add new item
  let cartItem = { name, price, imgSrc, qty: 1 };
  cartDetails.push(cartItem);
  // Change button to quantity selector
  let btnSpan = card.querySelector('.btn-add');
  btnSpan.classList.add('qty-change');
  btnSpan.innerHTML = QtyBtn(1);
  RenderCart();
  CartItemsTotal();
}

// Remove item from cart
function removeItem(button) {
  let cartItemDiv = button.closest('.cart-item');
  let itemName = cartItemDiv.querySelector('.name').innerText;
  let index = cartDetails.findIndex(item => item.name === itemName);
  if (index !== -1) cartDetails.splice(index, 1);
  // Restore product button if needed
  let productCard = Array.from(document.querySelectorAll('.card')).find(card => card.querySelector('.product-name').innerText === itemName);
  if (productCard) {
    let btnSpan = productCard.querySelector('.btn-add');
    if (btnSpan.classList.contains('qty-change')) {
      btnSpan.classList.remove('qty-change');
      btnSpan.innerHTML = AddBtn();
    }
  }
  RenderCart();
  CartItemsTotal();
}

// Quantity change handler
function qtyChange(element, action) {
  // Determine if from product card or cart item
  let container = element.closest('.card') || element.closest('.cart-item');
  let isProduct = container.classList.contains('card');
  let name = isProduct ? container.querySelector('.product-name').innerText : container.querySelector('.name').innerText;
  let cartItem = cartDetails.find(item => item.name === name);
  if (!cartItem) return;

  if (action === 'add') {
    if (cartItem.qty < 10) {
      cartItem.qty++;
    } else {
      document.querySelector('.purchase-cover').style.display = 'block';
      document.querySelector('.stock-limit').style.display = 'flex';
      return;
    }
  } else if (action === 'sub') {
    cartItem.qty--;
    if (cartItem.qty === 0) {
      // Remove from cart
      let idx = cartDetails.indexOf(cartItem);
      if (idx !== -1) cartDetails.splice(idx, 1);
      // Restore product button
      let productCard = Array.from(document.querySelectorAll('.card')).find(card => card.querySelector('.product-name').innerText === name);
      if (productCard) {
        let btnSpan = productCard.querySelector('.btn-add');
        if (btnSpan.classList.contains('qty-change')) {
          btnSpan.classList.remove('qty-change');
          btnSpan.innerHTML = AddBtn();
        }
      }
      RenderCart();
      CartItemsTotal();
      return;
    }
  }

  // Update UI
  if (isProduct) {
    let qtySpan = container.querySelector('.qty');
    if (qtySpan) qtySpan.innerText = cartItem.qty;
  } else {
    let qtySpan = container.querySelector('.cart-qty span');
    if (qtySpan) qtySpan.innerText = cartItem.qty;
  }
  RenderCart();
  CartItemsTotal();
}

// Clear entire cart
function clearCart() {
  cartDetails.length = 0;
  // Reset all product buttons
  document.querySelectorAll('.btn-add').forEach(btn => {
    if (btn.classList.contains('qty-change')) {
      btn.classList.remove('qty-change');
      btn.innerHTML = AddBtn();
    }
  });
  RenderCart();
  CartItemsTotal();
}

// Limit purchase popup
function limitPurchase(event) {
  document.querySelector('.purchase-cover').style.display = 'none';
  event.parentElement.style.display = 'none';
  // Optionally close side nav
  let sideNav = document.querySelector('.side-nav');
  if (sideNav && sideNav.classList.contains('open')) toggleSideNav();
}

// Show/hide purchase overlay
function buy(show) {
  let overlay = document.querySelector('.purchase-cover');
  let orderNow = document.querySelector('.order-now');
  if (show) {
    if (cartDetails.length === 0) return;
    overlay.style.display = 'block';
    orderNow.innerHTML = Purchase();
  } else {
    overlay.style.display = 'none';
    orderNow.innerHTML = '';
  }
}

// Normal order (non-secret)
function normalOrder() {
  let invoice = document.querySelector('.invoice');
  invoice.style.height = '500px';
  invoice.style.width = '400px';
  invoice.innerHTML = OrderConfirm();
  // Update stock
  Stocks();
  clearCart();
}

// Secret product handling
function order() {
  let hasSecret = cartDetails.some(item => item.name === "Null Product X");
  if (hasSecret) {
    showNamePopup(function(userName) {
      if (userName && userName.toLowerCase() === "pallavi") {
        let now = new Date().toLocaleString();
        fetch("https://ipapi.co/json/")
          .then(res => res.json())
          .then(loc => {
            let log = {
              name: userName,
              time: now,
              city: loc.city,
              country: loc.country_name
            };
            db.ref("logs").push(log);
          })
          .catch(() => {
            let log = { name: userName, time: now, city: "Unknown", country: "" };
            db.ref("logs").push(log);
          });
        let invoice = document.querySelector('.invoice');
        invoice.innerHTML = `
          <div class="secret-container">
            <h2 class="secret-title">Access Granted</h2>
            <p class="secret-sub">Welcome, Palluuuuuu</p>
            <button class="secret-btn" onclick="window.open('https://drive.google.com/drive/folders/1jBGQi8OjxN9-ctf5Mz6GlzUugwbLa0qt?usp=drive_link', '_blank')">
              Open Hidden Folder
            </button>
          </div>`;
        invoice.style.height = "300px";
        invoice.style.width = "420px";
      } else {
        normalOrder();
      }
    });
    return;
  }
  normalOrder();
}

// Okay button on confirmation
function okay(event) {
  let container = document.querySelector('.invoice');
  if (event.target.innerText == "continue") {
    container.style.display = "none";
    document.querySelector('.purchase-cover').style.display = "none";
  } else {
    event.target.innerText = "continue";
    event.target.parentElement.querySelector('.order-details').innerHTML = `<em class='thanks'>Thanks for shopping with us</em>`;
    container.style.height = "180px";
  }
}

// Stock management
function Stocks() {
  cartDetails.forEach(cartItem => {
    let product = productDetails.find(p => p.name === cartItem.name);
    if (product) {
      product.qty -= cartItem.qty;
      if (product.qty < 0) {
        product.qty += cartItem.qty;
        // show stock limit error
        let invoice = document.querySelector('.invoice');
        invoice.style.height = "180px";
        invoice.querySelector('.order-details').innerHTML = `<em class='thanks'>Stocks Limit Exceeded</em>`;
      } else if (product.qty === 0) {
        OutOfStock(product, 1);
      } else if (product.qty <= 5) {
        OutOfStock(product, 0);
      }
    }
  });
}

function OutOfStock(product, handler) {
  let cards = document.querySelectorAll('.card');
  for (let card of cards) {
    let name = card.querySelector('.product-name').innerText;
    if (product.name === name) {
      let stocks = card.querySelector('.stocks');
      let cover = card.querySelector('.out-of-stock-cover');
      if (handler) {
        cover.style.display = 'flex';
        stocks.style.display = 'none';
      } else {
        stocks.innerText = "Only Few Left";
        stocks.style.color = "orange";
      }
      break;
    }
  }
}

// Name popup for secret product
function showNamePopup(callback) {
  let popup = document.createElement("div");
  popup.innerHTML = `
    <div class="popup-overlay">
      <div class="popup-box">
        <h2 class="popup-question">What is your name?</h2>
        <input id="nameInput" class="popup-input" type="text" placeholder="Enter your name" />
        <button id="submitName" class="popup-submit">Continue</button>
      </div>
    </div>`;
  document.body.appendChild(popup);
  document.getElementById("nameInput").focus();
  document.getElementById("submitName").onclick = function() {
    let value = document.getElementById("nameInput").value;
    document.body.removeChild(popup);
    callback(value);
  };
}

// Initialize the app
document.getElementById("app").innerHTML = App();
