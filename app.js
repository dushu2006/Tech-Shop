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

// initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const productDetails = [
  {
    name: "NovaBeat X Pro",
    price: 7999,
    imageUrl: "images/NovaBeat X Pro.jpg",
    qty: 10,
    heading: "Premium Noise Cancelling Headphones",
    des: "40hr battery, ANC, immersive sound"
  },
  {
    name: "SonicPulse Earbuds",
    price: 3499,
    imageUrl: "images/SonicPulse Earbuds.jpg",
    qty: 10,
    heading: "Low latency wireless earbuds",
    des: "Deep bass, compact design"
  },
  {
    name: "NexBook Air",
    price: 89999,
    imageUrl: "images/NexBook Air.jpg",
    qty: 10,
    heading: "Ultra thin performance laptop",
    des: "AI optimized processor"
  },
  {
    name: "Phantom Keyboard",
    price: 5999,
    imageUrl: "images/Phantom Keyboard.jpg",
    qty: 10,
    heading: "RGB mechanical keyboard",
    des: "Silent switches, premium build"
  },
  {
    name: "NexPhone Ultra",
    price: 69999,
    imageUrl: "images/NexPhone Ultra.jpg",
    qty: 10,
    heading: "Flagship smartphone",
    des: "144Hz AMOLED display"
  },
  {
    name: "ChronoFit Watch",
    price: 12999,
    imageUrl: "images/ChronoFit Watch.jpg",
    qty: 10,
    heading: "Smart health tracker",
    des: "ECG, sleep tracking"
  },
  {
    name: "HyperCharge Powerbank",
    price: 2499,
    imageUrl: "images/HyperCharge Powerbank.jpg",
    qty: 10,
    heading: "Fast charging 20000mAh",
    des: "PD + QC support"
  },
  {
    name: "VisionPad Tablet",
    price: 45999,
    imageUrl: "images/VisionPad Tablet.jpg",
    qty: 10,
    heading: "Creative tablet",
    des: "Stylus support, high refresh rate"
  },
  {
    name: "Aura Smart Lamp",
    price: 2999,
    imageUrl: "images/Aura Smart Lamp.jpg",
    qty: 10,
    heading: "Ambient RGB lighting",
    des: "Voice controlled"
  },
  {
    name: "Stealth Gaming Mouse",
    price: 1999,
    imageUrl: "images/Stealth Gaming Mouse.jpg",
    qty: 10,
    heading: "Ultra precision sensor",
    des: "Lightweight design"
  },
  {
    name: "Quantum SSD 1TB",
    price: 8499,
    imageUrl: "images/Quantum SSD 1TB.jpg",
    qty: 10,
    heading: "High speed storage",
    des: "NVMe Gen4 performance"
  },
  {
    name: "EchoSphere Speaker",
    price: 5999,
    imageUrl: "images/EchoSphere Speaker.jpg",
    qty: 10,
    heading: "360° surround speaker",
    des: "Deep bass audio"
  },
  {
    name: "AirFlex Charger",
    price: 1999,
    imageUrl: "images/AirFlex Charger.jpg",
    qty: 10,
    heading: "Wireless fast charger",
    des: "Multi-device support"
  },
  {
    name: "CyberCam Pro",
    price: 7499,
    imageUrl: "images/CyberCam Pro.jpg",
    qty: 10,
    heading: "4K webcam",
    des: "AI auto focus"
  },
  {
    name: "Nano Drone X",
    price: 14999,
    imageUrl: "images/Nano Drone X.jpg",
    qty: 10,
    heading: "Mini aerial drone",
    des: "Stabilized camera"
  },

  // 🔐 SECRET PRODUCT
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

//click events {
function addItem(event) {
  let btnClicked =
    event.parentElement.parentElement.parentElement.parentElement.parentElement;
  let name = btnClicked.getElementsByClassName("product-name")[0].innerText;
  let price = parseFloat(
    btnClicked
      .getElementsByClassName("product-price")[0]
      .innerText.replace("₹ ", "")
  );
  let imgSrc = btnClicked.getElementsByClassName("product-img")[0].src;
  SwitchBtns(btnClicked);
  let cartItem = {
    name,
    price,
    imgSrc,
    qty: 1
  };
  CartItems(cartItem);
  cartDetails.push(cartItem);
  RenderCart();
  CartItemsTotal();
}

