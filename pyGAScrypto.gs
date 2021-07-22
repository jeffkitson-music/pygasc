function encrypt(cleartext,password,salt){

  // If 
  if (typeof cleartext == "object" || typeof cleartext == "array"){
    var cleartext = JSON.stringify(cleartext)
  }
  
  var iterations = 1000;
  var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
  var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));

  var ciphertext = CryptoJS.AES.encrypt(cleartext, key, { iv: iv });
  Logger.log(ciphertext.toString());
  return ciphertext.toString()
}

function decrypt(ciphertext,password,salt) {  
  var iterations = 1000;
  var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
  var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
  var decryptedWA = CryptoJS.AES.decrypt(data, key, { iv: iv}); // WA is wordarray - required.

  var cipherParams = CryptoJS.lib.CipherParams.create({
     ciphertext: CryptoJS.enc.Base64.parse(data )
  });
  var decryptedFromText = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv});
  Logger.log(decryptedFromText.toString(CryptoJS.enc.Utf8))

  // For Dictionaries/Objects
  var cleartext = JSON.parse(decryptedFromText.toString(CryptoJS.enc.Utf8))
  return cleartext
}


function cryptpDEMO(){
  var myDict = {"hello":"world"}
  var password = "lazydog"
  var salt = "salt"
  var ciphertext= encrypt(myDict,password,salt)
  Logger.log("Ciphertext:")
  Logger.log(ciphertext)
  var clear = decrypt(ciphertext,password,salt)
  Logger.log("Decrypted Cleartext:")
  Logger.log(clear)
}
