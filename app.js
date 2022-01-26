var express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
var path = require("path");
const w2v = require("word2vec");
const port = 3000;
const background = require("./public/js/background.js")
const datahandler = require("./public/js/data_handling.js")

//var routes = require("./routes");

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "public/html"));
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded());

//Inserted
app.use(cookieParser());
app.use(session({
    cookie:{maxAge:60000},
    resave: false,
    saveUninitialized: false,
    secret: "secret"
}));
app.use(express.urlencoded({extended:true}));

const isAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};
//


app.get("/", function(req, res) {

    res.render("index.html");
});

app.get("/question", function(req,res){
    //var Qid = Number(req.query.id);
    //var resp = datahandler.openQuestion(Qid);
    res.render('viewQuestion.html');
    
})
app.get("/q", function(req,res){
    var Qid = Number(req.query.id);
    var resp = datahandler.openQuestion(Qid);
    res.json(resp);
    
})

app.get("/search", function(req,res){
    var searchWords = req.query.search.split(' ');
    w2v.loadModel('public/data/word_vectors.txt', (error, model) =>{
        var word_vectors = model.getVectors(searchWords)
        var avg_vector = background.averageVectors(word_vectors, model);
        var questions = background.mostSimilarQuestions('/../data/entities.txt', avg_vector);
        var resultjson = datahandler.getQuestionsFromSimilar(questions);
        res.json(resultjson)
    })
});

app.get("/search/new", function(req,res){
    
    var resultjson = datahandler.getNewestQuestions();
    //console.log(resultjson);
    res.json(resultjson);
    
});


app.get("/about", function(req, res) {

    res.render("about.html");
});

app.post("/question/postanswer",isAuth, function(req,res){
    var body = req.body.answer;
    var Qid = Number(req.body.url)
    var Uid = req.session.uid
    var body = '<p>' + body + ' <\/p>\n'
    datahandler.writeNewAnswer(Qid, Uid, body)
    res.status(201).redirect("/question?id=" + Qid)
});

app.get("/question/new", isAuth, function(req,res){

    res.render("newQuestion.html")
})

app.post("/question/newquestion",isAuth, function(req,res){
    var title = req.body.qTitle;
    var body = req.body.qBody;
    var Uid = req.session.uid;
    var question = {};
    question.title = title;
    question.body = body;
    var qid = datahandler.writeNewQuestion(Uid, title, body)
    question.id = qid
    background.updateEmbeddings(question, "/../data/word_vectors.txt","/../data/entities.txt" )
    res.status(201).redirect("/question?id=" + qid)
});

    

//Inserted
app.get("/LogIn", function(req, res){
    res.render("LogIn.html");
});

app.post("/logIn",async(req, res) =>{
    //LogIn
    const{username, password} = req.body;
    const user = datahandler.logIn(username, password);
    if(!user){
        res.redirect('/Register')
        
    }else{        
        req.session.uid = user[0];
        req.session.user = user[1];
        req.session.isAuth = true;
        req.session.save();
        
        return res.redirect("/");
    }
});

app.get("/user",isAuth, (req, res)=>{
    res.render("Profil.html");
});

app.get('/logout',function(req,res){
    console.log(req.session.user);
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });    
});

app.get("/Register", function(req,res){
    res.render("Register.html")
});

app.post("/register", async(req,res)=>{
    const{newUsername, password} = req.body;
    const newuser = datahandler.registerNewUser(newUsername, password);
    if(!newuser){
        res.redirect("/Register");
    }
    else{
        res.redirect("/");
    }
});


app.all('*',(req,res)=>{
    res.status(404).render('404.html');
});

app.listen(app.get("port"), function() {
    console.log(`Example app listening at http://localhost:${port}`);
});