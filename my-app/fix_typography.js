const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);

files.forEach(file => {
    const absolutePath = path.resolve(file);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        return;
    }

    let content = fs.readFileSync(absolutePath, 'utf8');

    // Typography standardization rules
    const replacements = [
        [/text-\[10px\]/g, 'text-[12px]'],
        [/text-\[11px\]/g, 'text-[12px]'],
        [/text-\[14px\]/g, 'text-[13px]'],
        [/text-\[16px\]/g, 'text-[17px]'],
        [/text-\[18px\]/g, 'text-[17px]'],
    ];

    let modified = content;
    replacements.forEach(([regex, replacement]) => {
        modified = modified.replace(regex, replacement);
    });

    if (content !== modified) {
        fs.writeFileSync(absolutePath, modified, 'utf8');
        console.log(`Updated: ${file}`);
    } else {
        console.log(`No changes needed: ${file}`);
    }
});
