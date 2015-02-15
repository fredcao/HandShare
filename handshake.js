// Global constants
var CLIENT_TEMPLATE = {
    "EMAIL": "",
    "MESSAGE": "",
    "ESTIMOTE": null
};
var HANDSHAKE_DISTANCE = 0.3; // Handshake trigger in meters
var TRIGGER_COUNT_REQ = 5;
// Global variables
var arrClients        = [];
var arrClientsIds     = [];

var called = false;
var stop = false;
var count = 0;

function createNewClient(major, minor, email, message, estimote, pushToArr) {
    if (stop) return;
    // $("#debug").append($("<div>[createNewClient] Called </div>"));
    // $("#debug").append($("<div>[createNewClient] Major: " + major + " </div>"));
    // $("#debug").append($("<div>[createNewClient] Minor: " + minor + " </div>"));
    var est         = {};
    $.extend(est, CLIENT_TEMPLATE);
    est.EMAIL       = email;
    est.MESSAGE     = message;
    est.ESTIMOTE    = estimote;
    if (pushToArr) {
        arrClients.push(est);
        arrClientsIds.push(major.toString() + minor.toString());
    }
    //count++;
    // $("#debug").append($("<div>[createNewClient] count: " + count + "</div>"));
    // $("#debug").append($("<div>[createNewClient] major1: " + arrClients[0].ESTIMOTE.major + "</div>"));
    // $("#debug").append($("<div>[createNewClient] minor1: " + arrClients[0].ESTIMOTE.minor + "</div>"));
    // $("#debug").append($("<div>[createNewClient] major2: " + arrClients[1].ESTIMOTE.major + "</div>"));
    // $("#debug").append($("<div>[createNewClient] minor1: " + arrClients[1].ESTIMOTE.minor + "</div>"));

    // if (count === 2) {
    //     stop = true;
    // }
    return est;
}

function updateClient(major, minor, estimote) {
    if (stop) return;
    // $("#debug").append($("<div>[updateClient] Major: " + major + " </div>"));
    // $("#debug").append($("<div>[updateClient] Minor: " + minor + " </div>"));
    // $("#debug").append($("<div>[updateClient] ESTMajor: " + estimote.major + " </div>"));
    // $("#debug").append($("<div>[updateClient] ESTMinor: " + estimote.minor + " </div>"));
    // $("#debug").append($("<div>[updateClient] Called </div>"));
    var index = arrClientsIds.indexOf(major.toString() + minor.toString());
    //$("#debug").append($("<div>[updateClient] Index " + index + " </div>"));
    if (index === -1) {
        $("#debug").append($("[updateClient] Can not find client <br />"));
    }
    arrClients[index].ESTIMOTE = estimote;
    // count++;
    // if (count === 2) {
    //     stop = true;
    // }
}

function existsClient(major, minor) {
    if (stop) return;
    //$("#debug").append($("<div>[existsClient] " + (arrClientsIds.indexOf(major.toString() + minor.toString()) >= 0).toString() + " </div>"));
    return (arrClientsIds.indexOf(major.toString() + minor.toString()) >= 0);
}

function clearEstArr() {
    if (stop) return;
    $("#debug").append($("<div>[clearEstArr] Called </div>"));
    arrClients.length = 0;
}

function pushClient(client) {
    if (stop) return;
    if (arrClientsIds.indexOf(client.UUID) < 0) {
        arrClients.push(client);
        arrClientsIds.push(client.UUID);
    }
}

function popClient(client) {
    if (stop) return;
    var index = arrClientsIds.indexOf(client.estimote.UUID);
    arrClients.splice(index, 1);
    arrClientsIds.splice(index, 1);
}

function isHandshake(est1, est2) {
    if (stop) return;
    // $("#debug").empty();
    // $("#debug").append($("<div>[isHandshake] est1.distance " + est1.distance + " est2.distance " + est2.distance + " </div>"));
    // $("#debug").append($("<div>[isHandshake] Math.abs(diff) " + Math.abs(est1.distance - est2.distance) + " </div>"));
    return (est1 !== null) && (est2 !== null) && (Math.abs(est1.distance - est2.distance) < HANDSHAKE_DISTANCE);
    stop = true;
}

function processShake(client1, client2) {
    if (stop) return;
    count++;
    // $("#debug").append($("<div>Trigger " + count + " at " + Date.now().toString() + "</div>"));
    if (count != TRIGGER_COUNT_REQ) return;
    // TODO: process a shake between client1 and client2
    // This would be a notification/email
    //alert("Handshake detected");
    var element = $("<div>Handshake detected</div>");
    $("#handshakes").append(element);
    stop = true;
}

function findHandshakes() {
    //called = true;
    if (stop) return;
    if (called) return;
    //$("#debug").empty();
    // $("#debug").append($("<div>[findHandshakes] Called </div>"));
    // $("#debug").append($("<div>[findHandshakes] major1: " + arrClients[0].ESTIMOTE.major + "</div>"));
    // $("#debug").append($("<div>[findHandshakes] minor1: " + arrClients[0].ESTIMOTE.minor + "</div>"));
    // $("#debug").append($("<div>[findHandshakes] major2: " + arrClients[1].ESTIMOTE.major + "</div>"));
    // $("#debug").append($("<div>[findHandshakes] minor1: " + arrClients[1].ESTIMOTE.minor + "</div>"));
    var copyArr = arrClients;
    for (var i = 0; i < copyArr.length; i++) {
        for (var j = i + 1; j < copyArr.length; j++) {
            if (isHandshake(copyArr[i].ESTIMOTE, copyArr[j].ESTIMOTE)) {
                processShake([arrClients[i], arrClients[j]]);
            }
        }
    }
    // called = true;
}


function findClients() {
    if (stop) return;
    // Find devices and register them as clients
    // Hardcoded clients for POC purposes
}
