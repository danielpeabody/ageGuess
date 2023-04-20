window.onload = function() {
    /*This function checkGuess(event) checks the event code to see if it is the enter key.
    then it checks to see if the guess is correct by sending a request using fetch to the server with
    the images id and the users guess. Then it checks the response from the server to see
    if the guess was correct or not. If it was correct it displays a message saying correct*/
    function checkGuess(event){
        if(event.keyCode == 13){
            let guess = document.getElementById('guess').value;
            let id = document.getElementById('id').value;
            let data = {id: id, guess: guess};
            fetch('/check/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function(response){
                response.json().then(function(data){
                    if(data.correct){
                        document.getElementById('message').innerHTML = "Correct";
                        getNewImage();
                    }
                    else{
                        document.getElementById('message').innerHTML = "Incorrect";
                    }
                });
            });
        }
    }

    function getNewImage(){
        fetch('/get/image')
        .then(function(response){
            response.json().then(function(data){
                document.getElementById('image').src = data.image;
                document.getElementById('id').value = data._id;
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

}