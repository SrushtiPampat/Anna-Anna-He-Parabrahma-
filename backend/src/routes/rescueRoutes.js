const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

// ==========================================
// IN-MEMORY DEMO DATA
// ==========================================

let rescueFood = [
    {
        id: "RF001",
        name: "Veg Manchurian",
        description: "Freshly prepared vegetable Manchurian.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
        originalPrice: 180,
        price: 90,
        quantity: 15,
        category: "Chinese",
        donor: "Mumbai Food Corner",
        supplierId: "SUP001",
        city: "Mumbai",
        address: "Andheri West, Mumbai",
        expiryTime: "Today, 9:00 PM",
        status: "available",
        sourceType: "rescue"
    },
    {
        id: "RF002",
        name: "Fresh Vegetable Pulao",
        description: "Freshly prepared vegetable pulao.",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600",
        originalPrice: 150,
        price: 75,
        quantity: 20,
        category: "Indian",
        donor: "Annapurna Restaurant",
        supplierId: "SUP002",
        city: "Pune",
        address: "FC Road, Pune",
        expiryTime: "Today, 8:30 PM",
        status: "available",
        sourceType: "rescue"
    },
    {
        id: "RF003",
        name: "Fresh Bread Pack",
        description: "Fresh bread packets available at discounted prices.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        originalPrice: 100,
        price: 40,
        quantity: 12,
        category: "Bakery",
        donor: "Daily Bake Bakery",
        supplierId: "SUP001",
        city: "Mumbai",
        address: "Dadar, Mumbai",
        expiryTime: "Today, 10:00 PM",
        status: "available",
        sourceType: "rescue"
    },
    {
        id: "RF004",
        name: "Vegetable Sandwich",
        description: "Fresh vegetable sandwiches.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
        originalPrice: 120,
        price: 60,
        quantity: 10,
        category: "Snacks",
        donor: "Green Cafe",
        supplierId: "SUP002",
        city: "Pune",
        address: "Kothrud, Pune",
        expiryTime: "Today, 7:30 PM",
        status: "available",
        sourceType: "rescue"
    }
];

let organizations = [
    {
        id: "NGO001",
        name: "Helping Hands Foundation",
        city: "Mumbai",
        contact: "helpinghands@example.org",
        verified: true
    },
    {
        id: "NGO002",
        name: "Food For Everyone",
        city: "Pune",
        contact: "foodforeveryone@example.org",
        verified: true
    },
    {
        id: "NGO003",
        name: "Hope Foundation",
        city: "Nagpur",
        contact: "hopefoundation@example.org",
        verified: true
    }
];

let donationRequests = [];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const validQuantity = (value) =>
    Number.isInteger(Number(value)) && Number(value) > 0;

const validPrice = (value) =>
    Number.isFinite(Number(value)) && Number(value) >= 0;

// ==========================================
// 1. CUSTOMER / PUBLIC FOOD LISTINGS
// ==========================================

// GET all available food
router.get("/food", (req, res) => {
    const { city, category } = req.query;

    let result = rescueFood.filter(
        food => food.status === "available" && food.quantity > 0
    );

    if (city) {
        result = result.filter(
            food => food.city.toLowerCase() === city.toLowerCase()
        );
    }

    if (category) {
        result = result.filter(
            food => food.category.toLowerCase() === category.toLowerCase()
        );
    }

    res.json({
        success: true,
        count: result.length,
        data: result
    });
});

// GET individual food
router.get("/food/:id", (req, res) => {
    const food = rescueFood.find(
        item => item.id === req.params.id
    );

    if (!food) {
        return res.status(404).json({
            success: false,
            message: "Food listing not found."
        });
    }

    res.json({
        success: true,
        data: food
    });
});

// ==========================================
// 2. SUPPLIER MANAGEMENT
// ==========================================