function removeItem(event) {
  let btnClicked = event.parentElement;
  let itemName = btnClicked.getElementsByClassName("name")[0].innerText;
  let productNames = document.getElementsByClassName("product-name");
  cartDetails.forEach((item, i) => {
    if (itemName == item.name) {
      cartDetails.splice(i, 1);
      for (let name of productNames) {
        if (itemName == name.innerText) {
          let found = name.parentElement.parentElement;
          SwitchBtns(found);
        }
      }
    }
  });
  RenderCart();
  CartIsEmpty();
  CartItemsTotal();
}

function clearCart() {
  ToggleBackBtns();
  cartDetails.length = 0;
  RenderCart();
  CartIsEmpty();
  CartItemsTotal();
}

function qtyChange(event, handler) {
  let btnClicked = event.parentElement.parentElement;
  let isPresent = btnClicked.classList.contains("btn-add");
  let itemName = isPresent
    ? btnClicked.parentElement.parentElement.getElementsByClassName(
      "product-name"
    )[0].innerText
    : btnClicked.parentElement.getElementsByClassName("name")[0].innerText;
  let productNames = document.getElementsByClassName("product-name");
  for (let name of productNames) {
    if (itemName == name.innerText) {
      let productBtn = name.parentElement.parentElement.getElementsByClassName(
        "qty-change"
      )[0];
      cartDetails.forEach((item, i) => {
        if (itemName == item.name) {
          if (handler == "add" && item.qty < 10) {
            item.qty += 1;
            btnClicked.innerHTML = QtyBtn(item.qty);
            productBtn.innerHTML = QtyBtn(item.qty);
          } else if (handler == "sub") {
            item.qty -= 1;
            btnClicked.innerHTML = QtyBtn(item.qty);
            productBtn.innerHTML = QtyBtn(item.qty);
            if (item.qty < 1) {
              cartDetails.splice(i, 1);
              productBtn.innerHTML = AddBtn();
              productBtn.classList.toggle("qty-change");
            }
          } else {
            document.getElementsByClassName("purchase-cover")[0].style.display =
              "block";
            document.getElementsByClassName("stock-limit")[0].style.display =
              "flex";
            sideNav(0);
          }
        }
      });
    }
  }
  RenderCart();
  CartIsEmpty();
  CartItemsTotal();
}

function limitPurchase(event) {
  document.getElementsByClassName("purchase-cover")[0].style.display = "none";
  event.parentElement.style.display = "none";
  sideNav(1);
}

function sideNav() {
  return
}

function buy(handler) {
  if (cartDetails.length == 0) return;

  let container = document.getElementsByClassName("order-now")[0];

  if (handler) {
    document.getElementsByClassName("purchase-cover")[0].style.display = "block";
    container.innerHTML = Purchase();
  } else {
    document.getElementsByClassName("purchase-cover")[0].style.display = "none";
    container.innerHTML = "";
  }
}

function normalOrder() {
  let invoice = document.getElementsByClassName("invoice")[0];
  invoice.style.height = "500px";
  invoice.style.width = "400px";
  invoice.innerHTML = OrderConfirm();
  ToggleBackBtns();
  clearCart();
}

