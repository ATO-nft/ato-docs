var form;
var httpRequest;
var apiError = false;
var autoPro = false;

function bodyLoad() {
    form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    if (autoPro) {
        document.getElementById("proBlock").style="display: none";
        document.getElementById("userKey").value="0x0000000000000000000000000000000000000000"; /* Enter your own address here */
    }

    changeLevel();
    let yearsSelector = document.getElementById("yearsSelector");
    for (i = 1; i < 71; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i + (i === 1 ? " year" : " years");
        if (i === 70) opt.selected = true;
        yearsSelector.appendChild(opt);
    }
    let rightResaleSelector = document.getElementById("rightResaleSelector");
    for (i = 0; i < 10; i++) {
        var opt = document.createElement('option');
        opt.value = "" + i;
        if (i === 8) opt.selected = true;
        opt.innerHTML = i + ".0 %";
        rightResaleSelector.appendChild(opt);
        var opt = document.createElement('option');
        opt.value = "" + i + ".5";
        opt.innerHTML = i + ".5 %";
        rightResaleSelector.appendChild(opt);
    }
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i + " %";
    rightResaleSelector.appendChild(opt);
}

function loadKey(e) {
    var file = e.files[0];
    var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                var content = readerEvent.target.result;
                document.getElementById("signature").value = window.atob(content);
            }
            catch(e) {
                alert('bad key file');
                apiError = true;
            }
        }
}

function changeSupplyNumber() {
    let supplyNumberId = document.getElementById("SupplyNumberId");
    let RightExclusiveId = document.getElementById("RightExclusiveId");
    if (supplyNumberId.value === '1') {
        RightExclusiveId.style.display = "block";
    }
    else {
        RightExclusiveId.style.display = "none";
    }
}

