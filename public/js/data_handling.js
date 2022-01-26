const fs = require("fs")

const userDataJSON = __dirname + '/../data/UserData.json'
const qDataJSON = __dirname + '/../data/Questions.json'
const aDataJSON = __dirname + '/../data/Answers.json'
const testAnswer = __dirname + '/../data/Answers_head.json'
const testQuestion = __dirname + '/../data/Questions_head.json'
const answerdtoJSON = '/data/answerdto.json'
const likeQJSON = '/data/likeQ.json'
const clapOnQJSON = '/data/clapOnQ.json'
const upDownVoteQJSON = __dirname + '/../data/upDownVoteQ.json'
const starVoteQJSON = '/data/starVoteQ.json'
const likeAJSON = '/data/likeA.json'
const clapOnAJSON = '/data/clapOnA.json'
const upDownVoteAJSON = '/data/upDownVoteA.json'
const starVoteAJSON = '/data/starVoteA.json'
 
function examplefunction() {
    alert('Hallo')
    
}   

function logIn(username = '', pw = ''){
    const userdata = {}
    if(username == '' || pw == ''){
        return false;
    }
    //lookup UserData for username and Password:
    const data = loadJSON(userDataJSON);
    for(user in data){
        if(data[user].username == username){
            if(data[user].password == pw){    
                userdata[user] = data[user].username            
                return userdata
            }else{
                return false;
            }
        }
    }
    return false;
    
}

function registerNewUser(username = '', pw = '')
{
    if(username == '' || pw == ''){
        return false;
    }
    const data = loadJSON(userDataJSON)
    for(let key in data){
        if(data[key].username == username){
            return false;
        }
    }
    
    //console.log(data)
    var key = getRandomNumber(data)
    var user = {username: username, password: pw};
    saveJSON(userDataJSON, user, key);
}

function resetPW(username = '', newPw = ' ', newPW_again = ''){
    if(username == '' ){
        alert("Username or Password empty\n");
    }
    if(newPw == '' || newPW_again == ''){
        alert("No empty Password allowed")
    }
    if(newPW_again != newPw){
        alert("Passwords didn't match\n")
    }
    //lookup UserData for username and Password:
    const data = loadJSON(userDataJSON);
    for(user in data){
        if(data[user].username == username){
            if(data[user].password == pw){                
                //save to JSON
                data[user].password = newPW;
                saveJSON(userDataJSON, data[user]);
                return true;
                //return 
                //TODO Update JSON File
            }else{
                alert("worng Passwort\n")
            }
        }
    }
    alert("unknowen User. Register now\n")
}

function getAllQuestions(){
    return loadJSON(qDataJSON)
}

function getAllAnswers(){
    return loadJSON(aDataJSON)
}

function getHighestRatetQuestions(number = 5){
    const data = loadJSON(qDataJSON)
    const rated = []
    var i = 0
    const questions = {}
    for(var key in data){
        rated.push(data[key])                      
    }
    rated.sort(function (a, b){
        return (b.Score - a.Score)
    });
    i=0
    while(i < number){
        newest[i]+= {numAnswers:getNumberOfAnswers(questions[i])}
        questions[i] = rated[i]
        i++
    }

    if(UId){
        //also receive the Rating Data
    }


    return questions
}

function getNewestQuestions(number = 5){
    const data = loadJSON(qDataJSON)
    const newest = []
    var i = 0
    const questions = []
    for(var key in data){
        var quest = data[key];
        quest.id = key;
        newest.push(quest)                      
    }
    
    newest.sort(function (a, b) {
        return (isoDateReviver(b.CreationDate) - isoDateReviver(a.CreationDate))
    });
    i=0
    while(i < number){
        //newest[i]+= {numAnswers:getNumberOfAnswers(questions[i])}
        //questions[i] = newest[i]
        questions.push(newest[i]);
        i++
    }
    return questions
}

function getNumberOfAnswers(QId){
    const answers = loadJSON(aDataJSON)
    var numAnswers = 0
    for(k in answers){
        if(answers[k].ParentId == QId){
            numAnswers += 1;
        }
    }
    return numAnswers;
}

function getMyQuestions(QId){
    const questions = loadJSON(qDataJSON)
    var myQ = {}

    for(k in questions){
        if(questions[k].OwnerUserId == QId){
            myQ[k] = questions[k]
        }
    }
    return myQ
}

function getMyAnswers(QId){
    const answers = loadJSON(aDataJSON)
    var myA = {}
    for(k in answers){
        if (answers[k].OwnerUserId == QId){
            myA[k] = answers[k]
        }
    }
    return myA
}

function likeQ(QId, UId){
    //TODO Implement Toggle
    const like = loadJSON(likeQJSON)    //open or create Up Down Vote json
    //Write QID and UId into up_downVoteQ.json        
    like[QId+UId] = {QId: QId, UId: UId}
    saveJSON(likeQJSON, clap)
    openQuestion(QId, UId)
}

function dislikeQ(QId, UId){
    //TODO Implement Toggle
    const like = loadJSON(likeQJSON)    //open or create Up Down Vote json
    var dislike
    for(cl in like)
    {
        if(QId+UId == cl){
            continue
        }
        dislike[cl] = like[cl]
    }
    saveJSON(likeQJSON, dislike)
    openQuestion(QId, UId)
}