// POST - Add surplus food
router.post("/food", (req, res) => {
    const {
        name,
        description,
        image,
        originalPrice,
        price,
        quantity,
        category,
        donor,
        supplierId,
        city,
        address,
        expiryTime
    } = req.body;

    if (!name || !donor || !city ||
        price == null || quantity == null) {
        return res.status(400).json({
            success: false,
            message: "Name, donor, city, price and quantity are required."
        });
    }

    if (!validPrice(price) || !validQuantity(quantity)) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid price and positive whole-number quantity."
        });
    }

    if (
        originalPrice != null &&
        (!validPrice(originalPrice) ||
            Number(originalPrice) < Number(price))
    ) {
        return res.status(400).json({
            success: false,
            message: "Original price must be valid and at least the selling price."
        });
    }

    const newFood = {
        id: randomUUID(),
        name,
        description: description || "",
        image: image || "",
        originalPrice: Number(originalPrice ?? price),
        price: Number(price),
        quantity: Number(quantity),
        category: category || "Other",
        donor,
        supplierId: supplierId || null,
        city,
        address: address || "",
        expiryTime: expiryTime || "",
        status: "available",
        sourceType: "rescue"
    };

    rescueFood.push(newFood);

    res.status(201).json({
        success: true,
        message: "Surplus food added successfully.",
        data: newFood
    });
});

// GET - Supplier's own listings
router.get("/suppliers/:supplierId/food", (req, res) => {
    const listings = rescueFood.filter(
        food => food.supplierId === req.params.supplierId
    );

    res.json({
        success: true,
        count: listings.length,
        data: listings
    });
});

// PUT - Update a food listing
router.put("/food/:id", (req, res) => {
    const food = rescueFood.find(
        item => item.id === req.params.id
    );

    if (!food) {
        return res.status(404).json({
            success: false,
            message: "Food listing not found."
        });
    }

    const allowedFields = [
        "name",
        "description",
        "image",
        "originalPrice",
        "price",
        "quantity",
        "category",
        "donor",
        "city",
        "address",
        "expiryTime",
        "status"
    ];

    const updates = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    if (
        updates.price !== undefined &&
        !validPrice(updates.price)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid selling price."
        });
    }

    if (
        updates.quantity !== undefined &&
        (!Number.isInteger(Number(updates.quantity)) ||
            Number(updates.quantity) < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be zero or a positive whole number."
        });
    }

    if (updates.originalPrice !== undefined &&
        !validPrice(updates.originalPrice)) {
        return res.status(400).json({
            success: false,
            message: "Invalid original price."
        });
    }

    if (updates.price !== undefined) {
        updates.price = Number(updates.price);
    }

    if (updates.originalPrice !== undefined) {
        updates.originalPrice = Number(updates.originalPrice);
    }

    if (updates.quantity !== undefined) {
        updates.quantity = Number(updates.quantity);
    }

    Object.assign(food, updates);

    if (food.quantity === 0) {
        food.status = "unavailable";
    } else if (food.status === "unavailable") {
        food.status = "available";
    }

    res.json({
        success: true,
        message: "Food listing updated successfully.",
        data: food
    });
});

// DELETE - Remove a food listing
router.delete("/food/:id", (req, res) => {
    const index = rescueFood.findIndex(
        item => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Food listing not found."
        });
    }

    const food = rescueFood[index];

    const hasActiveRequest = donationRequests.some(
        request =>
            request.foodId === food.id &&
            request.status === "pending"
    );

    if (hasActiveRequest) {
        return res.status(409).json({
            success: false,
            message: "Cannot remove food with pending donation requests."
        });
    }

    rescueFood.splice(index, 1);

    res.json({
        success: true,
        message: "Food listing removed successfully."
    });
});

// ==========================================
// 3. NGO / ORGANIZATION MANAGEMENT
// ==========================================

// GET organizations
router.get("/organizations", (req, res) => {
    const { city } = req.query;

    let result = organizations.filter(
        organization => organization.verified
    );

    if (city) {
        result = result.filter(
            organization =>
                organization.city.toLowerCase() === city.toLowerCase()
        );
    }

    res.json({
        success: true,
        count: result.length,
        data: result
    });
});

