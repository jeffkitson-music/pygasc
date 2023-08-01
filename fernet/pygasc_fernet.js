// In Progress!

class pygasc{
	constructor(){
  	// Text
  	this.cleartext = null;
    this.ciphertext = null;
    
    // Keys
    this.key = null;
    this.password = null;
   	this.salt = null;
  }
  
  // Class functions
  deriveKey(password, salt){
  	this.password = password;
    this.salt = salt;
    
  	var keyRaw = CryptoJS.PBKDF2(password, salt, {keySize: 256/32, iterations: 480000, hasher: CryptoJS.algo.SHA256});
  	var keyHex = CryptoJS.enc.Hex.stringify(keyRaw);
  	var keyBytes = this.hexToByte(keyHex);
  	var fernetKey = this.base64EncodeURL(keyBytes); // adjusted from original function
  	console.log(fernetKey);
  	
    this.key = fernetKey;
    return fernetKey;
		}
    
  encrypt(cleartext) {
  	this.cleartext = cleartext
  	var secret = new fernet.Secret(this.key);

    var token = new fernet.Token({
      secret: secret,
      // Time and secret can be included to make deterministic, see:
      //https://github.com/csquared/fernet.js/
    })

  	this.ciphertext = token.encode(cleartext)

  	return this.ciphertext
	}
  
  decrypt(ciphertext){
    try{
      var secret = new fernet.Secret(this.key);
      var token = new fernet.Token({
        secret: secret,
        token: ciphertext,
        ttl: 0
      });

      this.cleartext = token.decode();
      }
      catch(error){
        var cleartext = "Error: Unable to decrypt";
        console.log("Error: Unable to decrypt");
        console.log(error);
        this.cleartext = null;
      }
      return this.cleartext;
    }
    
  //https://gist.github.com/themikefuller/c1de46cbbdad02645b9dc006baedf88e
// Removed .replace(/\=/g, ''); because equals character is needed in fernet keys.
 base64EncodeURL(byteArray) {
  return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
    return String.fromCharCode(val);
  }).join('')).replace(/\+/g, '-').replace(/\//g, '_');
}
  
  hexToByte(hex){
  const key = '0123456789abcdef'
  let newBytes = []
  let currentChar = 0
  let currentByte = 0
  for (let i=0; i<hex.length; i++) {   // Go over two 4-bit hex chars to convert into one 8-bit byte
    currentChar = key.indexOf(hex[i])
    if (i%2===0) { // First hex char
      currentByte = (currentChar << 4) // Get 4-bits from first hex char
    }
    if (i%2===1) { // Second hex char
      currentByte += (currentChar)     // Concat 4-bits from second hex char
      newBytes.push(currentByte)       // Add byte
    }
  }
  return new Uint8Array(newBytes)
	}

}

function example(){
  p = new pygasc();
  p.deriveKey("password","salt")
  var ciphertext = p.encrypt("Lorem Ipsum")
  console.log(ciphertext)
  var cleartext = p.decrypt(ciphertext)
  console.log(cleartext)
}
example()
