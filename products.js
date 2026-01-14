/*
    Document Object Model (DOM) API represents the HTML document as a network of connected nodes that form a tree-like structure.

    DOMContentLoaded is under DOM API.
    This is used in order for the following to function seamlessly:
        - Click listeners are detected
        - Errors are detected. (Easy debugging)
    
    Event Listeners are dependent on DOM elements.

*/
document.addEventListener("DOMContentLoaded", () => {

    let products = []; // initializing products as an array

    // finding overlay element, and store a reference to it in overlay/closeBtn variable
    const overlay = document.getElementById("overlay"); 
    const closeBtn = document.getElementById("closeBtn");

    // fetching data from data_product.json
    fetch("./Assets/data_product.json") // 1. requesting a file (or API endpoint)
        .then(res => res.json())        // 2. converting raw data into a JavaScript object
                                        // 2.1 Parses JSON text --> convert it to JavaScript Object
        .then(data => {                 // 3. JSON has been successfully converted to JavaScript Object
            products = data.products;   // 3.1 Storing it in the products array

            // Attach click listeners AFTER data loads
            document.querySelectorAll(".product-contain").forEach(card => { // Finding all elements on the page that have the class product-contain, then go through each one of them one by one and implement the following actions
                card.addEventListener("click", (e) => { // when a card is clicked, a floating table shows up
                    if (e.target.closest(".favorite")) return;  // so that when we click the cart icon, the floating table doesn't appear
                    // event object target closes to class favorite
                    // e in this case doesn't have to be e
                    
                    const id = Number(card.dataset.id); // converting dataset.id to number and store it to id
                                                        // this comes from the html document <div data-id="1">

                    const product = products.find(p => p.data_id === id); // finding data_id from products array that matches id

                    // error handling
                    if (!product) {
                        console.warn("Product not found:", id);
                        return;
                    }

                    // finding the html element by id, and replace whatever text is inside it with product.___
                    document.getElementById("infoName").textContent = product.name;
                    document.getElementById("calories").textContent = product.nutrition.calories_kcal;
                    document.getElementById("protein").textContent = product.nutrition.protein_g;
                    document.getElementById("carbs").textContent = product.nutrition.carbohydrates_g;
                    document.getElementById("sugars").textContent = product.nutrition.sugars_g;
                    document.getElementById("fat").textContent = product.nutrition.fat_g;
                    document.getElementById("fiber").textContent = product.nutrition.fiber_g;
                    document.getElementById("sodium").textContent = product.nutrition.sodium_mg;

                    overlay.style.display = "flex"; // flexbox container making the overlay visible
                                                    // it makes the element appear on the paage using Flexbox layout
                });
            });
        })
        .catch(err => console.error("Failed to load products:", err)); // .catch() runs only if the promise fails (an error occurs)

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none"; 
        /*
            elementName.style -> this allows change inline CSS for elementName
            display properties are the following:
                - block
                - flex
                - inline
                - none
        */
    });

});

function openFrame() {
    document.getElementById("overlay").style.display = "flex";
}

function closeFrame() {
    document.getElementById("overlay").style.display = "none";
}