// POST - Register organization
router.post("/organizations", (req, res) => {
    const { name, city, contact } = req.body;

    if (!name || !city || !contact) {
        return res.status(400).json({
            success: false,
            message: "Organization name, city and contact are required."
        });
    }

    const organization = {
        id: randomUUID(),
        name,
        city,
        contact,
        verified: false
    };

    organizations.push(organization);

    res.status(201).json({
        success: true,
        message: "Organization registered. Verification is pending.",
        data: organization
    });
});

// GET organization details
router.get("/organizations/:id", (req, res) => {
    const organization = organizations.find(
        item => item.id === req.params.id
    );

    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found."
        });
    }

    res.json({
        success: true,
        data: organization
    });
});

// ==========================================
// 4. NGO DONATION REQUESTS
// ==========================================

// POST - Request surplus food
router.post("/requests", (req, res) => {
    const { foodId, organizationId, quantity } = req.body;

    const food = rescueFood.find(
        item => item.id === foodId
    );

    const organization = organizations.find(
        item => item.id === organizationId && item.verified
    );

    if (!food || !organization) {
        return res.status(404).json({
            success: false,
            message: "Food or verified organization not found."
        });
    }

    if (food.status !== "available") {
        return res.status(409).json({
            success: false,
            message: "This food listing is unavailable."
        });
    }

    if (!validQuantity(quantity) ||
        Number(quantity) > food.quantity) {
        return res.status(400).json({
            success: false,
            message: "Invalid donation quantity."
        });
    }

    const request = {
        id: randomUUID(),
        foodId,
        foodName: food.name,
        supplierId: food.supplierId,
        supplierName: food.donor,
        organizationId,
        organizationName: organization.name,
        quantity: Number(quantity),
        status: "pending",
        createdAt: new Date().toISOString()
    };

    donationRequests.push(request);

    res.status(201).json({
        success: true,
        message: "Donation request submitted successfully.",
        data: request
    });
});

// GET all requests, optionally filter by supplier or NGO
router.get("/requests", (req, res) => {
    const { supplierId, organizationId, status } = req.query;

    let result = [...donationRequests];

    if (supplierId) {
        result = result.filter(
            request => request.supplierId === supplierId
        );
    }

    if (organizationId) {
        result = result.filter(
            request => request.organizationId === organizationId
        );
    }

    if (status) {
        result = result.filter(
            request => request.status === status
        );
    }

    res.json({
        success: true,
        count: result.length,
        data: result
    });
});

// ==========================================
// 5. SUPPLIER REQUEST MANAGEMENT
// ==========================================

// ACCEPT donation request
router.put("/requests/:id/accept", (req, res) => {
    const request = donationRequests.find(
        item => item.id === req.params.id
    );

    if (!request) {
        return res.status(404).json({
            success: false,
            message: "Donation request not found."
        });
    }

    if (request.status !== "pending") {
        return res.status(409).json({
            success: false,
            message: "This request has already been processed."
        });
    }

    const food = rescueFood.find(
        item => item.id === request.foodId
    );

    if (!food || food.status !== "available" ||
        food.quantity < request.quantity) {
        return res.status(409).json({
            success: false,
            message: "Insufficient available food quantity."
        });
    }

    food.quantity -= request.quantity;

    if (food.quantity === 0) {
        food.status = "unavailable";
    }

    request.status = "accepted";
    request.processedAt = new Date().toISOString();

    res.json({
        success: true,
        message: "Donation request accepted.",
        data: request
    });
});

// REJECT donation request
router.put("/requests/:id/reject", (req, res) => {
    const request = donationRequests.find(
        item => item.id === req.params.id
    );

    if (!request) {
        return res.status(404).json({
            success: false,
            message: "Donation request not found."
        });
    }

    if (request.status !== "pending") {
        return res.status(409).json({
            success: false,
            message: "This request has already been processed."
        });
    }

    request.status = "rejected";
    request.processedAt = new Date().toISOString();

    res.json({
        success: true,
        message: "Donation request rejected.",
        data: request
    });
});

module.exports = router;