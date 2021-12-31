const DB_NAME = 'MQ_DB';
let completeFlag = false;
let indArr = new Array();

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
}

document.addEventListener("DOMContentLoaded", function(){
    initializeDB();
    clearAliases();
});

window.addEventListener("load", registerUserEvents);

function registerUserEvents(){

    $("#aliasForm").submit(function(event) {
        addAlias();
        syncAliasList(true);
        emptyAliasInput();
        $("#alias").focus();
        event.preventDefault();
    });


    $("#clearLink").click(function() {
        clearAliases();
        $("#showNavItem").hide();
        $("#hideNavItem").hide();
        $("#completeNavItem").show();
        $("#aliasFormDiv").show();
    });


    $("#completeLink").click(function() {
        completeFlag = true;
        shuffleAliasList();
        $("#showNavItem").show();
        $("#completeNavItem").hide();
        $("#aliasFormDiv").hide();
    });

    //initially hide item
    $("#showNavItem").hide();

    $( "#showLink" ).click(function() {
        syncAliasList(false);
        $("#showNavItem").hide();
        $("#hideNavItem").show();
    });


    //initially hide item
    $("#hideNavItem").hide();

    $( "#hideLink" ).click(function() {
        syncAliasList(true);
        $("#showNavItem").show();
        $("#hideNavItem").hide();
    });

}

function initializeDB(){
    const request = self.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function(event) {
        //console.log('[onsuccess]');
    };

    request.onerror = function(event) {
        console.log('[onerror]', request.error);
    };

    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        let aliasesStore = db.createObjectStore('aliases', { keyPath: "id" , autoIncrement: true});
    };
}

function clearAliases(){
    indArr = new Array();
    const request = self.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function(event) {
        //console.log('[onsuccess]');
        // get database from event
        const db = event.target.result;

        // create transaction from database
        const transaction = db.transaction('aliases', 'readwrite');

        // get store from transaction
        let aliasesStore = transaction.objectStore('aliases');
        aliasesStore.clear().onsuccess = function (event){
            //console.log('empty Aliases success');
            emptyAliasList();
        };
    };

    request.onerror = function(event) {
        console.log('[onerror]', request.error);
    };



}

function addAlias(){
    // handle the form data
    const aliasValue = $("#alias").val();
    if(aliasValue === ''){
        console.log('alias empty');
        return;
    }else{
        //console.log('alias = ' + aliasValue);
    }

    const request = self.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function(event) {
        //console.log('[onsuccess]');
        // get database from event
        const db = event.target.result;

        // create transaction from database
        const transaction = db.transaction('aliases', 'readwrite');

        // add success event handler for transaction
        // you should also add onerror, onabort event handlers
        transaction.onsuccess = function(event) {
            console.log('[Transaction] alias stored');
        };

        // get store from transaction
        let aliasesStore = transaction.objectStore('aliases');

        const db_op_req = aliasesStore.add({'name': aliasValue});

        db_op_req.onsuccess = function(event) {
            console.log(event.target.result);
        }

        // count number of objects in store
        //aliasesStore.count().onsuccess = function(event) {
        //    console.log('[Transaction - COUNT] number of aliases in store', event.target.result);
        //};

    };

    request.onerror = function(event) {
        console.log('[onerror]', request.error);
    };
}

function syncAliasList(hidden) {

    emptyAliasList();

    const request = self.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function (event) {
        //console.log('[onsuccess]');
        // get database from event
        const db = event.target.result;

        // create transaction from database
        const transaction = db.transaction('aliases', 'readonly');

        // get store from transaction
        let aliasesStore = transaction.objectStore('aliases');
        if(hidden){
            aliasesStore.getAll().onsuccess = function(event) {
                //console.log(event.target.result.length);
                const ul = document.getElementById("aliasList");
                for (let alias of event.target.result) {
                    const li = document.createElement("li");
                    li.appendChild(document.createTextNode('**********'));
                    li.className = 'list-group-item';
                    ul.appendChild(li);
                }
            };
        }else{
            for(let ind of indArr){
                aliasesStore.get(ind).onsuccess = function (event){
                    const ul = document.getElementById("aliasList");
                    const li = document.createElement("li");
                    li.appendChild(document.createTextNode(event.target.result.name));
                    li.className = 'list-group-item';
                    ul.appendChild(li);
                }
            }
        }

    }

    request.onerror = function(event) {
        console.log('[onerror]', request.error);
    };
}


function emptyAliasInput(){
    $("#alias").val("");
}

function emptyAliasList(){
    $("#aliasList").html("");
}

function shuffleAliasList() {

    const request = self.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function (event) {
        // get database from event
        const db = event.target.result;

        // create transaction from database
        const transaction = db.transaction('aliases', 'readwrite');

        // get store from transaction
        let aliasesStore = transaction.objectStore('aliases');
        aliasesStore.getAll().onsuccess = function(event) {
            console.log(event.target.result.length);
            indArr = new Array();
            for (let alias of event.target.result) {
                indArr.push(alias.id);
            }
            shuffle(indArr);
        };
    }

    request.onerror = function(event) {
        console.log('[onerror]', request.error);
    };

}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}
