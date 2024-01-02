import base64
import json
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

# Specifically for AES
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend


class PYGASC:
    def __init__(self):
        # Iterations
        self.fernet_iterations = 480000
        self.aes_iterations = 5000

        self.mode = None

        # Text
        self.cleartext = None
        self.ciphertext = None

        # Keys
        self.key = None
        self.password = None
        self.salt = None

    def get_fernet_key_from_password(self, password, salt):
        self.password = self.check_bytes(password)
        self.salt = self.check_bytes(salt)

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.salt,
            iterations=self.fernet_iterations,
        )
        self.key = base64.urlsafe_b64encode(kdf.derive(self.password))
        return self.key.decode()  # binary in the class, but returns str for convenient saving

    def get_aes_key_from_password(self, password, salt):
        # This doesn't work in JavaScript
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=256,  # same as key size?
            salt=salt.encode("utf-8"),
            iterations=self.aes_iterations,
        )
        return kdf

    def get_random_fernet_key(self):
        self.key = Fernet.generate_key()
        return self.key.decode()

    def encrypt(self, cleartext, password, salt, mode):
        if mode.lower() == "fernet":
            ciphertext = self.encrypt_fernet(cleartext, password, salt)
        else:
            ciphertext = self.encrypt_aes(cleartext, password, salt)
        return ciphertext

    def decrypt(self, ciphertext, password, salt, mode):
        if mode.lower() == "fernet":
            ciphertext = self.decrypt_fernet(ciphertext, password, salt)
        else:
            ciphertext = self.decrypt_aes(ciphertext, password, salt)
        return ciphertext

    def encrypt_fernet(self, cleartext, password, salt):
        key = self.get_fernet_key_from_password(password, salt)
        f = Fernet(key)
        ciphertext = f.encrypt(self.check_bytes(cleartext))
        return ciphertext.decode()

    def encrypt_aes(self, cleartext, password, salt):
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
        kdf = self.get_aes_key_from_password(password, salt)

        myBytes = kdf.derive(password.encode("utf-8"))
        iv = myBytes[0:16]
        key = myBytes[16:48]

        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=backend)
        encryptor = cipher.encryptor()
        ct = encryptor.update(data) + encryptor.finalize()
        ct_out = base64.b64encode(ct)  # this is not the same decode/encode
        return ct_out.decode()  # for easy saving

    def decrypt_fernet(self, ciphertext, password, salt):
        key = self.get_fernet_key_from_password(password, salt)
        f = Fernet(key)
        try:
            self.cleartext = f.decrypt(self.check_bytes(ciphertext)).decode()
        except Exception as e:
            print("Decryption failed!")
            print(str(e))
            self.cleartext = None
        return self.cleartext

    def decrypt_aes(self, ciphertext, password, salt):
        data = base64.b64decode(ciphertext)
        kdf = self.get_aes_key_from_password(password, salt)
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

    # Thanks geeksforgeeks!
    def encrypt_file(self, filename, password, salt):
        # this replaces the contents of the file!
        key = self.get_fernet_key_from_password(password, salt)
        f = Fernet(key)

        with open(filename, 'rb') as original_file:
            original = original_file.read()

        encrypted = f.encrypt(original)

        with open(filename, 'wb') as encrypted_file:
            encrypted_file.write(encrypted)

    def decrypt_file(self, filename, password, salt):
        # This does not alter or save the decrypted contents
        key = self.get_fernet_key_from_password(password, salt)
        f = Fernet(key)

        with open(filename, 'rb') as encrypted_file:
            encrypted = encrypted_file.read()

        decrypted = f.decrypt(encrypted)
        return decrypted.decode()

    def save_decrypted_file(self, filename, password, salt):
        # This will completely decrypt and re-save the file
        decrypted = self.check_bytes(self.decrypt_file(filename, password, salt))

        with open(filename, 'wb') as original_file:
            original_file.write(decrypted)

    @staticmethod
    def check_bytes(thing_to_check):
        if isinstance(thing_to_check, (bytes, bytearray)):
            pass
        else:
            thing_to_check = thing_to_check.encode()
        return thing_to_check


if __name__ == '__main__':
    # Example
    sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    print("Sample text: ", sample)
    pw, salt = "hello", "world"
    pygasc = PYGASC()

    # FERNET
    fernet_key = pygasc.get_fernet_key_from_password(pw, salt)
    fernet_cipher_text = pygasc.encrypt("lorem ipsum", pw, salt, mode="fernet")
    fernet_clear_text = pygasc.decrypt(fernet_cipher_text, pw, salt, mode="fernet")
    print("=== FERNET ===")
    print("Fernet Key: ", fernet_key)
    print("Fernet Ciphertext: ", fernet_cipher_text)
    print("Fernet Cleartext: ", fernet_clear_text)
    print()
    # AES
    aes_cipher_text = pygasc.encrypt("lorem ipsum", pw, salt, mode="aes")
    aes_clear_text = pygasc.decrypt(aes_cipher_text, pw, salt, mode="aes")
    print("=== AES ===")
    print("AES Ciphertext: ", aes_cipher_text)
    print("AES Cleartext: ", aes_clear_text)
