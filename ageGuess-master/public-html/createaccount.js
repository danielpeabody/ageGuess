
let createbutton = document.getElementById("createbutton")
createbutton.addEventListener("submit",(event) => {
    event.preventDefault();
    console.log('click');
    createAccount();
})
function createAccount() {
    console.log('clicked')
    let us = document.getElementById('usernameCreate').value;
    let pw = document.getElementById('passwordCreate').value;
    let p = fetch('/account/create/' + us + '/' + pw);
    p.then((response) => {
      window.location.href = "http://localhost:3000/login.html";
      return response.text();
    }).then((text) => { 
      alert(text);
    });
  }
  