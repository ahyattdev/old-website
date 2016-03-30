var TITANIC_DATE = "15 April 1912";

var TO_CAPARTHIA = " " + TITANIC_DATE + "\n" + "RMS Titanic to RMS Carpathia";
var TO_TITANIC = "\n" + TITANIC_DATE + "\n" + "RMS Carpathia to RMS Titanic";
var TO_OLYMPIC = "\n" + TITANIC_DATE + "\n" + "RMS Titanic to Olympic";

var titanicMessages = [
    ["Come at once", "12:20 AM" + TO_CAPARTHIA],
    ["We have struck a berg", "12:20 AM" + TO_CAPARTHIA],
    ["Shall I tell my captain", "12:25 AM" + TO_TITANIC],
    ["Do you require assistance", "12:25 AM" + TO_TITANIC],
    ["Yes come quick", "12:26 AM" + TO_CAPARTHIA],
    ["Putting about", "12:32 AM" + TO_TITANIC],
    ["and heading for you", "12:32 AM" + TO_TITANIC],
    ["SOS Titanic", "12:40 AM" + TO_CAPARTHIA],
    ["sinking by the head", "12:40 AM" + TO_CAPARTHIA],
    ["We are putting passengers", "1:30 AM" + TO_OLYMPIC],
    ["off in small boats", "1:30 AM" + TO_OLYMPIC],
    ["SOS SOS CQD CQD Titanic", "2:15 AM" + TO_CAPARTHIA],
    ["We are sinking fast", "2:15 AM" + TO_CAPARTHIA],
    ["Passengers are being", "2:15 AM" + TO_CAPARTHIA],
    ["put into boats", "2:15 AM" + TO_CAPARTHIA]
];

var titanic = Object.create(gameSceneTemplate);

titanic.transcriptData = titanicMessages;
