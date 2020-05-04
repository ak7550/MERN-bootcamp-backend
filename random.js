import { format } from "morgan";

const smallletters = "qwertyuiopasdfghjklzxcvbnm", specialSymbols = "~!@#$%^&*()_+`={}[]<>,.?/|";
const numbers = "1234567890", capitalLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";

const getString = (length, characters) => {
    let result="";
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
     }
     return result;
}

console.log(getString(20,(smallletters+capitalLetters+numbers)));
console.log(getString(20,(smallletters+capitalLetters+numbers)).length);


// make something that gonna username,password,email by itself in a json format.
// everything will be connected with eachother.
