exports.init=function(express,app){
    git=express();

    var octo = require('octonode');
    var client;
    
    git.get('/collaborators', function(req,res){
  	client.repo(req.query.repo).collaborators(
	      function(err,collabo){
		       formatCollaborators(res,collabo);
	      }) ;
    });

    git.get('/connect', function(req,res){
	client = octo.client({
	    username: req.query.username,
	    password: req.query.password
	});
	res.sendStatus(200);
    });

    git.get('/getNotification', function(req,res){
	client.repo('Valtena/gitHierarchy').notification(3,function(err,notification){
	    res.send(notification);
	});
    });


    git.get('/getPullRequests', function(req,res){
	client.repo('Valtena/gitHierarchy').prs(function(err,notification){
	    res.send(notification);
	});
    });

    git.get('/getPullRequest', function(req,res){
	client.repo('Valtena/gitHierarchy/pulls/3').info(function(err,notification){
	    res.send(notification);
	});
    }); 

    git.get('/getPullRequestComment', function(req,res){
	client.repo('Valtena/gitHierarchy/pulls/3').comments(function(err,notification){
	    res.send(notification);
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
