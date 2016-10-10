var octo = require('octonode');
var argv = require('minimist')(process.argv.slice(2));
var prompt = require('prompt');
var fs = require('fs');

var client,config;
try {
  config = require('./config.json');
} catch (e) {
  config={};
}

function getPath(file){
  return file.contents_url.match(/\/contents\/(.*)\?ref/)[1];
}

function reducePath(path){
  var m=path.match(/(.*)\/([^\/]*)/);
  if(m)
    return m[1];
  return path;
}

function UserDirMatch(file, user){
  var path= getPath(file);
  for(var i=0; i< user.dir.length; i++){
    if (path.match(user.dir[i]))
      return true;
  }
  return false;
}

function addCollaborator(previous, file){
  config.collaborators.reduce(function(res, user){
    if (UserDirMatch(file, user))
      previous.push(user.login);
  });
};

function getPullRequest(value){
  client.repo(config.repo, value.number).files(function(err, files){
    var userAssigned= files.reduce(addCollaborator,[]);
    if (userAssigned.lenth=0){
	     userAssigned.push(config.user.username); 
    }
    console.log("assigne : ", userAssigned," to PR :", value.number);
    client.issue(config.repo, value.number).update({
      'assignees': userAssigned
    });
	});
}; 

function attributePRs(){
  console.log("attribute PRS");
  client.repo(config.repo).prs(function(err,prs){
      if(err)
        console.log(err);
      
      console.log(prs);
      prs = JSON.stringify(prs);
      console.log(prs);
	    prs.map(getPullRequest);
	});
}

function autoSetDir(){
  client.repo(config.repo).prs({
      page: 1,
      per_page: 100,
      state: 'closed'
    },function(err,prs){
      console.log(prs.length);
	    Promise.all(prs.map(getfilesClosedPullRequest)).then(overwrite);
	});
}

function getfilesClosedPullRequest(value){
  return new Promise(function(resolve, reject) {
    client.pr(config.repo, value.number).info(function (err, info) {
      client.pr(config.repo, value.number).files(function (err, files) {
        for (var i = 0; i < config.collaborators.length; i++) {
          config.collaborators[i].dir=[];;
        }
        
        Promise.all(files.map(function (file) {
          addDirToCollaborator(file,info);
        })).then(resolve());
      });
    });
	});
};

function addDirToCollaborator(file,info){
      console.log("file",file);
  return Promise.all(config.collaborators.map(function ( user) {
    return new Promise(function (resolve, reject) {
      path = getPath(file);
      console.log("path",path);
      console.log("user",user);
      if (equalLogin(user, info.assignees))
        user.dir.push(reducePath(path));
      console.log("user mod", user);
      resolve();
    });
  }));
}

function equalLogin(user, assignees){
  for(var i=0;i< assignees.length ;i++){
    console.log(assignees[i].login,user.login,assignees[i].login==user.login)
    if(assignees[i].login==user.login)
      return true;
  }
  return false;
}

function getCollaborators() {
  return new Promise(function(resolve, reject) {
    client.repo(config.repo).collaborators(
          function (err, collabo) {
            resolve(formatCollaborators( collabo));
          });
  });
};

function formatCollaborators( collabo) {
  var toSend = [];
  for (var i = 0; i < collabo.length; i++) {
    toSend[i] = {
      login: collabo[i].login
    };
    setDir(toSend[i]);
  }
  return toSend;
}

function setDir(collab){
  collab.dir=[];
}

function getUserInfo(resolve, reject){
   prompt.get([{
    name: 'username',
    description: 'Github username',
    type: 'string',
    required: true
  }, {
    name: 'password',
    description: 'password',
    type: 'string',
    hidden: true,
    required: true
  }, {
    name: 'repo',
    description: 'repository',
    type: 'string',
    required: true
  }], function(err, results) {
    if(err) reject();
    console.log(results);
    config.user={
      username: results.username,
      password: results.password
    };
    config.repo = results.repo;
    resolve();
  });
}

function init () {
  client = octo.client(config.user);
  getCollaborators().then(function(res){
    config.collaborators = res;
    if(argv.auto){
      autoSetDir();
      console.log('collabo',res);
    }else{
      overwrite();
    }
  });
}

function overwrite(){
  console.log("to save : ", config);
   fs.writeFile('./config.json', JSON.stringify(config), function (err) {
      if (err)
        throw err;
      console.log('It\'s saved!');
  });
}

function main(){
  if(argv.init){
    init();
  } else {
    attributePRs();
  }
}

new Promise(function(resolve, reject) {
  if(!config.user){
    getUserInfo(resolve, reject);
  } else {
    resolve();
  }
}).then(main);

