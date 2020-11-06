import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.12/js/framework7.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js"

//initialize framework 7
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
myApp.view.create('.view-main', {

    // enable the dynamic navbar for this view:
    dynamicNavbar: true
});

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


$$("#todo_form").submit((evt)=>{
    evt.preventDefault();
    const todoID = new Date().toISOString().replace(".", "_");
    firebase.database().ref('todos/' + todoID).set({
        name: $$("#todo_item").val()
    }).then(() => {
        $$("#todo_item").val("");
    }).catch(e => {
        console.log(e.toString());
    });

});

firebase.database().ref('todos/').on("value", snapshot => {
    $$("#todo_list").html("");
    let oTodos = snapshot.val();
    console.log(oTodos);
    Object.keys(oTodos).map((key) => {
        const oTodo = oTodos[key];
        console.log(oTodo);
        $$("#todo_list").prepend(`<div>${oTodo.name}</div>`);
    });
});