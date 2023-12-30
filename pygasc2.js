// NOT DONE. DRAFT ONE.

class PYGASC{
	constructor(){
  	this.iterations = 480000;
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
    var iterations = 1000;
  	var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
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
  	var secret = new fernet.Secret("cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=");
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
  	var secrett = new fernet.Secret("cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=");
  	var tokenb = new fernet.Token({
    secret: secrett,
    token: ciphertext,
    ttl: 0
  })

  var cleartext = tokenb.decode();

  return cleartext
  
  }
  decryptAES(ciphertext,password,salt) {  
    //var data = ciphertext
    //var key = this.getAESkey(password, salt)
    //var decryptedWA = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv}); // WA is wordarray - required. // NOT USED? WHAT THE FUCK?!

    var iterations = 1000;
  	var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: iterations,hasher: CryptoJS.algo.SHA256 });
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
  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
	}
}  



function pygascExampleNew(){
	var sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  console.log(sample)
  var pw = "yourmom"
  var salt = "goestocollege"
	var pygasc = new PYGASC()
  // FERNET
  var fernetCipherText = pygasc.encrypt(sample, pw, salt, mode="fernet")
  var fernetClearText = pygasc.decrypt(fernetCipherText, pw, salt, mode="fernet")
  console.log("=== FERNET ===")
  console.log(fernetCipherText)
  console.log(fernetClearText)
  
  // AES
  var aesCipherText = pygasc.encrypt(sample, pw, salt, mode="aes")
  var aesClearText = pygasc.decrypt(aesCipherText, pw, salt, mode="aes")
  console.log("=== AES ===")
  console.log(aesCipherText)
  console.log(aesClearText)
}
