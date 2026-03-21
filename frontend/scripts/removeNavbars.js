const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src/pages');

function removeNavbars(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            removeNavbars(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Remove imports
            content = content.replace(/import\s+Navbar\s+from\s+['"].*?Navbar['"];?\n?/g, '');
            
            // Remove component usages
            content = content.replace(/<Navbar\s*\/>\n?/g, '');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

removeNavbars(directoryPath);
console.log("Navbar removal complete.");
