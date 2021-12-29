function example(){
  var cleartext = "Hello Fernet"
  var key = "cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4="
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
