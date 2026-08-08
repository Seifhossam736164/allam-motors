const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

let total = 0;

if (cart.length === 0) {

    orderItems.innerHTML = `
        <div class="empty-message">
            <h3>السلة فارغة 🛒</h3>

            <p>
                لازم تضيف منتج للسلة الأول.
            </p>

            <a href="products.html">
                تصفح المنتجات
            </a>
        </div>
    `;

} else {

    cart.forEach(function(item) {

        const product = products.find(function(p) {
            return p.id === item.id;
        });

        if (!product) return;

        const itemTotal =
            product.price * item.quantity;

        total += itemTotal;

        const itemElement =
            document.createElement("div");

        itemElement.className = "order-item";

        itemElement.innerHTML = `
            <span>
                ${product.name}
                × ${item.quantity}
            </span>

            <span>
                ${itemTotal.toLocaleString()} جنيه
            </span>
        `;

        orderItems.appendChild(itemElement);

    });

}

orderTotal.textContent =
    total.toLocaleString();


// ==========================
// تأكيد الطلب
// ==========================

const checkoutForm =
    document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("السلة فارغة!");

        return;

    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const governorate =
        document.getElementById("governorate").value;

    const address =
        document.getElementById("address").value.trim();

    const notes =
        document.getElementById("notes").value.trim();


    if (
        !customerName ||
        !customerPhone ||
        !governorate ||
        !address
    ) {

        alert("من فضلك املأ البيانات المطلوبة.");

        return;

    }


    const order = {

        id: Date.now(),

        customer: {

            name: customerName,

            phone: customerPhone,

            governorate: governorate,

            address: address,

            notes: notes

        },

        products: cart,

        total: total,

        date: new Date().toLocaleString("ar-EG")

    };


    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    localStorage.removeItem("cart");


    alert(
        "تم تسجيل طلبك بنجاح ✅"
    );


    window.location.href =
        "index.html";

});
