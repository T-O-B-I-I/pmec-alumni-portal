const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('C:/Users/DELL/.gemini/antigravity-ide/brain/177515be-71e3-422a-a08c-b3466d8604da/.system_generated/steps/1563/content.md', 'utf8');
const $ = cheerio.load(html);

// PMEC faculty cards are usually inside tables or elementor widgets
const emails = [];
$('*').each((i, el) => {
    const text = $(el).text();
    if (text.includes('@pmec.ac.in')) {
        // Find parent container that might be the row or card
        const parent = $(el).closest('tr');
        if (parent.length > 0) {
            console.log("Found TR:", parent.text().replace(/\s+/g, ' ').trim());
        }
    }
});

if ($('table').length > 0) {
    console.log("Found", $('table').length, "tables");
}

console.log("Total divs with elementor-text-editor:", $('.elementor-text-editor').length);

$('.elementor-text-editor').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 10 && text.length < 100) {
        // console.log("Text Editor:", text);
    }
});

// Let's print out all tables
$('table tr').each((i, el) => {
    console.log("Row:", $(el).text().replace(/\s+/g, ' ').trim());
});

