const express = require('express');
const bodyParser = require('body-parser'); // Corrected the variable name
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb+srv://geonheechoi:geonheechoi@cluster0.7ck5gen.mongodb.net/', {
    useNewUrlParser: true, // Added this option to avoid deprecation warning
    useUnifiedTopology: true, // Added this option to avoid deprecation warning
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log('Error while connecting to MongoDB');
  });

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

// Endpoint for user registration

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email }); // You need to import the User model
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.vertificationToken = crypto.randomBytes(20).toString('hex');

    await newUser.save();

    sendVertificationEmail(newUser.email, newUser.vertificationToken);
    res.status(200).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (e) {
    console.log(e, 'Error while registering new user');
    res.status(500).json({ message: 'Registration failed' });
  }
});

const sendVertificationEmail = async (email, vertificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fear5579@gmail.com',
      pass: 'cfymoqzpvekoeaic',
    },
  });

  const mailOptions = {
    from: 'matchmake.com',
    to: email,
    subject: 'Email verification',
    text: `Please click on the link below to verify your email: http://192.168.219.102:3000/verify-email/${vertificationToken}`,
  };
  // Send the mail
  try {
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e, 'Error while sending email');
  }
};