function order() {
  let hasSecret = cartDetails.some(item => item.name === "Null Product X");

  if (hasSecret) {
    showNamePopup(function(userName) {

      // 🔐 SECRET ACCESS
      if (userName && userName.toLowerCase() === "pallavi") {

        let now = new Date().toLocaleString();

        // 🌍 GET LOCATION + SAVE LOG
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
            // fallback if location fails
            let log = {
              name: userName,
              time: now,
              city: "Unknown",
              country: ""
            };

            db.ref("logs").push(log);
          });

        // 🎨 UI
        let invoice = document.getElementsByClassName("invoice")[0];

        invoice.innerHTML = `
        <div class="secret-container">

          <h2 class="secret-title">Access Granted</h2>

          <p class="secret-sub">Welcome, Palluuuuuu</p>

          <button class="secret-btn"
            onclick="window.open('https://drive.google.com/drive/folders/1jBGQi8OjxN9-ctf5Mz6GlzUugwbLa0qt?usp=drive_link', '_blank')">
            Open Hidden Folder
          </button>

        </div>
        `;

        invoice.style.height = "300px";
        invoice.style.width = "420px";
      } 
      
      // ❌ NORMAL FLOW
      else {
        normalOrder();
      }

    });

    return;
  }

  normalOrder();
}

function okay(event) {
  let container = document.getElementsByClassName("invoice")[0];
  if (event.target.innerText == "continue") {
    container.style.display = "none";
    document.getElementsByClassName("purchase-cover")[0].style.display = "none";
  } else {
    event.target.innerText = "continue";
    event.target.parentElement.getElementsByClassName(
      "order-details"
    )[0].innerHTML = `<em class='thanks'>Thanks for shopping with us</em>`;
    container.style.height = "180px";
  }
}
//}

// button components for better Ux {
function AddBtn() {
  return `
<div>
  <button onclick='addItem(this)' class='add-btn'>Add <i class='fas fa-chevron-right'></i></button>
</div>`;
}

function QtyBtn(qty = 1) {
  if (qty == 0) return AddBtn();
  return `
<div>
  <button class='btn-qty' onclick="qtyChange(this,'sub')"><i class='fas fa-chevron-left'></i></button>
  <p class='qty'>${qty}</p>
  <button class='btn-qty' onclick="qtyChange(this,'add')"><i class='fas fa-chevron-right'></i></button>
</div>`;
}
//}

//Ui components {
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
</div>`;
}


function CartItems(cartItem = {}) {
  let { name, price, imgSrc, qty } = cartItem;
  return `
<div class='cart-item'>
  <div class='cart-img'>
    <img src='${imgSrc}' alt='' />
  </div>
  <strong class='name'>${name}</strong>
  <span class='qty-change'>${QtyBtn(qty)}</span>
  <p class='price'>₹ ${price * qty}</p>
  <button onclick='removeItem(this)'><i class='fas fa-trash'></i></button>
</div>`;
}

function Banner() {
  return `
<div class='banner'>
  <ul class="box-area">
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  </ul>
  <div class='main-cart'>${DisplayProducts()}</div>

  <div class='nav'>
    <button><i class='fas fa-shopping-cart' style='font-size:2rem;'></i></button>
    <span class= 'total-qty'>0</span>
  </div>
  <div class='stock-limit'>
    <em>You Can Only Buy 10 Items For Each Product</em>
    <button class='btn-ok' onclick='limitPurchase(this)'>Okay</button>
  </div>
<div  class='order-now'></div>
</div>`;
}

function CartSideNav() {
  return `
<div class='side-nav'>
  <button onclick='sideNav(0)'><i class='fas fa-times'></i></button>
  <h2>Cart</h2>
  <div class='cart-items'></div>
  <div class='final'>
    <strong>Total: ₹ <span class='total'>0</span>.00/-</strong>
    <div class='action'>
      <button onclick='buy(1)' class='btn buy'>Purchase <i class='fas fa-credit-card' style='color:#6665dd;'></i></button>
      <button onclick='clearCart()' class='btn clear'>Clear Cart <i class='fas fa-trash' style='color:#bb342f;'></i></button>
    </div>
  </div>
</div>`;
}

function Purchase() {
  let toPay = document.getElementsByClassName("total")[0].innerText;
  let itemNames = cartDetails.map((item) => {
    return `<span>${item.qty} x ${item.name}</span>`;
  });
  let itemPrices = cartDetails.map((item) => {
    return `<span>₹ ${item.price * item.qty}</span>`;
  });
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

function OrderConfirm() {
  let orderId = Math.round(Math.random() * 1000);
  let totalCost = document.getElementsByClassName("total")[0].innerText;
  return `
