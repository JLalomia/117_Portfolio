const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { url } = require('./src/helpers/urlHelper');
const routes = require('./src/routes');

const inputDir = path.join(__dirname, 'views');
const outputDir = path.join(__dirname, 'docs');

// Create output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

function replaceLinks(html) {
    return html.replace(/href="\/([\w-]+)"/g, (match, routeName) => {
        const resolvedUrl = url(routeName); // No reassignment here
        return `href="${resolvedUrl}"`;
    });
}

// Recursively read files in a directory
function renderEJSTemplates(dir, basePath) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.relative(inputDir, filePath);
        const outputFilePath = path.join(outputDir, relativePath.replace('.ejs', '.html'));

        if (fs.statSync(filePath).isDirectory()) {
            // Recursively create subdirectories
            fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
            renderEJSTemplates(filePath, basePath);
        } else if (file.endsWith('.ejs')) {
            try {
                // Read and render the EJS file
                const template = fs.readFileSync(filePath, 'utf-8');
                const html = ejs.render(template, {
                    url: (name, params) =>{
                        const result = url(name, params);
                        console.log(`Generated URL for ${name}: ${result}`); // Debugging
                        return result;
                    },
                    currentPage: path.basename(file, '.ejs'), // Default currentPage based on filename
                }, { views: [inputDir] }); // Set views to resolve includes from the inputDir

                //html = replaceLinks(html);
                let processedHtml = replaceLinks(html); 
                
                // Write rendered HTML to output directory
                fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
                fs.writeFileSync(outputFilePath, processedHtml);
                console.log(`Rendered: ${relativePath} -> ${outputFilePath}`);
            } catch (err) {
                console.error(`Error rendering ${relativePath}:`, err.message);
            }
        }
    });
}

// Start rendering process
renderEJSTemplates(inputDir, inputDir);