let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cartContainer");

const totalElement = document.getElementById("cartTotal");


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function displayCart() {

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">

                <h2>🛒 السلة فارغة</h2>

                <p>
                    لم تقم بإضافة أي منتجات بعد.
                </p>

                <a href="products.html">
                    تصفح المنتجات
                </a>

            </div>
        `;

        totalElement.textContent = "0";

        return;

    }


    let total = 0;


    cart.forEach(function(item, index) {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product) return;


        const itemTotal =
            product.price * item.quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${product.images[0]}"
                alt="${product.name}"
            >

            <div class="cart-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    السعر:
                    ${product.price.toLocaleString()}
                    جنيه
                </p>

                <div class="quantity">

                    <button class="minus">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button class="plus">
                        +
                    </button>

                </div>

                <h4>
                    الإجمالي:
                    ${itemTotal.toLocaleString()}
                    جنيه
                </h4>

                <button class="remove">
                    🗑️ حذف
                </button>

            </div>

        `;


        cartItem
            .querySelector(".minus")
            .onclick = function() {

                if (item.quantity > 1) {

                    item.quantity--;

                } else {

                    cart.splice(index, 1);

                }

                saveCart();

                displayCart();

            };


        cartItem
            .querySelector(".plus")
            .onclick = function() {

                item.quantity++;

                saveCart();

                displayCart();

            };


        cartItem
            .querySelector(".remove")
            .onclick = function() {

                cart.splice(index, 1);

                saveCart();

                displayCart();

            };


        container.appendChild(cartItem);

    });


    totalElement.textContent =
        total.toLocaleString();

}


displayCart();
const checkoutBtn =
    document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function() {

        if (cart.length === 0) {

            alert("السلة فارغة!");

            return;

        }

        window.location.href =
            "checkout.html";

    });

}
