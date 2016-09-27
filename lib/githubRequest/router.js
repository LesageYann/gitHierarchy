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
