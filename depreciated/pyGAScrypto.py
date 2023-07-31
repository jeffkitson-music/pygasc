import json
from base64 import b64encode, b64decode
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend


# This is an implementation of AES in Python
# It is compatible with the Google Apps Script version of CryptoJS

def decrypt(ciphertext, password, salt):
    data = b64decode(ciphertext)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=256,  # same as key size?
        salt=salt.encode("utf-8"),
        iterations=1000,
    )
    myBytes = kdf.derive(password.encode("utf-8"))
    iv = myBytes[0:16]
    key = myBytes[16:48]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()
    text = decryptor.update(data) + decryptor.finalize()

    # This is a string, no matter what
    cleartext = text[:-text[-1]].decode("utf-8")

    try:
        # Process the dictionary
        myDict = json.loads(cleartext)
        return myDict
    except:
        return cleartext


def encrypt(cleartext, password, salt):
    backend = default_backend()
    padder = padding.PKCS7(128).padder()
    unpadder = padding.PKCS7(128).unpadder()
    try:
        # for dictionaries
        data = json.dumps(cleartext).encode('utf-8')
        data = padder.update(data) + padder.finalize()
    except:
        # for strings
        data = cleartext.encode()
        data = padder.update(data) + padder.finalize()

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=256,
        salt=salt.encode("utf-8"),
        iterations=1000,
    )

    myBytes = kdf.derive(password.encode("utf-8"))
    iv = myBytes[0:16]
    key = myBytes[16:48]

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=backend)
    encryptor = cipher.encryptor()
    ct = encryptor.update(data) + encryptor.finalize()
    ct_out = b64encode(ct)
    return ct_out


def example():
    # cleartext takes strings, objects, or arrays
    cleartext = {"hello":"world"}
    pw = "lazydog"
    salt = "salt"

    ciphertext = encrypt(cleartext, password=pw, salt=salt)
    print("Original: ",cleartext)
    print("Ciphertext: ",ciphertext) # you may need to ciphertext.decode()
    clear = decrypt(ciphertext, password=pw, salt=salt)
    print("Decrypted from ciphertext: ",clear)

example()
