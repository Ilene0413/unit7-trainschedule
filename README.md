# unit7-trainschedule
Display the train schedule and updates the next arrival time and minutes to arrival every minute
input data in the form
All input data is validated - user must enter train name, destination, first time arrival, frequency
the first time arrival must be a valid military time
once all data is verified, it is pushed to firebase
upon retrieval from firebase, the data is stored in an array so that the data can be updated every minute
if the arrival time is more than 30 minutes away, it will not post on the board
if the minute to arrival is less than 3, will state the train is boarding
Pictures were taken from images doing google search and come from many different websites.
Developed by Ilene Cohen.
email: ilene413@icloud.com