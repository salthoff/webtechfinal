"use strict";
// In this file, we write a background script to convert documents to embeddings
// We use the word2vec library for the computation of the word vectors
const fs = require('fs');
const w2v = require('word2vec');
const readline = require('readline');
const { callbackify } = require('util');
const model = require('word2vec/lib/model');

function preprocess(originalString) {
    // Write a standard preprocessing pipeline for strings
    const regex_remove_tags = /(<([^>]+)>)/gmi;
    var return_string = originalString.replace(regex_remove_tags, ' ');
    var return_string = return_string.replace(/(\r\n|\n|\r)/gm, " ");
    const regex_rem_special = /[^a-zA-Z0-9 ]/gm;
    var return_string = return_string.replace(regex_rem_special, ' ')
    var return_string = return_string.replace(/[ ]{2,}/gm, ' ')
    var return_string = return_string.toLowerCase();
    return return_string;
}

function createCorpus(inputFile, outputFile) {
    let rawdata = fs.readFileSync(inputFile);
    var data = JSON.parse(rawdata);
    var stream = fs.createWriteStream(outputFile, {flags:'a'})
    for (var key in data){
        var obj = data[key]
        var resstring = '';
        if("Title" in obj){
            resstring = resstring.concat(preprocess(obj.Title));
        };
        resstring = resstring.concat(" ", preprocess(obj.Body), '\n');
        stream.write(resstring);
    };
    // Create a corpus from the input file
    // Preprocess the strings
    // Write to the output file
}

function averageVectors(word_vectors, model){
    var string_vector = [];
    for (let i = 0; i < model.size; i++ ){
        string_vector.push(0);
    };
    for(let i = 0; i < word_vectors.length; i++){
        var vec = word_vectors[i].values;
        for(let k = 0; k < model.size; k++){
            string_vector[k] += vec[k];
        }; 
    };
    for(let i = 0; i < model.size; i++){
        string_vector[i] = string_vector[i]/parseFloat(word_vectors.length);
    };
    return string_vector;
}

function embeddings(model, cleanedString) {
    var words = cleanedString.split(/\W+/gm);
    var word_vectors = model.getVectors(words);
    var string_vector = [];
    for (let i = 0; i < model.size; i++ ){
        string_vector.push(0);
    };
    for(let i = 0; i < word_vectors.length; i++){
        var vec = word_vectors[i].values;
        for(let k = 0; k < model.size; k++){
            string_vector[k] += vec[k];
        }; 
    };
    for(let i = 0; i < model.size; i++){
        string_vector[i] = string_vector[i]/parseFloat(word_vectors.length);
    };
    return string_vector;
    // Convert a cleaned string to an embedding representation using a pretrained model
    // E.g., by averaging the word embeddings
}

function writeEmbeddings(inputFile, model, outputFile){
    let rawdata = fs.readFileSync(inputFile);
        var data = JSON.parse(rawdata);
        var stream = fs.createWriteStream(outputFile, {flags:'a'})
        let i = 0;
        var size = Object.keys(data).length;
        for (var key in data){
            var obj = data[key]
            var resstring = '';
            if("Title" in obj){
                resstring = resstring.concat(preprocess(obj.Title));
            };
            resstring = resstring.concat(" ", preprocess(obj.Body));
            var vec = embeddings(model, resstring)
            if("ParentId" in obj){
                stream.write(obj.ParentId + " " + vec + '\n');
            }
            else{
                stream.write(key + " " + vec + '\n');
            }
            i++
            console.log(i + '/' + size)
        };
}

function cossim(A,B){
    var prod = 0;
    var norm_a = 0;
    var norm_b = 0;

    for(var i = 0; i<A.length; i++){
        prod = prod + A[i]*B[i];
        norm_a = norm_a + (A[i]*A[i]);
        norm_b = norm_b + (B[i]*B[i]);
    }
    norm_a = Math.sqrt(norm_a);
    norm_b = Math.sqrt(norm_b);
    return (prod/(norm_a * norm_b));
}

//Gotten from stackoverflow
function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x > y) ? -1 : ((x < y) ? 1 : 0));
 });
}

function mostSimilarQuestions(embeddingFile, searchVector){
    let rawdata = fs.readFileSync(__dirname + embeddingFile);
    var lines = rawdata.toString().split(/\r?\n/g);
    var questions = [];
    for (var line in lines){
        //console.log(lines[line]);
        if(lines[line].length > 0){
            //console.log(line + '/' + lines.length)
            var lineVec = [];
            var element = {};
            var key = Number(lines[line].substr(0,lines[line].indexOf(' ')));
            var stringvec = lines[line].substr(lines[line].indexOf(' ')+1).split(',');
            //console.log(key)
            //console.log(stringvec)
            for(var num in stringvec){
                lineVec.push(Number(stringvec[num]));
            }
            var similarity = cossim(lineVec, searchVector);
            element.id = key;
            element.cos=similarity;
            questions.push(element);
        }
    }
    questions = sort_by_key(questions, 'cos');
    //console.log('done sorting')
    return questions



}
function writeupdatedEmbeddings(inputJson, model, outputFile){
        var stream = fs.createWriteStream(outputFile, {flags:'a'})
        var resstring = ''; 
        resstring = resstring.concat(preprocess(inputJson.title));
        resstring = resstring.concat(" ", preprocess(inputJson.body));
        var vec = embeddings(model, resstring)
        stream.write(inputJson.id + " " + vec + '\n');
}

function createEmbeddings (inputFile, modelFile, outputFile){
        
    w2v.loadModel(modelFile, function(error, model){
        writeEmbeddings(inputFile, model, outputFile);
    });
    // Create the document embeddings using the pretrained model
    // Save them for lookup of the running server
}
function updateEmbeddings(inputJson, modelFile, outputFile){
    w2v.loadModel(__dirname + modelFile, function(error, model){
        writeupdatedEmbeddings(inputJson, model, __dirname + outputFile);
    });
}

module.exports = {averageVectors, mostSimilarQuestions, updateEmbeddings};
// Suggested pipeline:
// - create a corpus
// - build w2v model (i.e., word vectors)
// - create document embeddings
//createCorpus("data/Questions.json", 'data/corpus.txt');
//createCorpus("data/Answers.json", 'data/corpus.txt');
//w2v.word2vec("data/corpus.txt", "data/word_vectors.txt");
//createEmbeddings(__dirname + "/../data/Questions.json", __dirname + "/../data/word_vectors.txt", __dirname + "/../data/entities.txt");
//createEmbeddings("data/Questions_head.json", "data/word_vectors.txt", "data/qentities.txt");