function clapQ(QId, UId){
    //Can be used Multiple Times?
    const clap = loadJSON(clapOnQJSON)    //open or create Up Down Vote json
    //Write QID and UId into up_downVoteQ.json
    for(key in clap){
        if(key == QId + UId){//found in Json
            clap[key].claps ++;
            saveJSON(clapOnQJSON)
            openQuestion(QId, UId)
            return
        }
    }

    clap[QId+UId] = {QId: QId, UId: UId, claps : 1};
    saveJSON(clapOnQJSON, clap)
    openQuestion(QId, UId)

}

function upvoteQ(QId, UId){
    const questions = loadJSON(qDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteQJSON)    //open or create Up Down Vote json

    if(QId+UId in updown && updown[QId+UId]. like_dislike == 1){
        return
    }
    //Find Question
    for(let key in questions){
        if(key == QId){            
            questions[key].Score++
            //update JSON File
            saveJSON(qDataJSON, questions)
            //TODO
            break
        }
    }

    //Write QID and UId into up_downVoteQ.json
    updown[QId+UId] = {QId: QId, UId: UId, like_dislike: 1}
    saveJSON(upDownVoteQJSON, updown)
    openQuestion(QId, UId)
}
function upvoteA(AId, UId, QId){
    const answers = loadJSON(aDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteAJSON)    //open or create Up Down Vote json

    if(AId+UId in updown && updown[QId+UId]. like_dislike == 1){
        return
    }
    //Find Question
    for(let key in answers){
        if(key == QId){            
            answers[key].Score++
            //update JSON File
            saveJSON(aDataJSON, answers)
            //TODO
            break
        }
    }

    //Write QID and UId into up_downVoteQ.json
    updown[AId+UId] = {AId: AId, UId: UId, like_dislike: 1}
    saveJSON(upDownVoteAJSON, updown)
    openQuestion(QId, UId)
}

function downvoteQ(QId){
    const questions = loadJSON(qDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteQJSON)    //open or create Up Down Vote json
    if(QId+UId in updown && updown[QId+UId]. like_dislike == 2){
        return
    }
    //Find Question
    for(let key in questions){
        if(key == QId){
            questions[key].Score--
            //update JSON File
            saveJSON(qDataJSON, questions)
            break
        }
    }

    //Write QID and UId into up_downVoteQ.json
    updown[QId+UId] = {QId: QId, UId: UId, like_dislike: 2}
    saveJSON(upDownVoteQJSON, updown)
    openQuestion(QId, UId)
}

function downvoteA(AId, QId){
    const answers = loadJSON(aDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteAJSON)    //open or create Up Down Vote json
    if(AId+UId in updown && updown[AId+UId]. like_dislike == 2){
        return
    }
    //Find Question
    for(let key in answers){
        if(key == QId){
            answers[key].Score--
            //update JSON File
            saveJSON(qDataJSON, answers)
            break
        }
    }

    //Write QID and UId into up_downVoteQ.json
    updown[AId+UId] = {AId: AId, UId: UId, like_dislike: 2}
    saveJSON(upDownVoteAJSON, updown)
    openQuestion(QId, UId)
}

function starRateQ(QId, UId){
    const star = loadJSON(starVoteQJSON)
    star[QID+UID] = {QId: QId, UId: UId}
    saveJSON(starVoteQJSON, star)
    openQuestion(QId, UId)
}

function unstarRateQ(QId, UId){
    const star = loadJSON(starRateQ)
    var unstar
    for(k in star){
        if(star[k] == QId+UId){
            continue
        }
        unstar[k] = star[k]
    }
    saveJSON(starVoteQJSON, unstar)
    openQuestion(QId, UId)
}

function starRateA(AId, QId, UId){
    const star = loadJSON(starVoteAJSON)
    star[AId+UId] = {AId: AId, UId: UId}
    saveJSON(starVoteAJSON, star)
    openQuestion(QId, UId)
}

function unstarRateA(AId, QId, UId){
    const star = loadJSON(starVoteAJSON)
    var unstar
    for(k in star){
        if(star[k] == AId+UId){
            continue
        }
        unstar[k] = star[k]
    }
    saveJSON(starVoteAJSON, unstar)
    openQuestion(QId, UId)
}

function likeA(AId, QId, UId){
    //TODO Implement Toggle
    const like = loadJSON(likeAJSON)    //open or create Up Down Vote json
    //Write AID and UId into up_downVoteQ.json
    for(key in like){
        if(key == AId + UId){
            clap[key].Score++;
            saveJSON(likeAJSON, like)
            openQuestion(QId, UId)
            return
        }
    }
    like[AId+UId] = {AId: AId, UId: UId, Like:1}
    saveJSON(likeAJSON, like)
    openQuestion(QId, UId)
    
    
}

