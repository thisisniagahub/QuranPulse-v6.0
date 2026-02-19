import fetch from 'node-fetch';

async function check() {
  const url = 'https://api.quran.com/api/v4/verses/by_chapter/2?translations=20&per_page=300';
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const data = await res.json();
  if (data.verses) {
      console.log('Verses count:', data.verses.length);
  }
}

check();
