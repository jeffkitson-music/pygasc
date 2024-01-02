// Almost done. Still needs cleaning.

class PYGASC{
	constructor(){
  	this.fernetIterations = 480000;
    this.aesIterations = 5000;
  	this.mode = null; // AES or FERNET
    this.cleartext = null;
    this.ciphertext = null;
    this.password = null;
    this.salt = null;
    this.key = null;
  }
  encrypt(cleartext, password, salt, mode){
  	if(mode.toLowerCase()=="fernet"){
    	var ciphertext = this.fernetEncrypt(cleartext, password, salt)
    	return ciphertext
    }
    else{
    	this.mode = "aes"
      var ciphertext = this.encryptAES(cleartext, password, salt);
    	return ciphertext
    }
  }
  encryptAES(cleartext,password,salt){
    // If the cleartext is an object or any array, stringify it.
    if (typeof cleartext == "object" || cleartext instanceof Array){
      var cleartext = JSON.stringify(cleartext)
    }
    // You can't break key stuff out to a different function. 
    //var iterations = 1000;
  	var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: this.aesIterations,hasher: CryptoJS.algo.SHA256 });
  	var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  	var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
    
    var ciphertext = CryptoJS.AES.encrypt(cleartext, key, { iv: iv });
    return ciphertext.toString()
  }
  decrypt(ciphertext, password, salt, mode){
  	if(mode.toLowerCase()=="fernet"){
      var cleartext = this.fernetDecrypt(ciphertext, password, salt)
      return cleartext
    }
    else{
    	this.mode = "aes"
      var cleartext = this.decryptAES(ciphertext, password, salt);
    	return cleartext
    }
  }
  fernetEncrypt(cleartext, password, salt){
  	var fernetKey = this.getFernetKeyFromPassword(password, salt)
    var secret = new fernet.Secret(fernetKey);
    //Normally time would default to (new Date()) and iv to something random.
		var token = new fernet.Token({
      secret: secret,
      time: Date.parse(1),
      //iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    })
		var ciphertext = token.encode(cleartext)
    return ciphertext  	
  }
  fernetDecrypt(ciphertext, password, salt){
  	var fernetKey = this.getFernetKeyFromPassword(password, salt)
    var secret = new fernet.Secret(fernetKey);
  	var token = new fernet.Token({
    secret: secret,
    token: ciphertext,
    ttl: 0
  })

  var cleartext = token.decode();

  return cleartext
  
  }
  decryptAES(ciphertext,password,salt) {  
    //var data = ciphertext
    //var key = this.getAESkey(password, salt)
    //var decryptedWA = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv}); // WA is wordarray - required. // NOT USED? WHAT THE FUCK?!

    //var iterations = 1000;
  	var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: this.aesIterations,hasher: CryptoJS.algo.SHA256 });
  	var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  	var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
    
    
    
    var cipherParams = CryptoJS.lib.CipherParams.create({
       ciphertext: CryptoJS.enc.Base64.parse(ciphertext )
    });
    var decryptedFromText = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv});

    var cleartext = decryptedFromText.toString(CryptoJS.enc.Utf8)

    // If the decrypted cleartext is an object or an array, parse it. 
    if(this.isJson(cleartext)){
      cleartext = JSON.parse(cleartext)
    }
    return cleartext
	}
  getFernetKeyFromPassword(password, salt) {
  //4096 iterations is fast, 480000 is new standard but takes time...
  var keyRaw = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: this.fernetIterations,// 480000
    hasher: CryptoJS.algo.SHA256
  })
  var keyHex = CryptoJS.enc.Hex.stringify(keyRaw)
  var fernetKey = this.hexToBase64(keyHex)
  return fernetKey
}

// https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
	hexToBase64(hexstring) {
  return btoa(hexstring.match(/\w{2}/g).map(function(a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join(""));
}

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
	}
}  



function example(){
	var sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  console.log("Sample Text: "+sample)
  var pw = "hello"
  var salt = "world"
	var pygasc = new PYGASC()
  // FERNET
  var fernetKey = pygasc.getFernetKeyFromPassword(pw, salt)
  var fernetCipherText = pygasc.encrypt(sample, pw, salt, mode="fernet")
  var fernetClearText = pygasc.decrypt(fernetCipherText, pw, salt, mode="fernet")
  console.log("=== FERNET ===")
  console.log("Fernet Key:" + fernetKey)
  console.log("Fernet Ciphertext: "+fernetCipherText)
  console.log("Fernet Cleartext: "+fernetClearText)
  
  // AES
  var aesCipherText = pygasc.encrypt(sample, pw, salt, mode="aes")
  var aesClearText = pygasc.decrypt(aesCipherText, pw, salt, mode="aes")
  console.log("=== AES ===")
  console.log("AES Ciphertext: "+aesCipherText)
  console.log("AES Cleartext: "+aesClearText)
}

example()
