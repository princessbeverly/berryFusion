// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ====================
// TOGGLE CART ICON & LOCAL STORAGE
// ====================
function toggleCart(event, element) {
    event.stopPropagation();

    const product = element.closest(".product-contain");
    const itemIndex = cart.findIndex(p => p.id === product.dataset.id);

    if (itemIndex > -1) {
        // If already in cart, increase quantity by 1
        cart[itemIndex].quantity++;
    } else {
        // Add new item with quantity 1
        cart.push({
            id: product.dataset.id,
            name: product.dataset.name,
            price: Number(product.dataset.price),
            quantity: 1
        });
    }

    const favImg = element.querySelector("img");
    if (favImg) favImg.src = "./Assets/added_to_cart.svg";

    localStorage.setItem("cart", JSON.stringify(cart));
    syncIcons();
}


// ====================
// SYNC CART ICONS ON PRODUCT PAGE
// ====================
function syncIcons() {
    document.querySelectorAll(".product-contain").forEach(product => {
        const id = product.dataset.id;
        const favImg = product.querySelector(".favorite img");
        if (!favImg) return;

        const inCart = cart.find(p => p.id === id);
        favImg.src = inCart ? "./Assets/added_to_cart.svg" : "./Assets/not_added_to_cart.svg";
    });
}

// ====================
// DISPLAY CART ITEMS ON CART PAGE
// ====================
function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");

    if (!cartContainer || !cartTotalEl) return;

    cartContainer.innerHTML = "";

    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty</p>";
        cartTotalEl.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity; // account for quantity

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class = "cart_item_disp">
                <div>
                    <p>${item.name}</p>
                </div>
                <div class="quantity-controls">
                    <button class="minus-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="plus-btn">+</button>
                </div>
            </div>
            
            <div class = "price-or-remove">
                <div>
                <p>₱<span class="item-total">${item.price * item.quantity}</span></p>
                </div>
                <div>
                <button class="remove-btn">Remove</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(div);

        // Minus button
        div.querySelector(".minus-btn").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // Remove if quantity reaches 0
                cart = cart.filter(p => p.id !== item.id);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            syncIcons();
        });

        // Plus button
        div.querySelector(".plus-btn").addEventListener("click", () => {
            item.quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            syncIcons();
        });

        // Remove button
        div.querySelector(".remove-btn").addEventListener("click", () => {
            cart = cart.filter(p => p.id !== item.id);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            syncIcons();
        });
    });

    cartTotalEl.textContent = total;
}


// ====================
// CHECKOUT FUNCTION
// ====================
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(`Thank you for your purchase! Total: ₱${cart.reduce((a,b)=>a+b.price,0)}`);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    syncIcons();
}

// ====================
// INITIALIZE ON PAGE LOAD
// ====================
document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    syncIcons();    // Update icons on index.html
    displayCart();  // Display cart items on cart.html
});
