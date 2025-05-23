const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function getMatchedProductIds(orderString, productsData) {
    const products = productsData.products;
    const productMap = new Map(products.map(product => [product.name.trim().toLowerCase(), product._id]));

    // Replace commas with 'and' ensuring proper formatting
    const cleanedOrderString = orderString.replace(/,\s?(?!and)/g, " and ");
    console.log("Cleaned Order String:", cleanedOrderString); // Debugging

    // Extract order items and remove numbers
    const orderItems = cleanedOrderString.toLowerCase()
        .split(/\band\b/)
        .map(item => item.trim().replace(/^\d+\s*/, '')); // Remove leading numbers

    console.log("Order Items After Cleaning:", orderItems); // Debugging

    // Match products with basic plural handling
    const matchedProductIds = orderItems.map(item => {
        let productId = productMap.get(item);
        if (!productId) {
            // Try removing trailing 's' if it's plural
            const singularItem = item.endsWith('s') ? item.slice(0, -1).trim() : item;
            productId = productMap.get(singularItem);
        }
        return productId;
    }).filter(id => id !== undefined);

    console.log("Matched Product IDs:", matchedProductIds); // Debugging

    return matchedProductIds;
}

   

app.post("/match-products", (req, res) => {
    const { orderString, productsData } = req.body;
    
    if (!orderString || !productsData) {
        return res.status(400).json({ error: "orderString and productsData are required" });
    }

    const result = getMatchedProductIds(orderString, productsData);
    res.json({ productIds: result });
});

app.get("/", (req, res) => {
    res.send("Match Products API is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
