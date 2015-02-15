// Global constants
var CLIENT_TEMPLATE = {
    "EMAIL": "",
    "MESSAGE": "",
    "ESTIMOTE": null
};
var HANDSHAKE_DISTANCE = 0.3; // Handshake trigger in meters
var TRIGGER_COUNT_REQ = 2;
var TRIGGER_RSSI_REQ = -80;
// Global variables
var arrClients        = [];
var arrClientsIds     = [];

var called = false;
var stop = false;
var count = 0;

function createNewClient(major, minor, email, message, estimote, pushToArr) {
    if (stop) return;
    var est         = {};
    $.extend(est, CLIENT_TEMPLATE);
    est.EMAIL       = email;
    est.MESSAGE     = message;
    est.ESTIMOTE    = estimote;
    if (pushToArr) {
        arrClients.push(est);
        arrClientsIds.push(major.toString() + minor.toString());
    }
    return est;
}

function updateClient(major, minor, estimote) {
    if (stop) return;
    var index = arrClientsIds.indexOf(major.toString() + minor.toString());
    if (index === -1) {
        $("#debug").append($("[updateClient] Can not find client <br />"));
    }
    arrClients[index].ESTIMOTE = estimote;
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
    var isHandshake = (est1 !== null) && (est2 !== null) && (parseInt(est1.rssi) > TRIGGER_RSSI_REQ) && (parseInt(est2.rssi) > TRIGGER_RSSI_REQ) && (Math.abs(est1.distance - est2.distance) < HANDSHAKE_DISTANCE);
    return isHandshake;
}

function processShake(client1, client2) {
    if (stop) return;
    count++;
    if (count != TRIGGER_COUNT_REQ) return;
    var element = $("<div>Handshake detected</div>");
    $("#handshakes").append(element);
    stop = true;
    window.open("mailto:" + arrClients[1].EMAIL + "?subject=DeltaHacks Connection&body=" + arrClients[1].MESSAGE);
}

function findHandshakes() {
    //called = true;
    if (stop) return;
    if (called) return;
    var copyArr = arrClients;
    for (var i = 0; i < copyArr.length; i++) {
        for (var j = i + 1; j < copyArr.length; j++) {
            if (isHandshake(copyArr[i].ESTIMOTE, copyArr[j].ESTIMOTE)) {
                processShake([arrClients[i], arrClients[j]]);
            }
        }
    }
}


function findClients() {
    if (stop) return;
    // Find devices and register them as clients
}
