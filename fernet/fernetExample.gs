function example(){
  var cleartext = "Hello Fernet"
  var key = "cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4="
  var ciphertext = encrypt(cleartext, key)
  Logger.log("Here is the ciphertext: "+ciphertext)
  var decrypted_clear = decrypt(ciphertext,key)
  Logger.log("Here is the decrypted cleartext: "+decrypted_clear)
}

function exampleTwo(){
  var cleartext = "Hello Python!"
  key = getakey()
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

function deriveRandomKey(){
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


function deriveKeyFromPW() {
  // derives key from password/salt
  // working on it...

}
