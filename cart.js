// ====================
// GLOBAL VARIABLES
// ====================
let products = [];      // products array
let currentIndex = 0;   // currentIndex flag
let cart = [];          // cart array

// Elements
const slide = document.getElementById("slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const cartContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const nutritionInfo = document.getElementById("nutrion-info");

// Load cart from localStorage
cart = JSON.parse(localStorage.getItem("cart")) || []; // this loads the cart from the browser's local storage. This is a global cart empty array

// function call to displayCart
displayCart()

// ====================
// FETCH PRODUCTS
// ====================
fetch("./Assets/data_product.json")
  .then(res => res.json())
  .then(data => {
    // Initialize products and set inCart based on saved cart
    products = data.products.map(p => ({
      ...p,
      inCart: cart.some(c => c.id === p.data_id.toString()) // creating a property inCart for the products and set it to true, if that product is already in the cart; otherwise, set it to false

      /*
        .some() --> array method
                - it checks if at least one element in the array passes a test; where in this case, if the id matches data_id
                - [1, 2, 3].some(n => n > 2) // true, because 3 exists
                - [1, 2, 3].some(n => n > 5) // false, no 5
      */
    }));
    renderSlide(currentIndex);  //currentIndex is passed into renderSlide as a parameter
    renderProductList();        //triggering function
    displayCart();              // triggering function
  });

// ====================
// RENDER SLIDER
// ====================
function renderSlide(index) {
  const product = products[index]; // whatever's the 
  if (!product) return; // if product is empty, then return

  slide.style.opacity = 0;

  setTimeout(() => { // this is for the transition time
    //creating an inner html
    slide.innerHTML = `
      <div class="add-btn">
        <img src="${product.inCart ? './Assets/added_to_cart.svg' : './Assets/not_added_to_cart.svg'}">
      </div>
      <div class="inner-productBX">
        <div class="product-img">
          <img src="${product.img}">
        </div>
        <div class="product-price">
          <p>₱${product.price}</p>
          <p>${product.serving}ml</p>
        </div>
      </div>
      <div class="inner-productinfoBX">
        <div class="product-name"><p>${product.name}</p></div>
        <div class="product-info"><p>${product.product_description}</p></div>
      </div>
    `;

    // another html for the nutrionInfo
    nutritionInfo.innerHTML = `
      <p class = "Title">Nutrition Facts</p>
      <div class = "nutri-arrange">
        <div><p>Serving Size</p></div>
        <div ><p>${product.serving}ml</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>(Amount per serving)</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Calories</p></div>
        <div><p>${product.nutrition.calories_kcal}kcal</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>(Daily Value)</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Protein</p></div>
        <div><p>${product.nutrition.protein_g} g</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Carbohydrates</p></div>
        <div><p>${product.nutrition.carbohydrates_g} g</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Sugars</p></div>
        <div><p>${product.nutrition.sugars_g} g</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Fat</p></div>
        <div><p>${product.nutrition.fat_g} g</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Fiber</p></div>
        <div><p>${product.nutrition.fiber_g} g</p></div>
      </div>
      <div class = "nutri-arrange">
        <div><p>Sodium</p></div>
        <div><p>${product.nutrition.sodium_mg} mg</p></div>
      </div>
    `;

    // this is for the add to cart
    const addBtn = slide.querySelector(".add-btn");

    // if the cart gets clicked
    addBtn.onclick = () => {
      const itemIndex = cart.findIndex(item => item.id === product.data_id.toString());

      if (itemIndex > -1) {
        // Remove from cart
        cart.splice(itemIndex, 1);
        product.inCart = false;
      } else {
        // Add to cart
        cart.push({
          id: product.data_id.toString(),
          name: product.name,
          price: Number(product.price),
          quantity: 1
        });
        product.inCart = true;
      }

      // this gets remembered
      localStorage.setItem("cart", JSON.stringify(cart));
      // passing the currrentIndex to the renderSlide
      renderSlide(currentIndex);
      // triggering the renderProductList
      renderProductList();
      // updating the displayCart
      displayCart()
    };

    slide.style.opacity = 1;
  }, 200);
}

// ====================
// NEXT / PREV BUTTONS
// ====================
nextBtn.addEventListener("click", () => {
  if (currentIndex < products.length - 1) {
    // updating the currentIndex
    currentIndex++;
    // passing that as a parameter to renderSlide
    renderSlide(currentIndex);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    // updating the currentIndex
    currentIndex--;
    //passing that as a parameter to renderSlide
    renderSlide(currentIndex);
  }
});

// ====================
// RENDER PRODUCT LIST
// ====================
function renderProductList() {
  // finding the element with an id "product-list" and store it to const product list
  const productList = document.getElementById("product-list");
  // if it's empty then return
  if (!productList) return;


  productList.innerHTML = ""; //erasing everything inside the productlist element

  // for every product it has its respective information
  products.forEach(product => {
    const div = document.createElement("div"); // creating a new div element in memory, this exist in JavaScript for now
    /*
      document -> represents the entire html page
      .createElement("div") -> tells the browser to make a new HTML element of type div
      const div -> this is where the newly created element is stored
    */
    div.className = "product-contain";  // the class name is also called product-contain
    div.dataset.id = product.data_id; // assigning the product.data_id
    div.dataset.name = product.name;  // assigning the product.name
    div.dataset.price = product.price; // assigning the product.price

    div.innerHTML = `
      <div class="display_product">
        <div class="favorite" onclick="toggleCart(event, this)">
          <img src="${product.inCart ? './Assets/added_to_cart.svg' : './Assets/not_added_to_cart.svg'}"> 
        </div>
        <div class="product-img">
          <img src="${product.img}">
        </div>
        <div class="Price">
          <p>₱${product.price}</p>
          <p>${product.serving}ml</p>
        </div>
      </div>
      <div class="product-info">
        <div class="product_name"><p>${product.name}</p></div>
        <div class="description"><p>${product.product_description}</p></div>
      </div>
    `;

    productList.appendChild(div); // creating and appending to productlist
  });
}

// ====================
// TOGGLE CART FROM PRODUCT LIST
// ====================
function toggleCart(event, element) {
  const productDiv = element.closest(".product-contain"); //element that is closest to .product-contain in HTML page is stored in productDiv
  const productId = productDiv.dataset.id;  // assigning productId

  // finding the data_id (converted to Number because this is from HTML)that is identical to productId
  const product = products.find(p => p.data_id.toString() === productId);
    // finding if the index is in the cart
  const itemIndex = cart.findIndex(item => item.id === productId);

  // if it exists, then it is removed (this means that the user changed their mind in adding to cart the item)
  if (itemIndex > -1) {
    cart.splice(itemIndex, 1);
    product.inCart = false; // setting the inCart for this specific index to be false
  } else {
    // otherwise, it is pushed in the cart to be displayed in displayCart
    cart.push({
      id: product.data_id.toString(),
      name: product.name,
      price: Number(product.price),
      quantity: 1
    });
    product.inCart = true;
  }

  // this is to be remembered in the local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  //passing the currentIndex to renderSlide, so that the cart icon for that specific product is updated
  renderSlide(currentIndex);
  // triggering renderProductList
  renderProductList();
  // triggering displayCart
  displayCart()
}

// ====================
// DISPLAY CART
// ====================
function displayCart() {
  
  // getting the element by id "cart-items" from cart.html
  document.getElementById("cart-items")
    // getting the element ids and assigning it to const variables
    const cartContainer = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");

    // if the two ids are non-existent then it returns nothing
    if (!cartContainer || !cartTotalEl) return;

    // erasing whatever's been written in cartContainer
    cartContainer.innerHTML = "";
    
    // if the cart is empty and the cart.length is zero
    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty</p>";
        cartTotalEl.textContent = "0";
        return;
    }

    let total = 0;

    // this is for the cart sheet
    cart.forEach(item => {
        total += item.price * item.quantity;

        // creating a div component, naming it cart-item
        const div = document.createElement("div");
        div.className = "cart-item";

        // for every item being added to cart, a new div is created
        div.innerHTML = `
            <div class="cart_item_disp">
                <div><p>${item.name}</p></div>
                <div class="quantity-controls">
                    <button class="minus-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="plus-btn">+</button>
                </div>
            </div>
            <div class="price-or-remove">
                <div><p>₱<span class="item-total">${item.price * item.quantity}</span></p></div>
                <div><button class="remove-btn">Remove</button></div>
            </div>
        `;
        // this adds to the list
        cartContainer.appendChild(div);

        // Minus button
        div.querySelector(".minus-btn").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // creating a new cart that contains all items except the one whose id matches item.id, this removes an item from the cart
                cart = cart.filter(p => p.id !== item.id);

                const prod = products.find(p => p.data_id.toString() === item.id);
                // turning the inCart to false
                if (prod) prod.inCart = false;
            }
            //this gets remembered
            localStorage.setItem("cart", JSON.stringify(cart));
            // updating displaycart()
            displayCart();
        });

        // Plus button
        div.querySelector(".plus-btn").addEventListener("click", () => {
            // quantity is being incremented
            item.quantity++;
            //this gets remembered
            localStorage.setItem("cart", JSON.stringify(cart));
            // updating displayCart()
            displayCart();
        });

        // Remove button
        div.querySelector(".remove-btn").addEventListener("click", () => {
            // removing the item
            cart = cart.filter(p => p.id !== item.id);
            const prod = products.find(p => p.data_id.toString() === item.id);
            // turning it to false
            if (prod) prod.inCart = false;
            // this gets remembered by the cart local storage
            localStorage.setItem("cart", JSON.stringify(cart));
            // updating displayCart()
            displayCart();
        });
    });

    // total price
    cartTotalEl.textContent = total;
}


// ====================
// CHECKOUT FUNCTION
// ====================
function checkout() {
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Thank you for your purchase! Total: ₱${total}`);

  cart = [];
  products.forEach(p => p.inCart = false);
  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();
  renderSlide(currentIndex);
  renderProductList();
}


