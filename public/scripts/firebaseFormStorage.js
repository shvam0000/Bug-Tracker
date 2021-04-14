var firebaseConfig = {
    apiKey: 'AIzaSyA-zjlFKc1maHjqo2Onx_sRsaOwccc_MmA',
    authDomain: 'code-chef-srm-feedback-form.firebaseapp.com',
    databaseURL: 'https://code-chef-srm-feedback-form-default-rtdb.firebaseio.com',
    projectId: 'code-chef-srm-feedback-form',
    storageBucket: 'code-chef-srm-feedback-form.appspot.com',
    messagingSenderId: '417717367322',
    appId: '1:417717367322:web:167de4e5f33c804f5697a3',
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