function changeLevel() {
    let rightLevelId = document.getElementById("RightLevelId");
    if (rightLevelId.value === '3') {
        document.getElementById("RightAdaptId").style.display = "block";
        document.getElementById("RightLogoId").style.display = "block";
        document.getElementById("RightMerchId").style.display = "block";
    }
    else {
        document.getElementById("RightAdaptId").style.display = "none";
        document.getElementById("RightLogoId").style.display = "none";
        document.getElementById("RightMerchId").style.display = "none";
    }
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function strEncode(stringToEncode) {
    var publicKey;
    await crypto.subtle.importKey(
        "jwk",
        JSON.parse(document.getElementById("signature").value),
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        false, ["encrypt"]
    )
        .then(function (publickey) {
            publicKey = publickey;
        })
        .catch(function (err) {
            console.error(err);
            apiError = true;
        });

    var encryptedUri;
    await crypto.subtle.encrypt({
        name: 'RSA-OAEP'
    }, publicKey, str2ab(stringToEncode))
        .then(result => {
            encryptedUri = result;
        })
        .catch(function (err) {
            console.error(err);
            apiError = true;
        });
    return ab2str(encryptedUri);
}

var jsonString;
async function handleSubmit(event) {
    var demo = false;
    apiError = false;
    event.preventDefault();
    if (document.getElementById("userKey").value === "") {
        demo = true;
    } else {
        if (document.getElementById("signature").value === "" && !autoPro) {
            alert('No key file');
            return false;
        }
    }
    document.getElementById("loader").style.visibility = "visible";
    document.getElementById("loader").style.display = "block";
    var xtop = (window.outerHeight / 2) - (loader.offsetHeight / 2);
    var xleft = (window.outerWidth / 2) - (loader.offsetWidth / 2);
    loader.style.top = xtop + "px";;
    loader.style.left = xleft + "px";
    const data = new FormData(event.target);
    const valueAll = Object.fromEntries(data.entries());
    jsonString = JSON.stringify(valueAll);
    var encodedString = "";

    if (!demo) {
        var hash = keccak_256(jsonString).toString();
        if (autoPro) {
            makeRequestPro(hash, document.getElementById("ListNetwork").value, "v1.0");
        }
        else {
            encodedString = await strEncode(hash);
            if (apiError) {
                alert('Encode error');
                return false;
            }
            encodedString = btoa(encodedString);
        }
    }
    if (!autoPro) makeRequest(jsonString, encodedString, document.getElementById("ListNetwork").value, document.getElementById("VersionApi").value);
    return false; //don't submit !!!
}

function makeRequest(JSONValues, codedString, network, apiVersion) {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance de XMLHTTP');
        return false;
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.onerror = function() { alert("Bad request"); }
    let httpSsl = "http://";
    let hostName = window.location.href;
    if (hostName.match("https://")) {
        httpSsl = "https://";
    }
    //httpRequest.open('POST', httpSsl + 'localhost:8080');
    httpRequest.open('POST', httpSsl + 'ato-api.jcloud-ver-jpe.ik-server.com');

    let data = new FormData();
    data.append('json', JSONValues);
    data.append('access', JSON.stringify({ user_id: document.getElementById("userKey").value, pass: codedString, userNetwork: network, api: apiVersion }));
    httpRequest.setRequestHeader("Content-Type", 'multipart/form-data; boundary=' + data._boundary);
    httpRequest.responseType = 'arraybuffer';
    httpRequest.send(data);
}

function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        document.getElementById("loader").style.visibility = "hidden";
        document.getElementById("loader").style.display = "none";
        var checkOnly = document.getElementById("CmdCheckId").checked;
        if (httpRequest.status === 200 && checkOnly) {
            var decoder = new TextDecoder("utf-8");
            alert(decoder.decode(httpRequest.response));
            return;
        }
        if (httpRequest.status === 200) {
            var fileName = httpRequest.getResponseHeader('Content-Disposition').split("filename=")[1].replaceAll('"', '');
            var blob = new Blob([httpRequest.response], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(blob);
            let a = document.getElementById("downloadLink");
            a.href = url;
            if (fileName === undefined || fileName === "") {
                fileName = "IP_License.pdf";
            }
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            if (httpRequest.status === 0) {
                alert('[ERROR] No Network');
            } else {
                if (httpRequest.status === 400) {
                    var decoder = new TextDecoder("utf-8");
                    alert(decoder.decode(httpRequest.response));
                } else {
                    alert('[ERROR] Request probleme unknown error');
                }
            }
        }
    }
}

function makeRequestPro(codedString, network, apiServerVersion) {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance de XMLHTTP');
        return false;
    }
    httpRequest.onreadystatechange = alertContentsPro;
    httpRequest.onerror = function() { alert("Bad request"); }
    let httpSsl = "http://";
    let hostName = window.location.href;
    if (hostName.match("https://")) {
        httpSsl = "https://";
    }
    httpRequest.open('POST', httpSsl + 'localhost:8080');
    //httpRequest.open('POST', httpSsl + 'ato-api.jcloud-ver-jpe.ik-server.com');

    let data = new FormData();
    data.append('data', codedString);
    data.append('access', JSON.stringify({ user_id: document.getElementById("userKey").value, userNetwork: network, api: apiServerVersion }));
    httpRequest.setRequestHeader("Content-Type", 'multipart/form-data; boundary=' + data._boundary);
    httpRequest.responseType = 'text';
    httpRequest.send(data);
}

function alertContentsPro() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        document.getElementById("loader").style.visibility = "hidden";
        document.getElementById("loader").style.display = "none";
        if (httpRequest.status === 200) {
            makeRequest(jsonString, httpRequest.response, document.getElementById("ListNetwork").value, document.getElementById("VersionApi").value);
        } else {
            if (httpRequest.status === 0) {
                alert('[ERROR] No Network');
            } else {
                if (httpRequest.status === 400) {
                    var decoder = new TextDecoder("utf-8");
                    alert(decoder.decode(httpRequest.response));
                } else {
                    alert('[ERROR] Request probleme unknown error');
                }
            }
        }
    }
}
