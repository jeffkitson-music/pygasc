/*
Generate a Fernet key from a password in JavaScript. Cross-compatiable with Python Cryptography.
https://cryptography.io/en/latest/fernet/#using-passwords-with-fernet

Uses:
crypto.js
fernet.js

Script Imports for HTML file (if not using NodeJS):
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fernet@0.4.0/fernetBrowser.min.js"></script>

Warning: This version performs all cryptography in the browser client-side. Use at your own risk. 
*/

function fernetKeyFromPassword(password, salt){
	console.log("Generating Fernet Key...")
  // Interations matches current python-cryptography docs
  var keyRaw = CryptoJS.PBKDF2(password, salt, {keySize: 256/32, iterations: 480000, hasher: CryptoJS.algo.SHA256});
  var keyHex = CryptoJS.enc.Hex.stringify(keyRaw);
  var keyBytes = hexToByte(keyHex);
  var fernetKey = base64EncodeURL(keyBytes); 
  console.log(fernetKey);
  return fernetKey;
}


function example(){
 	var key = fernetKeyFromPassword("password", "salt");
  var ciphertext = "gAAAAABkxtA2AAECAwQFBgcICQoLDA0OD2MoaILX2PiieZVaJWkGntcxytMg7jG0BrzMAzis0uBMwpF3GB7FhWxI0BwkWcx_b0lXsj7zJveNZ9z7Xswq2Riqbzu79Jt53Jm49LZ9cQYE6_UK-AWU3Zpl0QaGQHJ6fWuJ5zho2v19A5fLGjzGYUowd_vy8t1mLyqiXlnGissdHULpA0zJ8OY3jKZQtqbcAXy_AWvM3s59_j3ccIT71SnCh-ULvVO95ze2eRWyhIWJq-N9MU1Xr8lZm77tkB_1CAL_2z7VEHEWZNhuaI_BKhNaDqToVPXvNO99rI_M5fPY2Yx5T3XaBqnCXWHjEuV2_uIIos1dryDJMYFmXxXF8HjXWuXuojXnHqfCuCs1NFaBHUg7q7MBlZX91nCs916QGy__fvb_6yudGtwLDNFn54Mp4RIxLBBxjI_KOLo_1Oerih3JVgHrLlKDrpbRE_DJIA9lR2bdA7hjDjO-t8CvLvPT2qH1bsN8AWNZNVvr0wZagWMuFEwDtFkMas42FI8DmKRI-uKiTUn7645E7Gs4q4X1RoUty6AYraEKVE7KuVenF99LYBecm2_61aMyM6cpzk1I64Hvv_uB8jne7IgdPOtW3KRVeXBWaYlgo7EYxppmrJwTt-MayGg9hdMQ6wXsgsZmIL_yQIqjXNNLA8Os7aVWQi7xfg85-1A2fCOnNtshkA_5N053BVfFWEJ0Gad-3CFF7xqLu_RU1gtWvIK2D9zNWO55ldRdFqda4qRnDaYMaKy7lt56wnh1l0mBGxkTm7uFE908Dv8n64tOPGFJqtDSF8Mi4VVf_B5pupn-6roDQjayq07XPUvT5SlY4UMWnbfnt_lyYWRFkaW0f3eDB2L8Bwj8_8XegdII21LIAjY7xUT6-427rfqTcqq11Kwmmv9h9vLTPIs6wpTLuvYit-4KPgEyA7_oXYdsTIOjYzHoTlvpX34D8vMLhlP0We8VZd7TmzWUnvSdAFa5z3q2ccC6Ygb5sfN-BV9r0pqKYIrvMc5385im0SNp2xNTH7R9cYypJ1SIQUsgcwcCrJK4yVtAUH9yxbsmRsgTB6QQBhNm";
  var cleartext = decrypt(ciphertext, key);
  console.log(cleartext);
}

function decrypt(ciphertext,key){
try{
  var secret = new fernet.Secret(key);
  var token = new fernet.Token({
    secret: secret,
    token: ciphertext,
    ttl: 0
  });

  var cleartext = token.decode();
  }
  catch(error){
  	var cleartext = "Error: Unable to decrypt";
    console.log(error);
  }
  return cleartext;
}

// https://gist.github.com/themikefuller/c1de46cbbdad02645b9dc006baedf88e
// Removed .replace(/\=/g, ''); because equals character is needed in fernet keys.
function base64EncodeURL(byteArray) {
  return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
    return String.fromCharCode(val);
  }).join('')).replace(/\+/g, '-').replace(/\//g, '_');
}

// https://gist.github.com/llzes/7e0a324239653f32f8eb78a09208de52
const hexToByte = (hex) => {
  const key = '0123456789abcdef';
  let newBytes = [];
  let currentChar = 0;
  let currentByte = 0;
  for (let i=0; i<hex.length; i++) {   // Go over two 4-bit hex chars to convert into one 8-bit byte
    currentChar = key.indexOf(hex[i])
    if (i%2===0) { // First hex char
      currentByte = (currentChar << 4); // Get 4-bits from first hex char
    }
    if (i%2===1) { // Second hex char
      currentByte += (currentChar)  ;   // Concat 4-bits from second hex char
      newBytes.push(currentByte);      // Add byte
    }
  }
  return new Uint8Array(newBytes);
}

example();
