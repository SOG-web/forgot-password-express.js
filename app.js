// express sever
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const port = process.env.PORT || 3000;

let user = {
  id: 'effbvv38vnv',
  password: 'admin',
  email: 'admin@admin.com',
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
  });
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (email === user.email) {
    const secret = 'durtr' + user.password;

    const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

    // get the host address of the server
    const host = req.headers.host;

    const link = `https://${host}/reset-password/${user.id}/${token}`;

    console.log(link);

    res.send('password reset link sent to your email');
    return;
  }
  res.send('Email not found');
});

app.get('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;
  const secret = 'durtr' + user.password;

  if (id !== user.id) {
    res.send('Invalid user id');
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    res.render('reset-password', { email: user.email });
  } catch (error) {
    res.send('Invalid token');
  }
});

app.post('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  const secret = 'durtr' + user.password;

  if (id !== user.id) {
    res.send('Invalid user id');
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    user.password = password;

    res.send('Password reset successfully');
  } catch (error) {
    res.send('Invalid token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
