import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://myhadith.islam.gov.my/hadiths.php?susunans=88'; 
const outputFilePath = path.resolve(process.cwd(), 'myhadith_bukhari_parsed.json');
const allHadiths = [];

// Clean text helper
const clean = (text) => text.replace(/\s+/g, ' ').trim();

async function ingestHadith() {
    console.log('Starting TEXT-BASED ingestion from MyHadith...');
    
    // Scrape Page 1 & 2
    for (let page = 1; page <= 2; page++) {
        const url = `${BASE_URL}&page=${page}`;
        console.log(`Fetching page ${page}...`);
        
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            // Get raw text from the main column, but try to preserve some structure by replacing <br> with newlines
            // This helps separate the blocks
            $('br').replaceWith('\n');
            $('p').append('\n');
            $('div').append('\n');
            
            const rawText = $('.col-md-8').text();
            
            // Split by "Baca Selanjutnya" which seems to appear after every hadith based on the dump
            // Or look for the pattern "1) ", "2) " etc.
            
            // Let's split by the Number pattern "X) " which marks the start of a hadith title
            // Note: This regex split captures the delimiter (number) so we can reconstruct
            const chunks = rawText.split(/(\d+\)\s)/); 
            
            // Chunk 0 is usually header/garbage. 
            // Chunk 1 is "1) ", Chunk 2 is content for 1. 
            // Chunk 3 is "2) ", Chunk 4 is content for 2.
            
            for (let i = 1; i < chunks.length; i += 2) {
                const numberStr = chunks[i].trim(); // "1)"
                const content = chunks[i+1]; // Rest of the content until next number
                
                if (!content) continue;

                // 1. Extract Title (First line or sentence before Arab)
                // The Arabic usually starts with specific chars, so we split by Arabic regex
                const parts = content.split(/([\u0600-\u06FF]+[\s\S]*?[\u0600-\u06FF]+)/m); 
                
                if (parts.length >= 2) {
                    const titleMalay = clean(parts[0]);
                    const arabicText = clean(parts[1]);
                    const fullTranslation = clean(parts[2] || '').replace('Baca Selanjutnya', '');

                    if (arabicText.length > 20) { // Filter out noise
                        allHadiths.push({
                            number: parseInt(numberStr.replace(')', '')),
                            title: titleMalay,
                            arabic: arabicText,
                            translation: fullTranslation,
                            source: 'Sahih Al-Bukhari'
                        });
                    }
                }
            }

            console.log(`Extracted ${allHadiths.length} hadiths so far...`);

        } catch (error) {
            console.error(error);
        }
    }

    if (allHadiths.length > 0) {
        console.log('Sample:', allHadiths[0]);
        fs.writeFileSync(outputFilePath, JSON.stringify(allHadiths, null, 2));
        console.log(`✅ SUCCESS! Saved ${allHadiths.length} hadiths to ${outputFilePath}`);
    } else {
        console.log("❌ Failed to parse any hadiths.");
    }
}

ingestHadith();