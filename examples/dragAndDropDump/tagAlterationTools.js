// from http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function makeRandomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


function makeDeIdentifiedValue(length, vr) {
    if(vr === 'LO' || vr === "SH" || vr === "PN") {
        return makeRandomString(length);
    }
    else if(vr === 'DA') {
        var now = new Date();
        return now.getYear() + 1900 + pad(now.getMonth() + 1, 2) + pad(now.getDate(), 2);
    } else if(vr === 'TM') {
        var now = new Date();
        return pad(now.getHours(), 2) + pad(now.getMinutes(), 2) + pad(now.getSeconds(), 2);
    }
    console.log('unknown VR:' + vr);
}