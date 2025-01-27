"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPropertyData = processPropertyData;
async function processPropertyData(data) {
    const properties = [];
    // Process each property in the incoming data
    for (const item of data.properties || []) {
        try {
            const property = {
                title: item.title,
                price: Number(item.price),
                address: item.address,
                city: item.city,
                country: item.country,
                postalCode: item.postalCode,
                bedrooms: Number(item.bedrooms),
                bathrooms: Number(item.bathrooms),
                size: Number(item.size),
                images: Array.isArray(item.images) ? item.images : [],
                description: item.description,
                type: item.type,
                category: item.category,
                features: Array.isArray(item.features) ? item.features : [],
                datePosted: new Date().toISOString(),
                status: 'actief',
                makelaarId: item.makelaarId,
                featured: false
            };
            // Validate the property data
            if (validateProperty(property)) {
                properties.push(property);
            }
        }
        catch (error) {
            console.error('Error processing property:', error);
        }
    }
    return properties;
}
function validateProperty(property) {
    const requiredFields = [
        'title', 'price', 'address', 'city', 'country',
        'postalCode', 'bedrooms', 'bathrooms', 'size',
        'description', 'type', 'category'
    ];
    // Check required fields
    for (const field of requiredFields) {
        if (!property[field]) {
            return false;
        }
    }
    // Validate numeric fields
    if (isNaN(property.price) || property.price <= 0 ||
        isNaN(property.bedrooms) || property.bedrooms < 0 ||
        isNaN(property.bathrooms) || property.bathrooms < 0 ||
        isNaN(property.size) || property.size <= 0) {
        return false;
    }
    // Validate arrays
    if (!Array.isArray(property.images) || !Array.isArray(property.features)) {
        return false;
    }
    // Validate type and category
    const validTypes = ['koop', 'huur'];
    const validCategories = ['appartementen', 'huizen', 'vakantiewoningen', 'nieuwbouw'];
    if (!validTypes.includes(property.type) || !validCategories.includes(property.category)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=propertyProcessor.js.map