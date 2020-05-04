const mongoose = require('mongoose');
const crypto=require('crypto');
const uuidv1=require('uuid/v1');
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        reuired: true,
        maxlength: 32,
        trim: true // keep the filteration as much premium as possible, saves data
    },
    lastName: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true, // must provide it over here
        unique: true // it has to be unique for each and every one at the time of entry otherwise db will reject it
    },
    userInfo: {
        type: String,
        trim: true
    },
    //TODO come back here
    encryptedPassword: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},{
    timestamps:true
});

// from the form field user provided password will first at this virtual method as the argument password, setting the password as private data member
// taking a random salt value from uuidv1
// calling the securepassword method with the password argument and pass the encrypted value in encryptedpassword section to store it in as encrypted data into the data base
userSchema.virtual("password")
            .get(function () { 
                return this._password;
             })
            .set(function (password) { 
                this._password=password; // keep it for now, i want to see the plain password for working purpose
                this.salt=uuidv1();
                this.encryptedPassword=this.securePassword(password);
             });

userSchema.virtual("name")
             .get(function () { 
                 return this.firstName +" "+ this.lastName;
              })
             .set(function (name) { 
                var sp=name.split(' ');
                this.firstName=sp[0];
                this.lastName=sp[1];
              });

userSchema.methods = {
    //method to create a secure password
    securePassword: function (plainPassword) { // do not use arrow function
        // check if it's empty or not
        if (!plainPassword) return "" 
        try {
            return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex');
        } catch (err) {
            return "ERROR OCCURED!! mongo does not store any empty password" // mongo does not store empty password
        }
    },
// at the time of login form field pass the password to authenticate method and it will converti into the securepassword by passing it to securepassword method and then it will get checked with the stored encryptedpassword data into our database.
    authenticate: function (plainpassword) {  
        return this.securePassword(plainpassword) === this.encryptedPassword ? true : false;
    }
}

// to export the userSchema
module.exports = mongoose.model("User", userSchema);

// for understanding purpose, User is the class name and userSchema is the prototype that it's copying information from

// we will make instances of User class as each user for our website.