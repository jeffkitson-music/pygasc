# pyGAScrypto
Interoperabilty between Google Apps Script CryptoJS and Python cryptography

## About
These scripts use the AES standard with KBKDF2 key derivation. While each script can encode and decode independently, the primary function is to provide interoperability between Python and CryptoJS in Google Apps Script (GAS)

## Dependencies 
CryptoJS is required. The script can simply be cut and pasted into it's own file in the Google Apps Script IDE.

## Example Use
Python
```python
# This is not a pip-installable package. You can just cut/paste the code into your own script.
import pyGAScrypto as pgasc

# Demo Settings
password = "lazydog"
salt = salt

cleartext = "Hello World"

ciphertext = pgasc.encypt(cleartext, password, salt)
print(ciphertext)
decoded_cleartext = pgasc.decrypt(ciphertext, password, salt)
print(decoded_cleartext)


```
Google Apps Script
```javascript
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
```
## Shoutouts
Lorem Ipsum...
