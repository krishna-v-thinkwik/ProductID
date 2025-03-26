const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

function getMatchedProductIds(orderString, productsData) {
    const products = productsData.products;
    const productMap = new Map(products.map(product => [product.name.trim().toLowerCase(), product._id]));
    const orderItems = orderString.toLowerCase().split(/\band\b|,/).map(item => item.trim());
    const matchedProductIds = orderItems.map(item => productMap.get(item)).filter(id => id !== undefined);
    
    return matchedProductIds.length ? matchedProductIds.join("\n") : "No matching products found";
}

app.post("/match-products", (req, res) => {
    const { orderString, productsData } = req.body;
    
    if (!orderString || !productsData) {
        return res.status(400).json({ error: "orderString and productsData are required" });
    }

    const result = getMatchedProductIds(orderString, productsData);
    res.send(result);
});

app.get("/", (req, res) => {
    res.send("Match Products API is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
