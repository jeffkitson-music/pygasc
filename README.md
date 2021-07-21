# pyGAScrypto
Interoperabilty between Google Apps Script CryptoJS and Python cryptography

## About
These scripts use the AES standard with KBKDF2 key derivation. While each script can encode and decode independently, the primary function is to provide interoperability between Python and CryptoJS in Google Apps Script (GAS)

## Dependencies 
**Python**

- cryptography (pip install cryptography)

**Google Apps Script**
- [CryptoJS](https://github.com/brix/crypto-js) is required. [The raw script](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js) can simply be cut and pasted into it's own file in the Google Apps Script IDE.

## Example Use
**Python**
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
**Google Apps Script**
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
**Use in GAS in another project/import as a library**
```javascript
/*
Set up the script in it's own script/project file
Save it and copy the script id in the browser URL
Example: https://script.google.com/home/projects/<THIS IS THE SCRIPT ID>/edit

In your second script, click the + next to the Library and paste your script id into the dialog box
Name the library for use in this script. Example below. 
*/
function libraryDEMO(){
  // Setup same as above
  // myLibrary used as example name for import.
  var ciphertext = myLibrary.encrypt(myDict,password,salt)
  // etc...
}
```
## Shoutouts
Lorem Ipsum...
