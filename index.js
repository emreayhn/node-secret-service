require('dotenv').config();          // .env dosyasını oku
const express = require('express');  // express'i getir
const app = express();               // uygulamayı oluştur
const PORT = 3000;

// "/" route → Hello world
app.get('/', (req, res) => {
  res.send('Hello, world!');
  res.send('Watchtower otomatik guncelleme calisiyor!');
});

// "/secret" route → Basic Auth ile korumalı
app.get('/secret', (req, res) => {
      console.log('ENV USERNAME:', process.env.USERNAME);
  console.log('ENV PASSWORD:', process.env.PASSWORD);
  const auth = req.headers.authorization;

  if (!auth) {
    res.set('WWW-Authenticate', 'Basic');   // tarayıcı şifre sorsun
    return res.status(401).send('Kimlik doğrulama gerekli');
  }

  // "Basic base64(kullanıcı:şifre)" formatını çöz
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64')
    .toString().split(':');

  if (user === process.env.USERNAME && pass === process.env.PASSWORD) {
    res.send(process.env.SECRET_MESSAGE);    // doğruysa gizli mesaj
  } else {
    res.status(401).send('Hatalı kullanıcı adı veya şifre');
  }
});

app.listen(PORT, () => {
  console.log(`Servis çalışıyor: http://localhost:${PORT}`);
});