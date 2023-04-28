console.log("login page")


let loginbutton = document.getElementById("loginbutton")
loginbutton.addEventListener("submit",(event) => {
    event.preventDefault();
    console.log('click');
    login();
})

function login() {
    console.log("logging in")
    let us = document.getElementById('usernameLogin').value;
    let pw = document.getElementById('passwordLogin').value;
    let data = {username: us, password: pw};
    let p = fetch( '/account/login/', {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });
    p.then((response) => {
      return response.text();
    }).then((text) => { 
      if (text.startsWith('s')) {
        alert(text);
        window.location.href = "http://localhost:3000/gamemodes.html";
      } else {
        alert('failed');
      }
    });
  }
  