function clapA(AId, QId, UId){
    const clap = loadJSON(clapOnAJSON)    //open or create Up Down Vote json
    //Write QID and UId into up_downVoteQ.json
    for(key in clap){
        if(key == AId + UId){//found in Json
            clap[key].claps ++;
            saveJSON(clapOnAJSON)
            openQuestion(QId, UId)
            return
        }
    }

    clap[AId+UId] = {AId: AId, UId: UId, claps : 1};
    saveJSON(clapOnQJSON, clap)
    openQuestion(QId, UId)

}

function upvoteA(AId, QID, UId){
    const answers = loadJSON(aDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteAJSON)    //open or create Up Down Vote json

    if(AId+UId in updown){
        return
    }
    //Find Question
    for(let key in answers){
        if(key == AId){
            answers[key].Score++
            //update JSON File
            saveJSON(aDataJSON, questions)
            upd
            break
        }
    }

    //Write QID and UId into up_downVoteQ.json
    updown[AId+UId] = {AId: AId, UId: UId, like_dislike: 1}
    saveJSON(upDownVoteAJSON, updown)
    openQuestion(QId, UId)

}

function downvoteQ(AId){
    const answers = loadJSON(aDataJSON)       //open or create Question.Json
    const updown = loadJSON(upDownVoteAJSON)    //open or create Up Down Vote json

    //Find Question
    for(let key in answers){
        if(key == AId){
            answers[key].Score--
            //update JSON File
            saveJSON(aDataJSON, questions)
            break
        }
    }

    //Write AId and UId into up_downVoteQ.json
    updown[AId+UId] = {AId: AId, UId: UId, like_dislike: 2}
    saveJSON(upDownVoteAJSON, updown)
    openQuestion(QId, UId)

}


function openQuestion(QId ,UId = 0){

    //UId != 0 -> User is logged in. Also get the Rating for this Question
    
    const result =  {}
    //get Question:
    const questions = loadJSON(qDataJSON)
    questions[QId].Username = getUserByID(questions[QId].OwnerUserId)
    questions[QId].id = QId
    questions[QId].UpDownVote = getQuestionVoteByUser(UId, QId);
    result.question = questions[QId]
    
    //get all related Answers:
    const answers = loadJSON(aDataJSON)
    //console.log(answers)
    answerArray = []
    for(a in answers){
        if(answers[a].ParentId == QId){
            //found a Answer that belongs to the Question
            //Add UserName to the return JSON
            answers[a].id = a;
            answers[a].Username = getUserByID(answers[a].OwnerUserId)
            answers[a].UpDownVote = getAnswerVoteByUser(UId, a)

            answerArray.push(answers[a]) //write to AnswerArray
        }
    }

    //sort answers by Date
    answerArray.sort(function (a, b) {
        //console.log(isoDateReviver(b.CreationDate))
        //console.log(isoDateReviver(a.CreationDate))
        return (isoDateReviver(a.CreationDate) - isoDateReviver(b.CreationDate))
    });
    //console.log(answerArray)
    //write answerArray to Object
    result.answers = answerArray
    
    
    return result
}

function writeNewAnswer(QId, UId, body){
    const answers = loadJSON(aDataJSON)
    date = new Date()
    var newanswer = {};

    newanswer = {OwnerUserId : UId, CreationDate : JSON.stringify(date), ParentId : QId, Score : 0, Body : body}

    //saveJSON(aDataJSON, newanswer)
    saveJSON(aDataJSON, newanswer,getRandomNumber(answers))
    //openQuestion(QId, UId)
}

function writeNewQuestion(UId, Title, Body){
    const questions = loadJSON(qDataJSON)

    date = new Date()
    var newQID = getRandomNumber(questions)
    newquestion = {OwnerUserId : UId, CreationDate : JSON.stringify(date), Score : 0, Title: Title, Body : Body}

    saveJSON(qDataJSON, newquestion, newQID)
    return newQID;
    //openQuestion(newQID, UId)
}

function editQuestion(QId, Title, Body){
    const question = loadJSON(qDataJSON)


    //find Question
    try{
        question[QId].Title = Title
        question[QId].Body = Body
    }catch(e){
        alert("Could not find Question in Database")
    }
    saveJSON(qDataJSON, question)
}

function editAnswer(AId, Body){
    const answers = loadJSON(aDataJSON)

    try {
        answers[AId].Body = Body
    } catch (error) {
        alert("Could not find Answer in Database")            
    }
}

function deleteQuestion(QId, UId){
    const question = loadJSON(qDataJSON)
    var deleted
    for(k in question){
        if(k == QId){
            if(question[k].OwnerUserId != UId){
                alert("You are not the Creator of the Question")
            }
            continue
        }
        deleted[k] = question[k];
    }
    saveJSON(qDataJSON, deleted)

    //also delete the Answers of the Questions
    const answers = loadJSON(aDataJSON)
    var answerdeleted
    for(a in answers)
    {
        if(answers[a].ParentId == QId){
            continue
        }
        answerdeleted[a] = answers[a]
    }
    saveJSON(aDataJSON, answerdeleted)
}

function deleteAnswer(AId, QId, UId){
    const answers = loadJSON(aDataJSON)
    
    var answerdeleted
    for(a in answers)
    {
        if(answers[a].ParentId == QId){
            if(answer[a].OwnerUserId != UId){
                alert("You are not the Creator of the Answer")
            }
            continue
        }
        answerdeleted[a] = answers[a]
    }
    saveJSON(aDataJSON, answerdeleted)
}    

