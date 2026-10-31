# Sumit Glimpses - final website

Client site : index.html      Admin page : admin.html (password only)

## A. Firebase (once)
1. Authentication > Sign-in method > Email/Password > Enable > Save.
2. Authentication > Users > Add user:
   Email  admin@sumitglimpses.com   Password  (your admin password)
   (This email is only an internal name. No inbox or verification needed.)
3. Firestore Database > Rules > paste firestore.rules > Publish.
4. Storage > Rules > paste storage.rules > Publish.
5. Authentication > Settings > Authorized domains > add YOURNAME.github.io

## B. firebase-config.js
Replace every PASTE_HERE with your values (Project settings > Your apps > Config).
Leave ADMIN_EMAIL as it is.

## C. GitHub
Upload all files EXCEPT START-HERE.md, firestore.rules, storage.rules (those stay on your phone/computer).
Settings > Pages > Branch main, folder / (root) > Save.
Do not write your password in any file.
