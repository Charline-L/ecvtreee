var url = 'requetes.php';
var goute = $('#tombe')[0];
var resetGoute= $('#reset-goute')[0];

var COLORS = {
	dev: ['#ef2828','#f74f4f','#fc7171','#fc7171','#f99595'],
	ux: ['#07f71b','#27f438','#42f751','#71f77c','#8def95'],
	market: ['#07c2f7','#28c3ef','#28c3ef','#83e1fc','#9ce7fc'],
	wd: ['#d3adff','#ba84f9','#9f54f7','#8f36f7','#780ef4']
}

var JQTWEET = {
	old: [],
	getOldTweets: function() {
		$.ajax({
	    url: url+'?requete=old',
			dataType: 'json',
	    success: function(data) {
				var etat= data.etat;
				if (etat === 'ok'){
					// ajouter dans les tweets old
					for(id in data.ids) {
						JQTWEET.old.push(data.ids[id]);
					}
					// reset le nombre de tweets
					JQTWEET.number();
				}
				else if (etat !== 'vide'){
					//TODO
					// afficher un message d'erreur de connexion
					console.log(etat);
				}
	    },
			error: function(message){
				console.log(message);
			}
		});
	},
	findNewTweet: function() {
		console.log('find');
		var request = {
	    hashtag: '#ECVTree',
	    count: 1,
	    api: 'search_tweets'
		}
		$.ajax({
	    url: url+'?requete=find',
	    type: 'POST',
	    dataType: 'json',
	    data: request,
	    success: function(data) {
	      if (data.httpstatus == 200) {
					data = data.statuses;
					var id = data[0].id_str;
					// test si l'id du tweet est déjà dans la bdd sinon ajoute
					if (JQTWEET.old.indexOf(id) < 0){
						// si non ajoute le tweet dans la bdd
						JQTWEET.addNewTweet(data);
					}
      	}
	    },
			error: function(message){
				console.log(message);
			}
		});
	},
	addNewTweet: function(dataGet) {
		var section;
		var couleur;
		var message = dataGet[0].text;
		var randomColor= Math.trunc(Math.random() * (4));
		if (message.toLowerCase().indexOf('#market') > -1){
			section = COLORS.market;
			couleur= section[randomColor];
		}
		else if (message.toLowerCase().indexOf('#dev') > -1){
			section = COLORS.dev;
			couleur= section[randomColor];
		}
		else if (message.toLowerCase().indexOf('#ux') > -1){
			section = COLORS.ux;
			couleur= section[randomColor];
		}
		else if (message.toLowerCase().indexOf('#wd') > -1){
			section = COLORS.wd;
			couleur= section[randomColor];
		}
		else {
			// TODO:
			couleur = 0;
			console.log('pas de section couleur hasard ?');
		}
		var message = JQTWEET.removeHashtag(dataGet[0].text);
		var request = {
	    message: message,
	    couleur: couleur,
			id: dataGet[0].id_str,
			utilisateur: dataGet[0].user.screen_name
		}
		// ajoute dans la bdd
		$.ajax({
	    url: url+'?requete=add',
	    type: 'POST',
			dataType: 'json',
	    data: request,
	    success: function(data) {
				var etat= data.etat;
				var utilisateur = data.utilisateur;
	      if (etat === 'ok') {
					var id= data.id;
					// ajouter le tweet dans le tableau des tweets postés
					JQTWEET.old.push(id);
					// modifier le nombre des goutes d'eau
					JQTWEET.number();
					// faire tomber la goute
					ANIMSTART.goute();
					// TODO:
					// renvoyer un tweet pour confirmer l'envoi
					console.log('tweet enregistré');
					if (JQTWEET.old.length === 2){
						console.log('arbre');
						clearInterval(watcher);
						setTimeout(function(){
							JQTWEET.getTweetsTree();
						}, 1000)
					}
      	}
				else {
					// TODO:
					// renvoyer un tweet pour l'erreur
					console.log('erreur enregistrement bdd', request.id);
				}
	    },
			error: function(message){
				// TODO:
				// renvoyer un tweet pour l'erreur
				console.log('erreur');
			}
		});
	},
	removeHashtag: function(message){
		var messageText = message.toLowerCase();
		messageText= messageText.replace('#ecvtree', ' ');
		messageText= messageText.replace('#dev', ' ');
		messageText= messageText.replace('#ux', ' ');
		messageText= messageText.replace('#market', ' ');
		messageText= messageText.replace('#wd', ' ');
		while (messageText[0] === ' '){
			messageText= messageText.slice(1);
		}
		return messageText;
	},
	number: function(){
		// ajoute dans l'html
		$('#nb-tweets').text(JQTWEET.old.length);
	},
	getTweetsTree: function(){
		console.log('ok function arbre');
		$.ajax({
	    url: url+'?requete=createTree',
			dataType: 'json',
	    success: function(data) {
				var etat= data.etat;
				if (etat === 'ok'){
					// import json
					$.getJSON('feuilles.json', function(json){
						$("#graine").css('opacity', '0');
						$("#arbre").css('opacity', '1');
						for ( i=0; i<json.length; i++){
							var element = json[i].html;
							var containerFeuilles = $('#container-feuilles');
							var feuilles = $('#container-feuilles').html();
							containerFeuilles.html( feuilles + element);
							containerFeuilles.find('g:last-child').attr('id', data.ids[i]);
							containerFeuilles.find('g#'+data.ids[i]).find('*').css('fill', data.couleurs[i]);
							containerFeuilles.find('g#'+data.ids[i]).attr('data-message', data.messages[i]);
						}
					});
					console.log('tweets récupérés');
				}
				else {
					console.log('erreur connexion bdd');
				}
	    },
			error: function(message){
				console.log(message);
			}
		});
	}
};

ANIMSTART= {
	goute: function(){
		$('#eau').css('opacity', '1');
		goute.beginElement();
		goute.addEventListener('endEvent', ANIMEND.goute,false);
	},
	arbre: function(){
		// va chercher les tweets
		// attribut à une feuille
	},
	feuille: function(){

	}
}

ANIMEND= {
	goute: function(){
		// reset les éléments
		$('#eau').css('opacity', '0');
		resetGoute.beginElement();
	}
}


JQTWEET.getOldTweets();
var watcher = setInterval(function(){
	JQTWEET.findNewTweet();
}, 20000)