function loadJSON(filename){
    return JSON.parse(
        fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        : '{}'
    )
}

function saveJSON(filename, json, key){
    let savedjson = JSON.parse(fs.readFileSync(filename))
    savedjson[key]=json
    fs.writeFileSync(filename, JSON.stringify(savedjson, null, 2));
}

function getRandomNumber(data){
    var len = 10;
    var newid = parseInt((Math. random() * 9 + 1) * Math. pow(10,len-1), 10); 
    for(key in data){
        if(key == newid){
            getRandomNumber(data)
        }
    }
    return newid;
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

function getAnswerclapByUser(UId, AId){
    clap = loadJSON(clapOnAJSON)

    for(k in clap){
        if(UId + AId == k){
            return true
        }
    }
    return null
}

function getQuestionclapByUser(UId, QId){
    clap = loadJSON(clapOnQJSON)

    for(k in clap){
        if(UId + QId == k){
            return true
        }
    }
    return null
}

function getAnswerLikeByUser(UId, AId){
    const like = loadJSON(likeAJSON)

    for(k in like){
        if(k == UId + AId){
            return true
        }
    }
    return null
}

function getQuestionLikeByUser(UId, QId){
    const like = loadJSON(likeQJSON)

    for(k in like){
        if(k == UId + QId){
            return true
        }
    }
    return null
}

function getQuestionVoteByUser(UId, QId) {
    const vote = loadJSON(upDownVoteQJSON)
    for(k in vote){
        if(k == QId + UId){
            return vote[k].like_dislike
        }
    }
    return false;
}

function getAnswerVoteByUser(UId, AId) {
    const vote = loadJSON(upDownVoteAJSON)
    for(k in vote){
        if(k == AId + UId){
            return vote[k].like_dislike            
        }
    }
    return false;
}  


function getStarAVoteByUser(UId, AId){
    const star = loadJSON(starRateA)
    for(k in star){
        if(k == AId+UId){
            return true
        }
    }
    return null
}

function getStarAVoteByUser(QId, AId){
    const star = loadJSON(starRateQ)
    for(k in star){
        if(k == QId+UId){
            return true
        }
    }
    return null
}

function getUserByID(UId){
    const user = loadJSON(userDataJSON) //Open User Json
    for(key in user){
        if(key == UId){
            return user[key].username
        }
    }
    return JSON.stringify("deleted User")

}

function getAnswerByID(AId){
    const answer = loadJSON(aDataJSON)
    for(key in answer){
        if(key == AId){
            return answer[key]
        }
    }
}

function getQuestionByID(QId){
    const question = loadJSON(qDataJSON)

    for(key in question){
        if(key == QId){
            //console.log(question[key]);
            return question[key]
        }
    }
}

function getQuestionsFromSimilar(similarity, limit = 10){
    questions = [];
    var i = 0;
    for (var key in similarity){
        var question = getQuestionByID(similarity[key].id);
        question.id = similarity[key].id;
        questions.push(question);
        if(i > limit){
            break;
        }
        i++;
    }
    //console.log(questions);
    return questions;
}

function genRandUserName(){
    var name1 =  ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable","ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing","anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive","appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive","attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish","bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big","big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful","blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable","brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly","bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring","cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean","clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless","colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete","confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny","corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked","crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp","dangerous","dapper","daring","darling","dark","dazzling","dead","deadly","deafening","dear","dearest","decent","decimal","decisive","deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful","delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted","different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting","disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy","dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager","earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant","elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened","enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting","every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert","extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous","fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless","feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky","flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused","fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed","free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty","frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous","gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening","glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand","grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled","gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible","gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless","harmonious","harsh","hasty","hateful","haunting","healthy","heartfelt","hearty","heavenly","heavy","hefty","helpful","helpless","hidden","hideous","high","high-level","hilarious","hoarse","hollow","homely","honest","honorable","honored","hopeful","horrible","hospitable","hot","huge","humble","humiliating","humming","humongous","hungry","hurtful","husky","icky","icy","ideal","idealistic","identical","idle","idiotic","idolized","ignorant","ill","illegal","ill-fated","ill-informed","illiterate","illustrious","imaginary","imaginative","immaculate","immaterial","immediate","immense","impassioned","impeccable","impartial","imperfect","imperturbable","impish","impolite","important","impossible","impractical","impressionable","impressive","improbable","impure","inborn","incomparable","incompatible","incomplete","inconsequential","incredible","indelible","inexperienced","indolent","infamous","infantile","infatuated","inferior","infinite","informal","innocent","insecure","insidious","insignificant","insistent","instructive","insubstantial","intelligent","intent","intentional","interesting","internal","international","intrepid","ironclad","irresponsible","irritating","itchy","jaded","jagged","jam-packed","jaunty","jealous","jittery","joint","jolly","jovial","joyful","joyous","jubilant","judicious","juicy","jumbo","junior","jumpy","juvenile","kaleidoscopic","keen","key","kind","kindhearted","kindly","klutzy","knobby","knotty","knowledgeable","knowing","known","kooky","kosher","lame","lanky","large","last","lasting","late","lavish","lawful","lazy","leading","lean","leafy","left","legal","legitimate","light","lighthearted","likable","likely","limited","limp","limping","linear","lined","liquid","little","live","lively","livid","loathsome","lone","lonely","long","long-term","loose","lopsided","lost","loud","lovable","lovely","loving","low","loyal","lucky","lumbering","luminous","lumpy","lustrous","luxurious","mad","made-up","magnificent","majestic","major","male","mammoth","married","marvelous","masculine","massive","mature","meager","mealy","mean","measly","meaty","medical","mediocre","medium","meek","mellow","melodic","memorable","menacing","merry","messy","metallic","mild","milky","mindless","miniature","minor","minty","miserable","miserly","misguided","misty","mixed","modern","modest","moist","monstrous","monthly","monumental","moral","mortified","motherly","motionless","mountainous","muddy","muffled","multicolored","mundane","murky","mushy","musty","muted","mysterious","naive","narrow","nasty","natural","naughty","nautical","near","neat","necessary","needy","negative","neglected","negligible","neighboring","nervous","new","next","nice","nifty","nimble","nippy","nocturnal","noisy","nonstop","normal","notable","noted","noteworthy","novel","noxious","numb","nutritious","nutty","obedient","obese","oblong","oily","oblong","obvious","occasional","odd","oddball","offbeat","offensive","official","old","old-fashioned","only","open","optimal","optimistic","opulent","orange","orderly","organic","ornate","ornery","ordinary","original","other","our","outlying","outgoing","outlandish","outrageous","outstanding","oval","overcooked","overdue","overjoyed","overlooked","palatable","pale","paltry","parallel","parched","partial","passionate","past","pastel","peaceful","peppery","perfect","perfumed","periodic","perky","personal","pertinent","pesky","pessimistic","petty","phony","physical","piercing","pink","pitiful","plain","plaintive","plastic","playful","pleasant","pleased","pleasing","plump","plush","polished","polite","political","pointed","pointless","poised","poor","popular","portly","posh","positive","possible","potable","powerful","powerless","practical","precious","present","prestigious","pretty","precious","previous","pricey","prickly","primary","prime","pristine","private","prize","probable","productive","profitable","profuse","proper","proud","prudent","punctual","pungent","puny","pure","purple","pushy","putrid","puzzled","puzzling","quaint","qualified","quarrelsome","quarterly","queasy","querulous","questionable","quick","quick-witted","quiet","quintessential","quirky","quixotic","quizzical","radiant","ragged","rapid","rare","rash","raw","recent","reckless","rectangular","ready","real","realistic","reasonable","red","reflecting","regal","regular","reliable","relieved","remarkable","remorseful","remote","repentant","required","respectful","responsible","repulsive","revolving","rewarding","rich","rigid","right","ringed","ripe","roasted","robust","rosy","rotating","rotten","rough","round","rowdy","royal","rubbery","rundown","ruddy","rude","runny","rural","rusty","sad","safe","salty","same","sandy","sane","sarcastic","sardonic","satisfied","scaly","scarce","scared","scary","scented","scholarly","scientific","scornful","scratchy","scrawny","second","secondary","second-hand","secret","self-assured","self-reliant","selfish","sentimental","separate","serene","serious","serpentine","several","severe","shabby","shadowy","shady","shallow","shameful","shameless","sharp","shimmering","shiny","shocked","shocking","shoddy","short","short-term","showy","shrill","shy","sick","silent","silky","silly","silver","similar","simple","simplistic","sinful","single","sizzling","skeletal","skinny","sleepy","slight","slim","slimy","slippery","slow","slushy","small","smart","smoggy","smooth","smug","snappy","snarling","sneaky","sniveling","snoopy","sociable","soft","soggy","solid","somber","some","spherical","sophisticated","sore","sorrowful","soulful","soupy","sour","Spanish","sparkling","sparse","specific","spectacular","speedy","spicy","spiffy","spirited","spiteful","splendid","spotless","spotted","spry","square","squeaky","squiggly","stable","staid","stained","stale","standard","starchy","stark","starry","steep","sticky","stiff","stimulating","stingy","stormy","straight","strange","steel","strict","strident","striking","striped","strong","studious","stunning","stupendous","stupid","sturdy","stylish","subdued","submissive","substantial","subtle","suburban","sudden","sugary","sunny","super","superb","superficial","superior","supportive","sure-footed","surprised","suspicious","svelte","sweaty","sweet","sweltering","swift","sympathetic","tall","talkative","tame","tan","tangible","tart","tasty","tattered","taut","tedious","teeming","tempting","tender","tense","tepid","terrible","terrific","testy","thankful","that","these","thick","thin","third","thirsty","this","thorough","thorny","those","thoughtful","threadbare","thrifty","thunderous","tidy","tight","timely","tinted","tiny","tired","torn","total","tough","traumatic","treasured","tremendous","tragic","trained","tremendous","triangular","tricky","trifling","trim","trivial","troubled","true","trusting","trustworthy","trusty","truthful","tubby","turbulent","twin","ugly","ultimate","unacceptable","unaware","uncomfortable","uncommon","unconscious","understated","unequaled","uneven","unfinished","unfit","unfolded","unfortunate","unhappy","unhealthy","uniform","unimportant","unique","united","unkempt","unknown","unlawful","unlined","unlucky","unnatural","unpleasant","unrealistic","unripe","unruly","unselfish","unsightly","unsteady","unsung","untidy","untimely","untried","untrue","unused","unusual","unwelcome","unwieldy","unwilling","unwitting","unwritten","upbeat","upright","upset","urban","usable","used","useful","useless","utilized","utter","vacant","vague","vain","valid","valuable","vapid","variable","vast","velvety","venerated","vengeful","verifiable","vibrant","vicious","victorious","vigilant","vigorous","villainous","violet","violent","virtual","virtuous","visible","vital","vivacious","vivid","voluminous","wan","warlike","warm","warmhearted","warped","wary","wasteful","watchful","waterlogged","watery","wavy","wealthy","weak","weary","webbed","wee","weekly","weepy","weighty","weird","welcome","well-documented","well-groomed","well-informed","well-lit","well-made","well-off","well-to-do","well-worn","wet","which","whimsical","whirlwind","whispered","white","whole","whopping","wicked","wide","wide-eyed","wiggly","wild","willing","wilted","winding","windy","winged","wiry","wise","witty","wobbly","woeful","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag","rocky"];

    var name2 = ["people","history","way","art","world","information","map","family","government","health","system","computer","meat","year","thanks","music","person","reading","method","data","food","understanding","theory","law","bird","literature","problem","software","control","knowledge","power","ability","economics","love","internet","television","science","library","nature","fact","product","idea","temperature","investment","area","society","activity","story","industry","media","thing","oven","community","definition","safety","quality","development","language","management","player","variety","video","week","security","country","exam","movie","organization","equipment","physics","analysis","policy","series","thought","basis","boyfriend","direction","strategy","technology","army","camera","freedom","paper","environment","child","instance","month","truth","marketing","university","writing","article","department","difference","goal","news","audience","fishing","growth","income","marriage","user","combination","failure","meaning","medicine","philosophy","teacher","communication","night","chemistry","disease","disk","energy","nation","road","role","soup","advertising","location","success","addition","apartment","education","math","moment","painting","politics","attention","decision","event","property","shopping","student","wood","competition","distribution","entertainment","office","population","president","unit","category","cigarette","context","introduction","opportunity","performance","driver","flight","length","magazine","newspaper","relationship","teaching","cell","dealer","debate","finding","lake","member","message","phone","scene","appearance","association","concept","customer","death","discussion","housing","inflation","insurance","mood","woman","advice","blood","effort","expression","importance","opinion","payment","reality","responsibility","situation","skill","statement","wealth","application","city","county","depth","estate","foundation","grandmother","heart","perspective","photo","recipe","studio","topic","collection","depression","imagination","passion","percentage","resource","setting","ad","agency","college","connection","criticism","debt","description","memory","patience","secretary","solution","administration","aspect","attitude","director","personality","psychology","recommendation","response","selection","storage","version","alcohol","argument","complaint","contract","emphasis","highway","loss","membership","possession","preparation","steak","union","agreement","cancer","currency","employment","engineering","entry","interaction","limit","mixture","preference","region","republic","seat","tradition","virus","actor","classroom","delivery","device","difficulty","drama","election","engine","football","guidance","hotel","match","owner","priority","protection","suggestion","tension","variation","anxiety","atmosphere","awareness","bread","climate","comparison","confusion","construction","elevator","emotion","employee","employer","guest","height","leadership","mall","manager","operation","recording","respect","sample","transportation","boring","charity","cousin","disaster","editor","efficiency","excitement","extent","feedback","guitar","homework","leader","mom","outcome","permission","presentation","promotion","reflection","refrigerator","resolution","revenue","session","singer","tennis","basket","bonus","cabinet","childhood","church","clothes","coffee","dinner","drawing","hair","hearing","initiative","judgment","lab","measurement","mode","mud","orange","poetry","police","possibility","procedure","queen","ratio","relation","restaurant","satisfaction","sector","signature","significance","song","tooth","town","vehicle","volume","wife","accident","airport","appointment","arrival","assumption","baseball","chapter","committee","conversation","database","enthusiasm","error","explanation","farmer","gate","girl","hall","historian","hospital","injury","instruction","maintenance","manufacturer","meal","perception","pie","poem","presence","proposal","reception","replacement","revolution","river","son","speech","tea","village","warning","winner","worker","writer","assistance","breath","buyer","chest","chocolate","conclusion","contribution","cookie","courage","desk","drawer","establishment","examination","garbage","grocery","honey","impression","improvement","independence","insect","inspection","inspector","king","ladder","menu","penalty","piano","potato","profession","professor","quantity","reaction","requirement","salad","sister","supermarket","tongue","weakness","wedding","affair","ambition","analyst","apple","assignment","assistant","bathroom","bedroom","beer","birthday","celebration","championship","cheek","client","consequence","departure","diamond","dirt","ear","fortune","friendship","funeral","gene","girlfriend","hat","indication","intention","lady","midnight","negotiation","obligation","passenger","pizza","platform","poet","pollution","recognition","reputation","shirt","speaker","stranger","surgery","sympathy","tale","throat","trainer","uncle","youth","time","work","film","water","money","example","while","business","study","game","life","form","air","day","place","number","part","field","fish","back","process","heat","hand","experience","job","book","end","point","type","home","economy","value","body","market","guide","interest","state","radio","course","company","price","size","card","list","mind","trade","line","care","group","risk","word","fat","force","key","light","training","name","school","top","amount","level","order","practice","research","sense","service","piece","web","boss","sport","fun","house","page","term","test","answer","sound","focus","matter","kind","soil","board","oil","picture","access","garden","range","rate","reason","future","site","demand","exercise","image","case","cause","coast","action","age","bad","boat","record","result","section","building","mouse","cash","class","period","plan","store","tax","side","subject","space","rule","stock","weather","chance","figure","man","model","source","beginning","earth","program","chicken","design","feature","head","material","purpose","question","rock","salt","act","birth","car","dog","object","scale","sun","note","profit","rent","speed","style","war","bank","craft","half","inside","outside","standard","bus","exchange","eye","fire","position","pressure","stress","advantage","benefit","box","frame","issue","step","cycle","face","item","metal","paint","review","room","screen","structure","view","account","ball","discipline","medium","share","balance","bit","black","bottom","choice","gift","impact","machine","shape","tool","wind","address","average","career","culture","morning","pot","sign","table","task","condition","contact","credit","egg","hope","ice","network","north","square","attempt","date","effect","link","post","star","voice","capital","challenge","friend","self","shot","brush","couple","exit","front","function","lack","living","plant","plastic","spot","summer","taste","theme","track","wing","brain","button","click","desire","foot","gas","influence","notice","rain","wall","base","damage","distance","feeling","pair","savings","staff","sugar","target","text","animal","author","budget","discount","file","ground","lesson","minute","officer","phase","reference","register","sky","stage","stick","title","trouble","bowl","bridge","campaign","character","club","edge","evidence","fan","letter","lock","maximum","novel","option","pack","park","quarter","skin","sort","weight","baby","background","carry","dish","factor","fruit","glass","joint","master","muscle","red","strength","traffic","trip","vegetable","appeal","chart","gear","ideal","kitchen","land","log","mother","net","party","principle","relative","sale","season","signal","spirit","street","tree","wave","belt","bench","commission","copy","drop","minimum","path","progress","project","sea","south","status","stuff","ticket","tour","angle","blue","breakfast","confidence","daughter","degree","doctor","dot","dream","duty","essay","father","fee","finance","hour","juice","luck","milk","mouth","peace","pipe","stable","storm","substance","team","trick","afternoon","bat","beach","blank","catch","chain","consideration","cream","crew","detail","gold","interview","kid","mark","mission","pain","pleasure","score","screw","sex","shop","shower","suit","tone","window","agent","band","bath","block","bone","calendar","candidate","cap","coat","contest","corner","court","cup","district","door","east","finger","garage","guarantee","hole","hook","implement","layer","lecture","lie","manner","meeting","nose","parking","partner","profile","rice","routine","schedule","swimming","telephone","tip","winter","airline","bag","battle","bed","bill","bother","cake","code","curve","designer","dimension","dress","ease","emergency","evening","extension","farm","fight","gap","grade","holiday","horror","horse","host","husband","loan","mistake","mountain","nail","noise","occasion","package","patient","pause","phrase","proof","race","relief","sand","sentence","shoulder","smoke","stomach","string","tourist","towel","vacation","west","wheel","wine","arm","aside","associate","bet","blow","border","branch","breast","brother","buddy","bunch","chip","coach","cross","document","draft","dust","expert","floor","god","golf","habit","iron","judge","knife","landscape","league","mail","mess","native","opening","parent","pattern","pin","pool","pound","request","salary","shame","shelter","shoe","silver","tackle","tank","trust","assist","bake","bar","bell","bike","blame","boy","brick","chair","closet","clue","collar","comment","conference","devil","diet","fear","fuel","glove","jacket","lunch","monitor","mortgage","nurse","pace","panic","peak","plane","reward","row","sandwich","shock","spite","spray","surprise","till","transition","weekend","welcome","yard","alarm","bend","bicycle","bite","blind","bottle","cable","candle","clerk","cloud","concert","counter","flower","grandfather","harm","knee","lawyer","leather","load","mirror","neck","pension","plate","purple","ruin","ship","skirt","slice","snow","specialist","stroke","switch","trash","tune","zone","anger","award","bid","bitter","boot","bug","camp","candy","carpet","cat","champion","channel","clock","comfort","cow","crack","engineer","entrance","fault","grass","guy","hell","highlight","incident","island","joke","jury","leg","lip","mate","motor","nerve","passage","pen","pride","priest","prize","promise","resident","resort","ring","roof","rope","sail","scheme","script","sock","station","toe","tower","truck","witness","can","will","other","use","make","good","look","help","go","great","being","still","public","read","keep","start","give","human","local","general","specific","long","play","feel","high","put","common","set","change","simple","past","big","possible","particular","major","personal","current","national","cut","natural","physical","show","try","check","second","call","move","pay","let","increase","single","individual","turn","ask","buy","guard","hold","main","offer","potential","professional","international","travel","cook","alternative","special","working","whole","dance","excuse","cold","commercial","low","purchase","deal","primary","worth","fall","necessary","positive","produce","search","present","spend","talk","creative","tell","cost","drive","green","support","glad","remove","return","run","complex","due","effective","middle","regular","reserve","independent","leave","original","reach","rest","serve","watch","beautiful","charge","active","break","negative","safe","stay","visit","visual","affect","cover","report","rise","walk","white","junior","pick","unique","classic","final","lift","mix","private","stop","teach","western","concern","familiar","fly","official","broad","comfortable","gain","rich","save","stand","young","heavy","lead","listen","valuable","worry","handle","leading","meet","release","sell","finish","normal","press","ride","secret","spread","spring","tough","wait","brown","deep","display","flow","hit","objective","shoot","touch","cancel","chemical","cry","dump","extreme","push","conflict","eat","fill","formal","jump","kick","opposite","pass","pitch","remote","total","treat","vast","abuse","beat","burn","deposit","print","raise","sleep","somewhere","advance","consist","dark","double","draw","equal","fix","hire","internal","join","kill","sensitive","tap","win","attack","claim","constant","drag","drink","guess","minor","pull","raw","soft","solid","wear","weird","wonder","annual","count","dead","doubt","feed","forever","impress","repeat","round","sing","slide","strip","wish","combine","command","dig","divide","equivalent","hang","hunt","initial","march","mention","spiritual","survey","tie","adult","brief","crazy","escape","gather","hate","prior","repair","rough","sad","scratch","sick","strike","employ","external","hurt","illegal","laugh","lay","mobile","nasty","ordinary","respond","royal","senior","split","strain","struggle","swim","train","upper","wash","yellow","convert","crash","dependent","fold","funny","grab","hide","miss","permit","quote","recover","resolve","roll","sink","slip","spare","suspect","sweet","swing","twist","upstairs","usual","abroad","brave","calm","concentrate","estimate","grand","male","mine","prompt","quiet","refuse","regret","reveal","rush","shake","shift","shine","steal","suck","surround","bear","brilliant","dare","dear","delay","drunk","female","hurry","inevitable","invite","kiss","neat","pop","punch","quit","reply","representative","resist","rip","rub","silly","smile","spell","stretch","stupid","tear","temporary","tomorrow","wake","wrap","yesterday","Thomas","Tom","Lieuwe"];

    var name = capFirst(name1[getRandomInt(0, name1.length + 1)]) + '' + capFirst(name2[getRandomInt(0, name2.length + 1)]);
    return name
}

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
}

