function encrypt(cleartext,password,salt){
  // If the cleartext is an object or any array, stringify it.
  if (typeof cleartext == "object" || typeof cleartext == "array"){
    var cleartext = JSON.stringify(cleartext)
  }
  
  var iterations = 1000;
  var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
  var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));

  var ciphertext = CryptoJS.AES.encrypt(cleartext, key, { iv: iv });
  return ciphertext.toString()
}

function decrypt(ciphertext,password,salt) {  
  var data = ciphertext
  var iterations = 1000;
  var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
  var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
  var decryptedWA = CryptoJS.AES.decrypt(data, key, { iv: iv}); // WA is wordarray - required.

  var cipherParams = CryptoJS.lib.CipherParams.create({
     ciphertext: CryptoJS.enc.Base64.parse(data )
  });
  var decryptedFromText = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv});
  
  var cleartext = decryptedFromText.toString(CryptoJS.enc.Utf8)
  
  // If the decrypted cleartext is an object or an array, parse it. 
  jsontf = isJson(cleartext)
  if(jsontf){
    cleartext = JSON.parse(cleartext)
  }
  return cleartext
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function example(){
  // cleartext takes strings, objects, or arrays
  var cleartext = "Hello World" 
  var password = "lazydog"
  var salt = "salt"

  Logger.log("Original: "+cleartext)
  var ciphertext= encrypt(cleartext,password,salt)
  Logger.log("Ciphertext: " + ciphertext)
  
  var clear = decrypt(ciphertext,password,salt)
  Logger.log("Decrypted from ciphertext: " + clear) // or clear[0] or clear.key, etc...
}
