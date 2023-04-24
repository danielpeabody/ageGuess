
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
            let filename = document.getElementById('celebPic').alt;
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
                response.text().then(function(data){
                    if(data == "correct"){
                        document.getElementById('guessInput').classList.add('correct');
                        setTimeout(function(){
                            document.getElementById('guessInput').classList.remove('correct');
                        }, 1000); 
                        getNewImage();
                        document.getElementById('guessInput').value = "";
                        updateScore();
                        document.getElementById('curScore').innerText = "Current Score: " + curScorev;
                    }
                    else{
                        console.log("incorrect");
                        document.getElementById('guessInput').classList.add('incorrect');
                        setTimeout(function(){
                            document.getElementById('guessInput').classList.remove('incorrect');
                        }, 1000); // Remove the class after 1 second
                        document.getElementById('guessInput').value = "";
                        curScorev = 0;
                    }
                });
            });
        }
    }


    function getNewImage(){
        fetch('/get/image')
        .then(function(response){
            response.json().then(function(data){
                // const blob = new Blob([data.pic], { type: 'image/jpeg' });
                // const url = URL.createObjectURL(blob);
                const dataUrl = `data:image/jpeg;base64,${data.pic.toString('base64')}`;
                document.getElementById('celebPic').src = dataUrl;
                document.getElementById('celebPic').alt = data.filename;
                document.getElementById('celebName').innerText = data.name.split('_').join(' ');
                document.getElementById('dateTaken').innerText = "This photo was taken in "+ data.dateTaken;
            });
        });
    }

    const curScorev = 0;    
    function updateScore(){
        curScorev += 1;
    }

