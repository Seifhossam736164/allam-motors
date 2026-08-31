const products = [

{
    id: 1,
    name: "Yamaha R15 V4",
    price: 195000,
    category: "motorcycles",
    brand: "Yamaha",

    images: [
        "images/r15-1.jpg",
        "images/r15-2.jpg",
        "images/r15-3.jpg",
        "images/r15-4.jpg"
    ],

    description: "موتور رياضي 155cc مناسب للاستخدام اليومي والسفر.",

    specs: {
        model: "2026",
        engine: "155 CC",
        gearbox: "6 سرعات",
        color: "أزرق",
        condition: "جديد"
    }
},

{
    id: 2,
    name: "Honda CBR 250R",
    price: 210000,
    category: "motorcycles",
    brand: "Honda",

    images: [
        "images/cbr-1.jpg",
        "images/cbr-2.jpg",
        "images/cbr-3.jpg"
    ],

    description: "موتور رياضي قوي واقتصادي.",

    specs: {
        model: "2026",
        engine: "250 CC",
        gearbox: "6 سرعات",
        color: "أحمر",
        condition: "جديد"
    }
}

];

const TELEGRAM_WORKER_URL =
    "https://allam-motors-bot.seifalallam.workers.dev";

async function sendOrderToTelegram(order) {

    const message = `
🏍️ طلب جديد من علام موتورز

👤 الاسم: ${order.name}
📱 الهاتف: ${order.phone}
📍 العنوان: ${order.address}

🛒 المنتجات:
${order.products}

💰 الإجمالي: ${order.total} جنيه
`;

    try {

        const response = await fetch(TELEGRAM_WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: order.name,
                phone: order.phone,
                address: order.address,
                products: order.products,
                total: order.total
            })
        });

        if (!response.ok) {
            throw new Error("Telegram Worker Error");
        }

        return true;

    } catch (error) {

        console.error(error);
        return false;

    }
    }
