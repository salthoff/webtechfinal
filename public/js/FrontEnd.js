


function preprocess(originalString) {
    // Write a standard preprocessing pipeline for strings
    const regex_remove_tags = /(<([^>]+)>)/gmi;
    var return_string = originalString.replace(regex_remove_tags, ' ');
    var return_string = return_string.replace(/(\r\n|\n|\r)/gm, " ");
    const regex_rem_special = /[^a-zA-Z0-9 ]/gm;
    var return_string = return_string.replace(regex_rem_special, ' ')
    var return_string = return_string.replace(/[ ]{2,}/gm, ' ')
    var return_string = return_string.toLowerCase();
    var return_string = return_string.replace(/[ ]/gm, '+');
    return return_string;}

function httpGet(theUrl){
        const xhr = new XMLHttpRequest()
        var url = 'search' + theUrl;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
         if(xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
                showData(JSON.parse(xhr.responseText));
            
             } else {
                httpGet('/new');
            }
            }
        };
        xhr.send();
    }

    function httpGetQuestion(theUrl){
        const xhr = new XMLHttpRequest()
        var url = 'q' + theUrl;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
         if(xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
                showQuestion(JSON.parse(xhr.responseText));
            
             } else {
                //httpGet('/new');
            }
            }
        };
        xhr.send();
    }

    function httpPostNewQuestion(qid){
        var xhr = new XMLHttpRequest();
        var url = '/question/postanswer' 
        var data ={};
        data.text = document.getElementById('newanswer').answer
        data.Uid = 1;
        data.Qid = Number(qid);
        
        xhr.open("POST", url);

        //xhr.setRequestHeader("Accept", "application/json");
        //xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
            console.log(xhr.responseText);
        }};

        var data = String(data)

        xhr.send(data);

    }


function showData(data){
    let html = "";
    for(k in data){
        html += "<hr/>"
        html += "<p class='verticalLine'>" 
        html += "Score: " 
        html += "<br/>"          
        html += data[k].Score
        html += "</p>"
        html += "<p class='verticalLine'>" 
        html += "Date: "
        html += "<br/>"
        html += isoDateReviver(data[k].CreationDate)
        html += "</p>"
        html += "<div>"
        html += "<h2>"
        html += "<a href='/question?id=" + data[k].id + "'>"
        html += data[k].Title
        html += "</a>"
        html += "</h2>"
        html += "</div>"
        html += "<br/>"        
        html += "<hr/>"
    }
    document.getElementById("NewestQuestions").innerHTML = html
    
}
function showQuestion(data){
    //var thisQ = document.getElementById("thisQuestion");
    let html = "";
    html += "<hr/>"  
    html += "<h1>Question:</h1>"       
    html += "<p>"
    html += "<a href='editQuestion.html'>Edit this Question<a/>"
    html += "</p>" 
    html += "<p class='QuestionScore'>" 
    html += "Score: " 
    html += "<br/>"          
    html += data["question"].Score
    html += "</p>"
    html += "<p class='QuestionDate'>" 
    html += "Date: "
    html += "<br/>"
    html += isoDateReviver(data["question"].CreationDate)
    html += "</p>"
    html += "<p>Creator: "
    html += data["question"].Username + "</p>"
    html += "<div class=QuestionTitle>"
    html += "<h2>"
    html += data["question"].Title
    html += "</h2>"
    html += "</div>"
    html += "<br/>"
    html += "<div class ='QuestionBody'>"
    html += data["question"].Body
    html += "</div>"
    html += "<form method='PUT' id='upvote' action='upVoteQ?ID=" + data["question"].id + "> <input type= 'image' src=" 
    html += "../Images/UpVote_false"
    //html += data["question"].UpDownVote == 1 ? 1: false
    html += ".png"
    html += "></form>"
    html += "<form method='PUT' id='downvote' action='downVoteQ?ID=" + data["question"].id + "> <input type= 'image' src=" 
    html += "../Images/DownVote" + data["question"].UpDownVote + "png"
    html += "></form>"
    html += "<hr/>"
    html += "<hr/>" 


    for(k in data["answers"]){    
        html += "<p>"
        html += "<a href='editAnswer.html'>Edit this Answer<a/>"
        html += "</p>"
        html += "<p class='AnswerScore'>" 
        html += "Score: " 
        html += "<br/>"          
        html += data["answers"][k].Score
        html += "</p>"
        html += "<p class='AnswerDate'>" 
        html += "Date: "
        html += "<br/>"
        html += isoDateReviver(data["answers"][k].CreationDate)
        html += "</p>"                
        html += "<br/>"
        html += "<p>Creator: "
        html += data["answers"][k].Username + "</p>"
        html += "<div class ='AnswerBody'>"
        html += data["answers"][k].Body
        html += "<input type= 'image' onclick= 'upVote(" + data["answers"][k].id + ")' src=" 
        html += "../Images/UpVote_"
        html += data["answers"][k].UpDownVote
        html += ".png"
        html += ">"
        html += "<input type= 'image' onclick='downVote(" + data["answers"][k].id + ")' src=" 
        html += "../Images/DownVote_"
        html += data["answers"][k].UpDownVote
        html += ".png"
        html += ">"
        html += "</div>"
        html += "<hr/>"
    }
    
    document.getElementById("thisQuestion").innerHTML = html
    //thisQ.innerHTML = html;
    
}

function isoDateReviver(value) {
    //Copied from:
    //https://stackoverflow.com/questions/206384/how-do-i-format-a-microsoft-json-date
    if (typeof value === 'string') {
        var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
        if (a) {
            var utcMilliseconds = Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
            return new Date(utcMilliseconds);
        }
    }
    return value;
}


function upVote(QId){

}
