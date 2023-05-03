window.onload = function(){
    fetch('/get/leaderboard/athlete')
    .then(function(response){
        response.json().then(function(data){
            console.log(data);
            let table = document.getElementById('leaderboard');
            for(let i = 0; i < data.length; i++){
                let row = table.insertRow(i+1);
                let rank = row.insertCell(0);
                let username = row.insertCell(1);
                let score = row.insertCell(2);
                rank.innerHTML = i+1;
                username.innerHTML = data[i].username;
                score.innerHTML = data[i].score;
            }
        });
    });
}