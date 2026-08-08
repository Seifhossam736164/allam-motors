const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find(function(item) {
    return item.id === productId;
});

if (!product) {

    document.querySelector(".details").innerHTML = `
        <h2 style="text-align:center;">
            المنتج غير موجود
        </h2>
    `;

} else {

    document.getElementById("productName").textContent =
        product.name;

    document.getElementById("productPrice").textContent =
        product.price.toLocaleString() + " جنيه";

    document.getElementById("productDescription").textContent =
        product.description;

    const mainImage =
        document.getElementById("mainImage");

    mainImage.src = product.images[0];

    mainImage.alt = product.name;

    const thumbnails =
        document.getElementById("thumbnails");

    thumbnails.innerHTML = "";

    product.images.forEach(function(image) {

        const img = document.createElement("img");

        img.src = image;
        img.alt = product.name;

        img.addEventListener("click", function() {
            mainImage.src = image;
        });

        thumbnails.appendChild(img);

    });

    const specs =
        document.getElementById("productSpecs");

    specs.innerHTML = "";

    for (const key in product.specs) {

        const li = document.createElement("li");

        li.textContent = product.specs[key];

        specs.appendChild(li);

    }

}
// ==========================
// 🛒 إضافة المنتج إلى السلة
// ==========================

const addToCartButton =
    document.getElementById("addToCart");

if (addToCartButton) {

    addToCartButton.addEventListener("click", function() {

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct =
            cart.find(item => item.id === product.id);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                id: product.id,

                quantity: 1

            });

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert("تمت إضافة المنتج إلى السلة 🛒");

    });

}
