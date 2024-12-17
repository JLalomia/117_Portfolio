// src/helpers/urlHelper.js

const routes = require('../routes');

/**
 * Generates a URL based on the route name and parameters.
 * @param {string} name - The name of the route.
 * @param {Object} [params={}] - An object containing route parameters.
 * @returns {string} - The URL path corresponding to the route name and parameters.
 */
function url(name, params = {}) {
    let path = routes[name];
    if (!path) {
        throw new Error(`Route name "${name}" not found in route registry.`);
    }

    // Replace route parameters with actual values
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, encodeURIComponent(value));
    }

    return path;
}

module.exports = { url };