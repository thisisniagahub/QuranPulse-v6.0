import axios from 'axios';

const KEYS = [
  "AIzaSyAydE2fxKo_wFS87UT40E6kwRIkg_n8mxw",
  "AIzaSyCeBgUyiy9Eyw6L91QZoztP90l8sZOsthw",
  "AIzaSyDeXTh0JUVOkClaSV5dKlSdUOyUJBfX8is",
  "AIzaSyBnpGYr5xbWxX5aChmxidgrJcm5b3kgdqM",
  "AIzaSyD89XLremwCC0Pi0EpJgVX9lkfUF0_pDnQ",
  "AIzaSyCOS7EvTC8qVovbJDdqmSsQn_P2FivENHU",
  "AIzaSyDpu2c6b8x8Tvc0b-RytKXi2nEgnesQyWE"
];

// Kita test model paling standard di dunia dulu
const MODEL = "gemini-1.5-flash"; 

console.log("🚀 MULA TEST 7 KUNCI API...\n");

async function checkKey(key, index) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
    const payload = {
      contents: [{ parts: [{ text: "Hi" }] }]
    };

    const start = Date.now();
    const res = await axios.post(url, payload);
    const time = Date.now() - start;

    if (res.status === 200) {
      console.log(`✅ KUNCI ${index + 1}: BERJAYA (${time}ms)`);
      return true;
    }
  } catch (error) {
    const status = error.response ? error.response.status : "NETWORK ERROR";
    const msg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.log(`❌ KUNCI ${index + 1}: GAGAL [${status}]`);
    // console.log(msg.substring(0, 100) + "..."); 
    return false;
  }
}

async function run() {
  for (let i = 0; i < KEYS.length; i++) {
    await checkKey(KEYS[i], i);
  }
  console.log("\n🏁 TAMAT TEST.");
}

run();
