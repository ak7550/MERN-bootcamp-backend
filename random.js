// import { format } from "morgan";

const smallletters = "qwertyuiopasdfghjklzxcvbnm", specialSymbols = "~!@#$%^&*()_+`={}[]<>,.?/|";
const numbers = "1234567890", capitalLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";

const getString = (length, characters) => {
    let result="";
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
     }
     return result;
}

const createJson=()=>{
    const firstName=getString(8,(smallletters));
    const lastName=getString(8,(smallletters+capitalLetters+numbers));
    const email=firstName+"."+lastName+"@gmail.com";
    const name=firstName+" "+lastName;
    const password=firstName+lastName+"#";
    console.log(`{
        \"name\": \"${name}\",
        \"email\": \"${email}\",
        \"password\":\"${password}\"
    }`);
    // console.log(`{ `);
};
console.log(createJson());
