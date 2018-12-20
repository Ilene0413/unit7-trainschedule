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
    //let timeOfTrain;
    //  let currentTime;
    //  let currentDate;
    let diffDate;
    let diffTime;
    let firstDateTrain;
    let timeTrain;
    let militChar
    let validform = true;
    let errormsg;

    let trainObj = {
        trainName: "",
        destination: "",
        firstDate: new Date(),
        firstTrain: 0,
        frequency: 0,
        minutesAway: 0,
        nextArr: "",
        track: 0
    };

    // check that all required fields are entered before submit

    $("#submit-train").on("click", function (event) {
        event.preventDefault();


        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        freqInMin = $("#frequency").val().trim();
        firstDateTrain = $("#first-train-date").val();
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
        };
        // check that destination was entered

        if (destination == "") {
            errorMsg = "Please Enter Destination";
            document.getElementById("destinationError").innerHTML = errorMsg;
            validform = false;
        }
        else {
            clearErrMsg("destinationError");
        };

        //check that first date entered is a valid date

        if (moment(firstDateTrain).isValid()) {
            //check that date entered is within 365 days of current date and not in the past
            //     diffDate = moment(firstDateTrain).diff(moment(), "days");
            console.log("checking dif date " + diffDate);
            if (moment(firstDateTrain).isBetween(moment(), moment().add(365, "days"))) {
                //    if (moment(diffDate).isBetween("0", "365")) {
                //    if (diffDate > 365 || diffDate < 0) {
                clearErrMsg("dateTrainError");
                let valDiffDate = true;
            }
            else {
                errorMsg = "Date must be within 365 days from today";
                document.getElementById("dateTrainError").innerHTML = errorMsg;
                validform = false;
            }
        }
        else {
            errorMsg = "Invalid Date";
            document.getElementById("dateTrainError").innerHTML = errorMsg;
            validform = false;
        };


        //check to see that first-train is a valid military time between 00:00 - 23:59
        //note max text size of first-train is 5, therefore position 3 should be a "":"

        timeTrain = moment(firstTrain, "HH:mm");
        militChar = firstTrain.charAt(2);
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
                    validateTime();
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
        };

        //not required to enter a track number, but if it is must be a number greater than 0
        if (arrTrack === "0") {
            errorMsg = "Invalid track number - must be at least 1";
            document.getElementById("trackError").innerHTML = errorMsg;
            validform = false;
        }
        else {
            clearErrMsg("trackError");
        };

        if (validform) {
            //calculate how many minutes away the train is
            //calculate then next arrival time
            //    timeOfTrain = moment(firstTrain, "HH:mm");

            //           timeOfTrain = moment(firstTrain, "HH:mm").subtract(1, "years");
            console.log("time of first train " + moment(timeTrain).format('MMMM Do YYYY, h:mm:ss a'));

            //    currentTime = moment(currentTime).subtract(1, "years");
            //  console.log("current " + moment(currentTime).format('MMMM Do YYYY, h:mm:ss a'));

            //    let diffTime = moment().diff(moment(timeOfTrain, "minutes"));
            diffTime = moment(timeTrain).diff(moment(), "seconds");

            console.log(moment(diffTime).format("mm"));
            // time apart is the remainder of the difference of first time & current time / freuqency
            let tRemainder = diffTime % freqInMin;
            console.log("remainder " + tRemainder);
            //add time apart to the frequency to get number of minutes away
            let minToTrain = freqInMin - tRemainder;
            console.log("min to train " + minToTrain);
            //determine arrival time of train
            //if the first train time has not happened then the next arrival time is the first time
            //check date and time
            ////     if (moment(firstDateTrain).format('L').isSame(moment().format('L'))
            //       &&
            //     (moment(firstTrain).format("hh:mm")).isAfter(moment().format('hh:mm'))) {
            //   timeOfNextTrain = moment(firstTrain).format("hh:mm A");
            //trainObj.minutesAway = moment(firstTrain).subtract(moment(), "minutes");
            //    }
            //  else {
            trainObj.minutesAway = minToTrain;
            timeOfNextTrain = moment(timeTrain).add(minToTrain, "minutes").format("hh:mm A");
            //}
            //    timeofNextTrain = moment(timeOfNextTrain).format("hh:mm");
            trainObj.trainName = trainName;
            trainObj.destination = destination;
            trainObj.firstDate = firstDateTrain;
            trainObj.firstTrain = firstTrain;
            trainObj.frequency = freqInMin;
            console.log("time of next train " + timeOfNextTrain);
            //    trainObj.nextArr = moment(timeOfNextTrain).format("hh:mm");
            trainObj.nextArr = timeOfNextTrain;
            trainObj.track = arrTrack;


            // Code for the push
            database.ref("trains").push(trainObj);

            //empty form values
            $("#train-name").val("");
            $("#destination").val("");
            $("#frequency").val("");
            $("#first-train-date").val("");
            $("#first-train-time").val("");
            $("#trackNo").val("");
        }
        else {
            validform = true;
        }

    });

    database.ref("trains").on("child_added", function (snapshot) {
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        freqInMin = snapshot.val().frequency;
        nextArrival = snapshot.val().nextArr;
        minAway = snapshot.val().minutesAway;
        arrTrack = snapshot.val().track;


        // Create new row in train schedule only if train is scheduled in within 24 hours
        let withinDay = moment().add(24, "hours");
        console.log("within DAy " + withinDay);
        console.log("next arrival " + nextArrival);
        console.log("moment " + moment().format("hh:mm"));
        //if (moment(nextArrival).isBetween(moment(), withinDay)) {
        let trainRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            //    $("<td>").text(freqInMin),
            $("<td>").text(nextArrival),
            $("<td>").text(minAway),
            $("<td>").text(arrTrack)
        );

        // Append the new row to the table
        $("#train-table > tbody").append(trainRow);
        //        }

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });


    //this function is used to clear any error messages
    function clearErrMsg(idName) {
        errorMsg = "";
        document.getElementById(idName).innerHTML = errorMsg;

    }
    //this function is used to ensure that the first train time is later than current time
    //if the first train date is not the same day, then the time is fine
    //if the fist train date is the same as the current date, the first time has to be later than the current time
    function validateTime() {
        console.log("diff date " + diffDate);
        //    if (diffDate === 0) {
        if (moment(firstDateTrain).format('L') === moment().format('L')) {
            console.log("moment time train " + moment(timeTrain).format("hh:mm"));
            console.log("moment current" + moment().format("hh:mm)"));
            if (moment(timeTrain).isBefore(moment())) {
                errorMsg = "Time must be later than current time";
                document.getElementById("firstTrainError").innerHTML = errorMsg;
                validform = false;
            }
            else {
                clearErrMsg("dateTrainError");
            }
        }

    }

});