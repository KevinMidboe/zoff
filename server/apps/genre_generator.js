import {
    pathThumbnail
} from "../settings/globals";
pathThumbnails = __dirname + "/../";

var Search = require(pathThumbnail + '/../handlers/search.js');
var db = require(pathThumbnail + '/../handlers/db.js');
var listNames = [];
db.getCollectionNames(function (e, d) {
    for (var i = 0; i < d.length; i++) {
        if (d[i].indexOf("_") < 0) {
            if (d[i].length > 0) {
                if (d[i].substring(0, 1) == "." || d[i].substring(d[i].length - 1) == ".") continue;
            }
            listNames.push(d[i]);
        }
    }
    console.log("Number of lists is " + listNames.length);
    recursivifyListLooping(listNames, 0);
});

function recursivifyListLooping(listNames, i) {
    if (i > listNames.length) {
        console.log("Done");
        return;
    }
    console.log("List " + i + " of " + listNames.length);
    getListItems(listNames, 0, function () {
        console.log("done");
    });
}

function getListItems(arr, i, callback) {
    console.log("List " + i + " of " + listNames.length + " - " + arr[i]);
    if (i >= arr.length) {
        if (typeof (callback) == "function") callback();
        return;
    }
    try {
        db.collection(arr[i]).find(function (e, d) {
            if (d.length > 0) {
                Search.get_genres_list_recursive(d, arr[i], function () {
                    getListItems(arr, i + 1, callback);
                });
            } else {
                getListItems(arr, i + 1, callback);
            }
        });
    } catch (e) {
        getListItems(arr, i + 1, callback);
    }
}