function genRandomPW(){
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"§$%&/()=?'
    var pwlength = 12
    var pw = ""
    for(var i = 0; i <= pwlength; i++){
        var randomNumber = Math.floor(Math.random() * chars.length)
        pw += chars.substring(randomNumber, randomNumber+1)
    }
    return pw
}

function registerRandNewUser(username = '', pw = '', id = 0)
{
    
    if(username == '' || pw == ''){
        alert("Username or Password empty\n");
    }
    const data = loadJSON(userDataJSON)
    for(let key in data){
        if(data[key].username == username){
            alert("Username already exists " + username + "\n")
        }
    }
    
    //console.log(data)
    data[id] = {username: username, password: pw};
    saveJSON(userDataJSON, data);
}

function fillUserData(){
    const questions = loadJSON(qDataJSON)
    const userdata = loadJSON(userDataJSON)
    const answers = loadJSON(aDataJSON)
    var id
    //check all Questions and lookup for user in UserData. If not there generate a new one
    for(var qkey in questions){
        for(var user in userdata){
            id = parseInt(questions[qkey].OwnerUserID)
            console.log(id)
            if(questions[qkey].OwnerUserID == user || questions[qkey].OwnerUserID == 'null'){
                break
            }
        }
        //not found-> gen new
        try {      
            console.log(id)        
            registerRandNewUser(genRandUserName(),genRandomPW(), id)
        } catch (error) {
            console.log(error)
        }
    }
/*
    //same for the Answers
    for(akey in answers){
        for(user in userdata){
            if(answers[akey].OwnerUserID == user){
                break
            }
        }
        //not found-> gen new
        try {
            registerRandNewUser(genRandUserName(),genRandomPW(),answers[akey].OwnerUserID)
        } catch (error) {
        console.log(error)
        }
    }*/
    
}
//console.log(openQuestion(25300 ,5))

module.exports = {getQuestionsFromSimilar, getQuestionByID, getMyQuestions, getNewestQuestions, openQuestion, writeNewAnswer, writeNewQuestion, registerNewUser, logIn, upvoteA, upvoteQ, downvoteA, downvoteQ}

