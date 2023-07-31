# WORK IN PROGRESS
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class pygasc:
    def __init__(self):
        # Text
        self.cleartext = None
        self.ciphertext = None

        # Keys
        self.key = None
        self.password = None
        self.salt = None

    def derive_key(self, password, salt):
        self.password = self.check_bytes(password)
        self.salt = self.check_bytes(salt)

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.salt,
            iterations=480000,
        )
        self.key = base64.urlsafe_b64encode(kdf.derive(self.password))
        return self.key.decode()  # binary in the class, but returns str for convenient saving

    def get_random_key(self):
        self.key = Fernet.generate_key()
        return self.key.decode()

    def encrypt(self, cleartext):
        f = Fernet(self.key)
        self.ciphertext = f.encrypt(self.check_bytes(cleartext))
        return self.ciphertext.decode()

    def decrypt(self, ciphertext):
        f = Fernet(self.key)
        self.cleartext = f.decrypt(self.check_bytes(ciphertext)).decode()
        return self.cleartext

    # Thanks geeksforgeeks!
    def encrypt_file(self, filename):
        # this replaces the contents of the file!
        f = Fernet(self.key)

        with open(filename, 'rb') as original_file:
            original = original_file.read()

        encrypted = f.encrypt(original)

        with open(filename, 'wb') as encrypted_file:
            encrypted_file.write(encrypted)

    def decrypt_file(self, filename):
        # This does not alter or save the decrypted contents
        f = Fernet(self.key)

        with open(filename, 'rb') as encrypted_file:
            encrypted = encrypted_file.read()

        decrypted = f.decrypt(encrypted)
        return decrypted.decode()

    def save_decrypted_file(self, filename):
        # This will completely decrypt and re-save the file
        decrypted = self.check_bytes(self.decrypt_file(filename))

        with open(filename, 'wb') as original_file:
            original_file.write(decrypted)

    @staticmethod
    def check_bytes(thing_to_check):
        if isinstance(thing_to_check, (bytes, bytearray)):
            pass
        else:
            thing_to_check = thing_to_check.encode()
        return thing_to_check
