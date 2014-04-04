var fs = require('fs');
var path = require('path');
//var util = require('util');
var posix = require('posix');
//var colors = require('colors');
var rootChecker = require('rootChecker');
var lnCounter = require('lineCounter').createLineCounter();
var github = require('github');
var repositoriesData = require('../eKnightsData').eKnightsData;
var index = repositoriesData.length - 1;

rootChecker.isRootUser(function() {
    /**
     * /etc/security/limits.conf 
     * Set resource limits: Specifies maximum value of file descriptors that can be opened by this process.
     * NOTE:
     * just root can do this.
     * @see man setrlimit
     */
    posix.setrlimit('nofile', {soft: 100000, hard: 100000});
});
/**
 * @param {string} filename Full path of file
 * @returns 
 */
function dirTree(filename) {
    var stats = fs.lstatSync(filename);
    if (filename.search('/\.git') !== -1)
        return {"name": "", "size": 0, "lines": 0, "children": 'no children', "log": ''};

    if (stats.isDirectory()) {
        var info = new Object();
        info.name = path.basename(filename);
        info.size = lnCounter.directorySize(filename);
        info.lines = lnCounter.countLinesInFolder(filename);
        var children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });

        info.children = children;
        github.getLogForFile(filename, function(data) {
            info.log = data;
        });
        return info;
    } else {
        var file = new Object();
        file.name = path.basename(filename);
        file.size = lnCounter.fileSize(filename);
        file.lines = lnCounter.countLinesInFile(filename);
        file.children = '';
        github.getLogForFile(filename, function(data) {
            file.log = data;
        });
        return file;
    }
}

function getDepth(parent) {
    var depth = 0;
    for (var child in parent) {
        if (typeof parent[child] === 'object') {
            var tmpDepth = getDepth(parent[child]);
            if (tmpDepth > depth) {
                depth = tmpDepth;
            }
        }
    }
    return 1 + depth;
}


/**
 *@param {number} code
 *@param {string} folderToMap 
 */
var mapData = function(folderToMap, cb) {

    var obj = dirTree(__dirname + "/repositories/" + folderToMap);
    var fileWriter = function() {
        fs.writeFile("../data/" + repositoriesData[index].slug + "-pi.json", JSON.stringify(obj), function(err) {
            cb(--index);
            if (err)
                console.log(err);
            else
                console.log("../data/" + folderToMap + "-pi.json was saved!");
        });
    };
    github.setFunction(fileWriter);
};




var repositoriesPath = __dirname + "/repositories/";



function main() {
    if (index !== -1) {
//        console.log('i: ' + index);
        var folderName = github.getFolderName(repositoriesData[index].github_repo);
        github.setDotGitPath(repositoriesPath + folderName + '/.git');
        github.cloneOrPull(repositoriesData[index].github_repo + '.git', function() {
            mapData(folderName, main);
        }, true);
    }
}

main();

