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
    let freqInMIn = 0;
    let nextArrival;
    let minAway = 0;
    let arrTrack = 0;
    let isItMilitary;
    let timeOfTrain;
    let currentTime;
    let errormsg;
    let validform=true;

    let trainObj = {
        trainName: "",
        destination: "",
        firstTrain: 0,
        frequency: 0,
        minutesAway: 0,
        nextArr: "",
        track: 0
    };

    // check that all required fields are entered before submit

    $("#submit-train").on("click", function (event) {

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        freqInMin = $("#frequency").val().trim();
        firstTrain = $("#first-train").val().trim();
        arrTrack = $("#trackNo").val().trim();



        //check to see that first-train is a valid military number between 00:00 - 23:59
        //note max text size of first-train is 5, therefore position 3 should be a :
        let timeTrain = moment(firstTrain, "HH:mm");
        console.log("moment " + timeTrain);
        let militChar = firstTrain.charAt(2);
        errorMsg = "Invalid - must be in military time";
        if (militChar !== ":") {
            document.getElementById("firstTrainError").innerHTML = errorMsg;
            validform=false;
            return;
        }
        else {
            isItMilitary = firstTrain.substr(0, 2);
            if (isItMilitary < 0 || isItMilitary > 23) {
                document.getElementById("firstTrainError").innerHTML = errorMsg;
                validform=false;
                return;
            }
            else {
                isItMilitary = parseInt(firstTrain.substr(3, 2));
                if (isItMilitary < 0 || isItMilitary > 59) {
                    document.getElementById("firstTrainError").innerHTML = errorMsg;
                    validform=false;
                    return;

                }
            }
        }
        timeOfTrain = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log("time of first train " + moment(timeOfTrain).format("hh:mm"));
        currentTime = moment(currentTime);
        console.log("current " + moment(currentTime).format("hh:mm"));
        let diffTime = moment().diff(moment(timeOfTrain, "minutes"));
        console.log(moment(diffTime).format("hh:mm"));
        let tRemainder = diffTime % freqInMin;
        console.log("remainder " + tRemainder);
        let minToTrain = freqInMin - tRemainder;
        console.log("min to train " + minToTrain);
        //if (moment(currentTime) < timeOfTrain)
        //  timeOfNextTrain = moment(timeOfTrain).add(minToTrain, "minutes");
        trainObj.trainName = trainName;
        trainObj.destination = destination;
        trainObj.frequency = freqInMin;
        trainObj.firstTrain = firstTrain;
        trainObj.track = arrTrack;


        // Code for the push
        database.ref("trains").push(trainObj);

        //empty form values
        $("#train-name").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#first-train").val("");
        $("#trackNo").val("");
    });
        database.ref("trains").on("child_added", function (snapshot) {
            trainName = snapshot.val().trainName;
            destination = snapshot.val().destination;
            freqInMin = snapshot.val().frequency;
            nextArrival = snapshot.val().nextArr;
            minAway = snapshot.val().minutesAway;
            arrTrack = snapshot.val().track;


            // Create new row in train schedule
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

            // Handle the errors
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);

        });

});