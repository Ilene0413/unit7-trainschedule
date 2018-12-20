$(document).ready(function () {

    /* global moment firebase */

    // Initialize Firebase
    // Make sure to match the configuration to the script version number in the HTML
    // (Ex. 3.0 != 3.7.0)

    var config = {
        apiKey: "AIzaSyD4s8Tl0sFoZI7S8b5vT_t_kFTVid94TOU",
        authDomain: "train-unit7.firebaseapp.com",
        databaseURL: "https://train-unit7.firebaseio.com",
        projectId: "train-unit7",
        storageBucket: "train-unit7.appspot.com",
        messagingSenderId: "799790801335"
    };
    firebase.initializeApp(config);
    // Create a variable to reference the database.
    let database = firebase.database();

    // create variables for form
    let trainName;
    let destination;
    let firstTrain = 0;
    let freqInMin = 0;
    let nextArrival;
    let minAway = 0;
    let arrTrack = 0;
    let isItMilitary;
    let timeTrain;
    let currentTime;
    let validform = true;
    let errormsg;
    let minToTrain;
    let trainObj = {
        trainName: "",
        destination: "",
        firstTrain: 0,
        frequency: 0,
        minutesAway: 0,
        nextArr: "",
        track: 0
    };

    
    $("#submit-train").on("click", function (event) {
        event.preventDefault();


        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        freqInMin = $("#frequency").val().trim();
        firstTrain = $("#first-train").val().trim();
        arrTrack = $("#trackNo").val().trim();

        //validate input - if an input field is invalid, will return form with error messages for all invalid fields
        //if a field is invalid - valid form is set to false

        // check that train name was entered

        if (trainName == "") {
            errorMsg = "Please Enter Train Name";
            document.getElementById("trainNameError").innerHTML = errorMsg;
            validform = false;
           
        }
        else {
            clearErrMsg("trainNameError");
        }
        // check that destination was entered

        if (destination == "") {
            errorMsg = "Please Enter Destination";
            document.getElementById("destinationError").innerHTML = errorMsg;
            validform = false;
           
        }
        else {
            clearErrMsg("destinationError");
        }

        //check to see that first-train is a valid military time between 00:00 - 23:59
        //note max text size of first-train is 5, therefore position 3 should be a "":"

        timeTrain = moment(firstTrain, "HH:mm");
        let militChar = firstTrain.charAt(2);
        errorMsg = "Invalid - time must be entered in military time";
        if (militChar !== ":") {
            document.getElementById("firstTrainError").innerHTML = errorMsg;
            validform = false;
        }
        else {
            isItMilitary = firstTrain.substr(0, 2);
            if (isItMilitary < 0 || isItMilitary > 23) {
                document.getElementById("firstTrainError").innerHTML = errorMsg;
                validform = false;
            }
            else {
                isItMilitary = parseInt(firstTrain.substr(3, 2));
                if (isItMilitary < 0 || isItMilitary > 59) {
                    document.getElementById("firstTrainError").innerHTML = errorMsg;
                    validform = false;
                }
                else {
                    clearErrMsg("firstTrainError");

                }
            }
        }

        //check that frequency was entered
        //check to make sure frequency is not entered as an "e" (undefined) as numeric data can be enter an "e" or zero
        if (isNaN(freqInMin) || freqInMin === "" || freqInMin === "0") {
            errorMsg = "Please Enter Frequency -  must be at least 1";
            document.getElementById("frequencyError").innerHTML = errorMsg;
            validform = false;
        }
        else {
            clearErrMsg("frequencyError");
        }

        //not required to enter a track number, but if it is must be a number greater than 0
        if (arrTrack === "0") {
            errorMsg = "Invalid track number - must be at least 1";
            document.getElementById("trackError").innerHTML = errorMsg;
            validform = false;
        }
        else {
            clearErrMsg("trackError");
        }
// if all entries are valid, determine next arrival time and number of minutes away
// push to firebase

        if (validform) {
            timeTrain = moment(firstTrain, "HH:mm");
            currentTime = moment();
            let diffTime = moment().diff(moment(timeTrain, "minutes"));
            let tRemainder = diffTime % freqInMin;

            // determine if first train time is after current time
            // to determine how many minutes away and next arrival time

            if (timeTrain > currentTime) {
                minToTrain = moment(timeTrain).diff(moment(), "minutes");
                timeOfNextTrain = moment(timeTrain).format("hh:mm A");
            }
            else {
                minToTrain = freqInMin - tRemainder;
                timeOfNextTrain = moment().add(minToTrain, "minutes").format("h:mm A");
            }

            //set values of train to be pushed to firebase

            trainObj.trainName = trainName;
            trainObj.destination = destination;
            trainObj.frequency = freqInMin;
            trainObj.firstTrain = firstTrain;
            trainObj.minutesAway = minToTrain;
            trainObj.nextArr = timeOfNextTrain;
            trainObj.track = arrTrack;


            // Code for the push
            database.ref("trains").push(trainObj);

            //empty form values
            $("#train-name").val("");
            $("#destination").val("");
            $("#frequency").val("");
            $("#first-train").val("");
            $("#trackNo").val("");
        }
        else {
            validform = true;
        }

    });
// retrive data from firebae
//put time on header bar
document.getElementById("header-time").innerHTML=moment().format("MM/DD/YYYY hh:mm A");

    database.ref("trains").on("child_added", function (snapshot) {
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        freqInMin = snapshot.val().frequency;
        nextArrival = snapshot.val().nextArr;
        minAway = snapshot.val().minutesAway;
        arrTrack = snapshot.val().track;


        // Create new row in train schedule
        //only create row if train is scheduled to arrive within 30 minutes
        if (minAway <= 30) {
            let trainRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(destination),
                $("<td>").text(freqInMin),
                $("<td>").text(nextArrival),
                $("<td>").text(minAway),
                $("<td>").text(arrTrack)
            );


            // Append the new row to the table
            $("#train-table > tbody").append(trainRow);
        }
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });


    //this function is used to clear any error messages
    function clearErrMsg(idName) {
        errorMsg = "";
        document.getElementById(idName).innerHTML = errorMsg;

    }
});