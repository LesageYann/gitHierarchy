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
	client.repo('Valtena/gitHierarchy').prs(function(err,request){
	    var pullRequest = [];
	    var tab = [];
	    for( i = 0;i < request.length; i++){
		pullRequest[i] = {
		    id: request[i].id,
		    number: request[i].number,
		    title: request[i].title,
		    date: request[i].created_at
		}
	    };
	    
	    for(i = 0; i < tab.length; i++){
		var pr = client.pr('Valtena/gitHierarchy',tab[i].number);
		pr.info(function(err,info){
		    var assignees = [];
		    for( j = 0; j < info.length; j++){
			assignees = {
			    login: info[j].login,
			    id: info[j].id
			};
		    }
		});		
		pr.files(function(err,file){
		    var files = [];
		    for( k = 0; k < files.length; k++){
			files[k] = file.filename;
		    };
		});
		tab[i] = {
		    id : pullRequest[i].id,
		    number: pullRequest[i].number,
		    title: pullRequest[i].title,
		    date: pullRequest[i].date,
		    assignees: assignees,
		    files: files
		};
	    };
	    res.send(tab);
	});
    });

    var pullReq = 3;
    
    git.get('/getPullRequest', function(req,res){
	client.pr('Valtena/gitHierarchy',pullReq).info(function(err,request){
	    res.send(request);
	});
    }); 

    git.get('/getPullRequest/file', function(req,res){
	client.pr('Valtena/gitHierarchy',pullReq).files(function(err,file){
	    res.send(file);
	});
    });

    git.get('/getPullRequest/commits', function(req,res){
	client.pr('Valtena/gitHierarchy',pullReq).commits(function(err,commit){
	    res.send(commit);
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