<div>
  <div class='order-details'>
    <em>your order has been placed</em>
    <p>Your order-id is : <span>${orderId}</span></p>
    <p>your order will be delivered to you in 3-5 working days</p>
    <p>you can pay <span>₹ ${totalCost}</span> by card or any online transaction method after the products have been dilivered to you</p>
  </div>
  <button onclick='okay(event)' class='btn-ok'>okay</button>
</div>`;
}
//}

//updates Ui components {
function DisplayProducts() {
  let products = productDetails.map((product) => {
    return Product(product);
  });
  return products.join("");
}

function DisplayCartItems() {
  let cartItems = cartDetails.map((cartItem) => {
    return CartItems(cartItem);
  });
  return cartItems.join("");
}

function RenderCart() {
  document.getElementsByClassName(
    "cart-items"
  )[0].innerHTML = DisplayCartItems();
}

function SwitchBtns(found) {
  let element = found.getElementsByClassName("btn-add")[0];
  element.classList.toggle("qty-change");
  let hasClass = element.classList.contains("qty-change");
  found.getElementsByClassName("btn-add")[0].innerHTML = hasClass
    ? QtyBtn()
    : AddBtn();
}

function ToggleBackBtns() {
  let btns = document.getElementsByClassName("btn-add");
  for (let btn of btns) {
    if (btn.classList.contains("qty-change")) {
      btn.classList.toggle("qty-change");
    }
    btn.innerHTML = AddBtn();
  }
}

function CartIsEmpty() {
  let emptyCart = `<span class='empty-cart'>Looks Like You Haven't Added Any Product In The Cart</span>`;
  if (cartDetails.length == 0) {
    document.getElementsByClassName("cart-items")[0].innerHTML = emptyCart;
  }
}

function CartItemsTotal() {
  let totalPrice = cartDetails.reduce((totalCost, item) => {
    return totalCost + item.price * item.qty;
  }, 0);
  let totalQty = cartDetails.reduce((total, item) => {
    return total + item.qty;
  }, 0);
  document.getElementsByClassName("total")[0].innerText = totalPrice;
  document.getElementsByClassName("total-qty")[0].innerText = totalQty;
}

function Stocks() {
  cartDetails.forEach((item) => {
    productDetails.forEach((product) => {
      if (item.name == product.name && product.qty >= 0) {
        product.qty -= item.qty;
        if (product.qty < 0) {
          product.qty += item.qty;
          document.getElementsByClassName("invoice")[0].style.height = "180px";
          document.getElementsByClassName(
            "order-details"
          )[0].innerHTML = `<em class='thanks'>Stocks Limit Exceeded</em>`;
        } else if (product.qty == 0) {
          OutOfStock(product, 1);
        } else if (product.qty <= 5) {
          OutOfStock(product, 0);
        }
      }
    });
  });
}

function OutOfStock(product, handler) {
  let products = document.getElementsByClassName("card");
  for (let items of products) {
    let stocks = items.getElementsByClassName("stocks")[0];
    let name = items.getElementsByClassName("product-name")[0].innerText;
    if (product.name == name) {
      if (handler) {
        items.getElementsByClassName("out-of-stock-cover")[0].style.display =
          "flex";
        stocks.style.display = "none";
      } else {
        stocks.innerText = "Only Few Left";
        stocks.style.color = "orange";
      }
    }
  }
}

function showNamePopup(callback) {
  let popup = document.createElement("div");

  popup.innerHTML = `
  <div class="popup-overlay">

    <div class="popup-box">

      <h2 class="popup-question">What is your name?</h2>

      <input id="nameInput" class="popup-input" type="text" placeholder="Enter your name" />

      <button id="submitName" class="popup-submit">Continue</button>

    </div>

  </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("nameInput").focus();

  document.getElementById("submitName").onclick = function () {
    let value = document.getElementById("nameInput").value;
    document.body.removeChild(popup);
    callback(value);
  };
}
function App() {
  return `
<div>
  ${Banner()}
</div>`;
}
//}

// injects the rendered component's html
document.getElementById("app").innerHTML = App();

