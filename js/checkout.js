let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const checkoutForm = document.getElementById("checkoutForm");
const confirmBtn = document.getElementById("confirmBtn");

const TELEGRAM_WORKER_URL =
    "https://allam-motors-bot.seifalallam.workers.dev";

let total = 0;


/* =========================
   عرض الطلب
========================= */

function displayOrder() {

    orderItems.innerHTML = "";

    total = 0;


    if (cart.length === 0) {

        orderItems.innerHTML = `
            <div class="empty-message">

                <h3>
                    🛒 السلة فارغة
                </h3>

                <a href="products.html">
                    العودة للمنتجات
                </a>

            </div>
        `;

        orderTotal.textContent = "0";

        confirmBtn.disabled = true;

        return;
    }


    confirmBtn.disabled = false;


    cart.forEach(function(item) {

        const product = products.find(
            p => p.id === item.id
        );


        if (!product) {
            return;
        }


        const itemTotal =
            product.price * item.quantity;


        total += itemTotal;


        const div =
            document.createElement("div");


        div.className =
            "order-item";


        div.innerHTML = `

            <span>
                ${product.name}
                × ${item.quantity}
            </span>

            <strong>
                ${itemTotal.toLocaleString()}
                جنيه
            </strong>

        `;


        orderItems.appendChild(div);

    });


    orderTotal.textContent =
        total.toLocaleString();

}


/* =========================
   إرسال الطلب
========================= */

checkoutForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert("السلة فارغة!");

            return;
        }


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();


        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();


        const governorate =
            document
                .getElementById("governorate")
                .value;


        const address =
            document
                .getElementById("address")
                .value
                .trim();


        const notes =
            document
                .getElementById("notes")
                .value
                .trim();


        /* =========================
           التحقق من البيانات
        ========================= */

        if (
            !name ||
            !phone ||
            !governorate ||
            !address
        ) {

            alert(
                "من فضلك املأ جميع البيانات المطلوبة."
            );

            return;
        }


        /* =========================
           تجهيز المنتجات
        ========================= */

        let productsText = "";


        cart.forEach(function(item) {

            const product =
                products.find(
                    p => p.id === item.id
                );


            if (!product) {
                return;
            }


            const itemTotal =
                product.price * item.quantity;


            productsText +=
                `• ${product.name} × ${item.quantity} = ${itemTotal.toLocaleString()} جنيه\n`;

        });


        /* =========================
           تجهيز الطلب
        ========================= */

        const order = {

            name: name,

            phone: phone,

            address:
                governorate +
                " - " +
                address,

            notes: notes,

            products: productsText,

            total:
                total.toLocaleString() +
                " جنيه"

        };


        /* =========================
           زر الإرسال
        ========================= */

        confirmBtn.disabled = true;

        confirmBtn.textContent =
            "جاري إرسال الطلب...";


        try {

            const response =
                await fetch(
                    TELEGRAM_WORKER_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(order)
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Worker Error"
                );

            }


            /* =========================
               نجاح الإرسال
            ========================= */

            alert(
                "✅ تم إرسال الطلب بنجاح!"
            );


            /* تفريغ السلة */

            localStorage.removeItem(
                "cart"
            );


            cart = [];


            /* العودة للرئيسية */

            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Telegram Error:",
                error
            );


            alert(
                "❌ حصلت مشكلة في إرسال الطلب. حاول مرة أخرى."
            );


            confirmBtn.disabled = false;

            confirmBtn.textContent =
                "تأكيد الطلب";

        }

    }
);


/* =========================
   تشغيل الصفحة
========================= */

displayOrder();
