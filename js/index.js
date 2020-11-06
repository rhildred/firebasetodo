import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.12/js/framework7.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js"
// Your web app's Firebase configuration
import firebaseConfig from "./firebase.js";

//initialize framework 7
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
myApp.view.create('.view-main', {

    // enable the dynamic navbar for this view:
    dynamicNavbar: true
});

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
        let sRow = "";
        if(oTodo.dateCompleted){
            sRow += `<div class="row completed">`;
        }else{
            sRow += `<div class="row">`;
        }
        sRow += `<div class="col-80 name">${oTodo.name}</div>
                    <div class="col-20 right_justify">
                        <button id="d${key}" class="delete">x</button>
                        <button id="u${key}" class="update">&check;</button>
                    </div>
                </div>`;
        $$("#todo_list").prepend(sRow);
    });
});

$$("#todo_list").on("click", (evt)=>{
    evt.preventDefault();
    const sId = evt.target.id;
    if(sId[0] == 'u'){
        //update
        const sDateCompleted = new Date().toISOString();
        firebase.database().ref(`todos/${sId.substr(1)}/dateCompleted`).set(sDateCompleted);
    }else{
        //delete
        firebase.database().ref(`todos/${sId.substr(1)}`).remove();
    }
});
