# G Suite File Stream Ransomware Research

This project is an academic only project designed to test the feasibility of ransomware utilizing Drive File Stream as an attack vector

## Disclaimer

Please only run this code if you fully understand what it is doing, as this code can result in encrypting your files with no way to decrypt them.

While the base code will encrypt with a static key, please be sure to save this to disk if you utilize this program.

```javascript
const key = crypto.scryptSync(password, "salt", 32);
const iv = Buffer.alloc(16, 0);
```

I have also included the decryption function, although not utilized in this project, it is a potential way to decrypt your files as long as you store your encryption key and its associated initialization vector.

**Use of this project is at your own risk**

## About this project

This is a simple NodeJS project that uses AES-256-CBC Symmetric Encryption to specifically look at and target Drive File Stream. This project was created in tandem as research for this blog post, about Ransomware and G Suite.

## More Information

Andrew Giggey - [Amplified IT](https://amplifiedit.com/)
