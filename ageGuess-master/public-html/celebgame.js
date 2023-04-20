
window.onload = function(){
    getNewImage();
}

    /*This function checkGuess(event) checks the event code to see if it is the enter key.
    then it checks to see if the guess is correct by sending a request using fetch to the server with
    the images id and the users guess. Then it checks the response from the server to see
    if the guess was correct or not. If it was correct it displays a message saying correct*/
    function checkGuess(event){
        if(event.keyCode == 13){
            let guess = document.getElementById('guessInput').value;
            let filename = document.getElementById('celebPic').src;
            let data = {filename: filename, guess: guess};
            fetch('/check/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function(response){
                console.log(response);
                response.json().then(function(data){
                    if(data.correct){
                        alert("Correct");
                        getNewImage();
                    }
                    else{
                        alert("Incorrect");
                    }
                });
            });
        }
    }


    function getNewImage(){
        fetch('/get/image')
        .then(function(response){
            response.arrayBuffer().then(function(buffer){
                const blob = new Blob([buffer], { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                document.getElementById('celebPic').src = url;
            });
        });
    }

    
    function updateScore(){
        fetch('/get/score')
        .then(function(response){
            response.json().then(function(data){
                document.getElementById('score').innerHTML = data.score;
            });
        });
    }

