require('dotenv').config();

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// reference contact info collections
let contactInfo = firebase.database().ref('infos');

document.getElementById('form').addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();

  let name = document.getElementById('name').value;
  //   let number = document.getElementById('number').value;
  let email = document.getElementById('email').value;
  let feedback = document.getElementById('message').value;

  saveContactInfo(name, email, feedback);

  document.getElementById('form').reset();

  sendMail(name, email, feedback);
}

// save infos to firebase
function saveContactInfo(name, email, feedback) {
  let newContactInfo = contactInfo.push();

  newContactInfo.set({
    name: name,
    email: email,
    feedback: feedback,
  });
}

//Send email
function sendMail(name, email, feedback) {
  Email.send({
    Host: 'smtp.gmail.com',
    Username: 'shivamshekhar0000@gmail.com',
    Password: 'pemukdoohhuiktrp',
    To: `${email}`,
    From: 'shivamshekhar0000@gmail.com',
    Subject: `${name}, Thanks for filling the contact form`,
    Body: `Thank you ${name} for contacting and puting in the valuable feedback. I'll contact you ASAP.
              <br/>Name: ${name} <br/> Message: ${feedback}`,
  }).then((message) => alert('The mail has been successfully sent'));
}
