exports.init=function(express,app){
    git=express();

    var octo = require('octonode');
    var client;
    
    git.get('/collaborators', function(req,res){
	client.repo('Valtena/gitHierarchy').collaborators(
	    function(err,collabo){
		formatCollaborators(res,collabo)
	    }) ;
    });

    git.get('/connect', function(req,res){
	client = octo.client({
	    username: req.query.username,
	    password: req.query.password
	});
	res.sendStatus(200);
    });

    git.get('/getPullRequests', function(req,res){
	client.repo('Valtena/gitHierarchy').prs(function(err,notification){
	    res.send(notification);
	});
    });

    git.get('/getPullRequest', function(req,res){
	client.pr('Valtena/gitHierarchy',3).info(function(err,notification){
	    res.send(notification);
	});
    }); 

    git.get('/getPullRequest/file', function(req,res){
	client.pr('Valtena/gitHierarchy',3).files(function(err,file){
	    res.send(file);
	});
    });
    
    app.use('/github',git);
}


function formatCollaborators(res,collabo){
    var toSend = [];
    for(var i = 0; i < collabo.length; i ++){
	toSend[i] = {
	    data : { id : collabo[i].login }
	}
    }
    res.send(toSend);
}
