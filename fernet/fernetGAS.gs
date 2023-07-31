/* 
Google Apps Script Wrapper for FernetJS
https://github.com/csquared/fernet.js
Browser version needed with one tiny modification. See fernetbrowserGAS.gs in this repo.

This is cross-compatiable with Python Cryptography
https://cryptography.io/en/latest/

Key Derevation Function uses CryptoJS
https://github.com/brix/crypto-js
https://www.npmjs.com/package/crypto-js
https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
*/

function example(){
  var cleartext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  Logger.log("Here is the cleartext: "+cleartext)
  key = getKeyFromPassword("password", "salt")
  Logger.log("Here is the key: "+key)
  var ciphertext = encrypt(cleartext, key)
  Logger.log("Here is the ciphertext: "+ciphertext)
  var decrypted_clear = decrypt(ciphertext,key)
  Logger.log("Here is the decrypted cleartext: "+decrypted_clear)
}

function encrypt(cleartext, key) {
  var secret = new fernet.Secret(key);

  var token = new fernet.Token({
    secret: secret,
    time: Date.parse(1),
    iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  })
  
  var ciphertext = token.encode(cleartext)

  return ciphertext
}

function decrypt(ciphertext,key){
  var secret = new fernet.Secret(key);
  var token = new fernet.Token({
    secret: secret,
    token: ciphertext,
    ttl: 0
  })

  var cleartext = token.decode();

  return cleartext
}

function getKeyFromPassword(password, salt){
  //4096 iterations is fast, 480000 is new standard but takes time...
  var keyRaw = CryptoJS.PBKDF2(password, salt, {keySize: 256/32, iterations: 480000, hasher: CryptoJS.algo.SHA256})
  var keyHex = CryptoJS.enc.Hex.stringify(keyRaw)
  
  var keyBytes = hexToByte(keyHex) // in utils
  //Logger.log(keyBytes)
  var fernetKey = Utilities.base64EncodeWebSafe(keyBytes);
  //Logger.log(fernetKey)
  return fernetKey
}

function getRandomKey(){
  // With help from https://stackoverflow.com/questions/20767186/google-apps-script-random-string-generating?rq=1
  
  // Set-up
  var key_length = 32
  var random_string = ''; 
  var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Derive random string
  for (var i=0; i < key_length; i++) { random_string += r.charAt(Math.floor(Math.random()*r.length)); }
  
  // Base64 Encode the random string
  key  = Utilities.base64EncodeWebSafe(random_string)
  //Logger.log(key)
  
  // Finally
  return key;    
};
