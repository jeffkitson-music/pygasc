# :warning: This version (AES) has been depreciated. :warning:
Everything has been upgraded to Fernet! 

# pyGAScrypto (old!)
Interoperabilty between Google Apps Script CryptoJS and Python cryptography.

## :lock: About
The implementation uses the AES standard with PBKDF2 key derivation, and essentially just matches AES parameters across langagues. While each script can encode and decode in a self-contained manner, the primary function is to provide interoperable cryptography between Python and CryptoJS in Google Apps Script (GAS). Apps Script is not strictly needed, however. This will work fine with Python and CryptoJS in vanilla JavaScript. 

:lock: Primary Uses:
- :lock: Encrypt in Python/Decrypt in Google Apps Script
- :lock: Encrypt in Google Apps Script/Decrypt in Python
- :lock: Encrypt in CryptoJS/Decrypt in Python
- :lock: Encrypt in Python/Decrypt in CryptoJS

## :package: JS Import
```html
<script type="text/javascript" src="https://jeffkitson-music.github.io/js/pygasc.min.js"></script>
```

## :books: Dependencies 
**Python**

- cryptography (pip install cryptography)

**Google Apps Script**
- [CryptoJS](https://github.com/brix/crypto-js) is required. [The raw script](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js) can simply be cut and pasted into it's own file alongside this script in the Google Apps Script IDE.

## :eyes: Example Use
**Python**
```python
# This is not a pip-installable package. 
# You can just pull or cut/paste the code into your own script.
import pyGAScrypto as pgasc

# Demo Settings
password = "lazydog"
salt = "salt"

cleartext = "Hello World"
# Note: also accepts dictionaries and lists 
# Script will convert to string if a dictionary or is detected.
# cleartext = {"hello":"world"} or cleartext = ["hello","world"] etc...

ciphertext = pgasc.encrypt(cleartext, password, salt)
print("Ciphertext: ",ciphertext)

decoded_cleartext = pgasc.decrypt(ciphertext, password, salt)
print("Decoded Cleartext: ",decoded_cleartext)


```
**HTML**
```
<!--Import required scripts-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script type="text/javascript" src="https://jeffkitson-music.github.io/js/pygasc.min.js"></script>

<!--Your Code-->
<script>
pygascExample()
</script>
```
**Google Apps Script**
```javascript
function gasExample(){

  var cleartext = "Hello World"
  // Note: also accepts objects - script will stringifiy if an object type is detected.
  // cleartext = {"hello":"world"}
  var password = "lazydog"
  var salt = "salt"
  
  var ciphertext = encrypt(myDict,password,salt)
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
- [Zergatul](https://stackoverflow.com/users/960055/zergatul) in [this thread](https://stackoverflow.com/questions/59488728/aes-encrypt-in-cryptojs-decrypt-in-pycrypto) on Stackoverflow. This thread helped me get the basic concepts in PyCrypto to transfer them over to cryptography. 

- [Nguyễn Thành Nghĩa](https://stackoverflow.com/users/9454452/nguy%e1%bb%85n-th%c3%a0nh-ngh%c4%a9a) in [this thread](https://stackoverflow.com/questions/39311514/how-to-decrypt-aes-with-cryptojs) on Stackoverflow. This thread helped me to get the decryption right in GAS/JavaScript.

- [PM 2Ring](https://stackoverflow.com/users/4014959/pm-2ring) in [this thread](https://stackoverflow.com/questions/50062663/encryption-decryption-using-aes-cbc-pkcs7padding) on Stackoverflow. The final piece of the puzzle was adding the padding in Python cryptography to match CryptoJS. CryptoJS pads natively, and cryptograpy doesn't!

- [Amit Agarwal](https://www.labnol.org/about) for always having so many free resources on Google Apps Script. So often when I'm making personal projects I'll search something he's almost always the first result. I've started commenting "Amit to the rescue...again!" in my code whenever I use one of his solutions. Thank you, Amit, for teaching this amateur to use Apps Script. I am forever grateful. 
