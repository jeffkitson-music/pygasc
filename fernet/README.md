# Fernet Encryption in GAS
The Python [cryptography library](https://pypi.org/project/cryptography/) uses Fernet encryption out of the box. It is very easy for beginners (like me!) to use. But what if you are looking for interoperability between Python cryptography and Google Apps Script?

## :books: Dependencies 
**Python**

- cryptography (pip install cryptography)

**Google Apps Script**
- [CryptoJS](https://github.com/brix/crypto-js) is required. [The raw script](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js) can simply be cut and pasted into it's own file alongside this script in the Google Apps Script IDE.
- [fernetBrowser.js](https://github.com/csquared/fernet.js) is used, but altered in this repo to correctly work with Apps Script.

## :eyes: Example Use
**Google Apps Script**
```javascript
function fernetExample(){
  var cleartext = "Hello Fernet"
  var key = "cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4="
  var ciphertext = encrypt(cleartext, key)
  Logger.log("Here is the ciphertext: "+ciphertext)
  var decrypted_clear = decrypt(ciphertext,key)
  Logger.log("Here is the decrypted cleartext: "+decrypted_clear)
}

```

**Python**
Encrypt and decrypt as you normally would with [cryptography](https://pypi.org/project/cryptography/)
```python
from cryptography.fernet import Fernet

# key must be in bytes
key = b"cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4="
f = Fernet(key)

# cipher text must also be in bytes
ciphertext = b"gAAAAABhzICAAAECAwQFBgcICQoLDA0OD41WNkUBIm_cwJlzChFk0BV_LmjDnvqC_-BD5oxOF1fzGHsbMouOf9r-rrv46QgK-g=="

cleartext = f.decrypt(ciphertext)
print(cleartext)

```

**Use in GAS in another project/import as a library**
```javascript
/*
Set up the script in it's own script/project file
Save it and copy the script id in the browser URL
Example: https://script.google.com/home/projects/<THIS IS THE SCRIPT ID>/edit

Create a second script/project
Click the + next to the Library and paste your script id into the dialog box
Name the library for use in this script. Example below. 
*/
function libraryDEMO(){
  // Setup same as above
  // myLibrary used as example name for import.
  var ciphertext = myLibrary.encrypt(myDict,password,salt)
  // etc...
}
```
## :mega:  Shoutouts
- [Chris Continanza](https://github.com/csquared) for the [fernet.js](https://github.com/csquared/fernet.js) repo. 

- [Alex Gaynor](https://github.com/alex) who pushed me to dig deeper into the docs and ask better questions. 

