const { urlencoded } = require("express");
const express = require("express");

function decodeUrl(urlencoded) {
    const htoi = (h) => {
        return h < 0x3A ? h - 0x30 : h - 0x57; 
    }
    
    var length = 0;
    for (var i = 0; i < urlencoded.length;) {
        if (urlencoded[i] == '%') {
            i += 3;
        } else {
            i++;
        }
        length++;
    }

    var pos = 0;
    const bytes = new Uint8Array(length);
    for (var i = 0; i < urlencoded.length;) {
        if (urlencoded[i] == '%') {
            const h = htoi(urlencoded.charCodeAt(i + 1));
            const l = htoi(urlencoded.charCodeAt(i + 2));
            bytes[pos++] = h << 4 | l;
            i += 3;
        } else {
            bytes[pos++] = urlencoded.charCodeAt(i++);
        }
    }
    return bytes;
}

function bin2hex(data) {
    const itoh = (i) => {
        return i > 9 ? 0x57 + i : 0x30 + i;
    }

    var hex = "";
    data.forEach((h) => {
        hex += String.fromCharCode(itoh(h >> 4));
        hex += String.fromCharCode(itoh(h & 15));
    });
    return hex;
}

const app = express();
app.get("/nodejstest", function(req, res) {
    const raw = decodeUrl(req.query.arg2);

    console.log(raw);
    console.log(bin2hex(raw));
    res.send("OK");
});

app.listen(3001);