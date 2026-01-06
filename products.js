document.addEventListener("DOMContentLoaded", () => {

    let products = [];

    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeBtn");

    fetch("./Assets/data_product.json")
        .then(res => res.json())
        .then(data => {
            products = data.products;

            // Attach click listeners AFTER data loads
            document.querySelectorAll(".product-contain").forEach(card => {
                card.addEventListener("click", (e) => {
                    if (e.target.closest(".favorite")) return;

                    
                    const id = Number(card.dataset.id);
                    const product = products.find(p => p.data_id === id);

                    if (!product) {
                        console.warn("Product not found:", id);
                        return;
                    }

                    document.getElementById("infoName").textContent = product.name;
                    document.getElementById("calories").textContent = product.nutrition.calories_kcal;
                    document.getElementById("protein").textContent = product.nutrition.protein_g;
                    document.getElementById("carbs").textContent = product.nutrition.carbohydrates_g;
                    document.getElementById("sugars").textContent = product.nutrition.sugars_g;
                    document.getElementById("fat").textContent = product.nutrition.fat_g;
                    document.getElementById("fiber").textContent = product.nutrition.fiber_g;
                    document.getElementById("sodium").textContent = product.nutrition.sodium_mg;

                    overlay.style.display = "flex";
                });
            });
        })
        .catch(err => console.error("Failed to load products:", err));

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
    });

});

function openFrame() {
    document.getElementById("overlay").style.display = "flex";
}

function closeFrame() {
    document.getElementById("overlay").style.display = "none";
}
