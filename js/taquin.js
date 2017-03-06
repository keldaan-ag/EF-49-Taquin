var L_history  = [];
var api_key     = 'AIzaSyDzDkv9g2y3YiudOwazvdkVEfC0LhYvS5Q';
var img         = new Image();
var gris        = new Image();
var canvas      = document.getElementById('canvas');
var context     = canvas.getContext('2d');
img.src         = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=-16.5004126,-151.7414904&zoom=12&size=600x600&key=" + api_key;
gris.src        = "img/gris.jpg";
L_img           = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
var img_ready   = false;
var gris_ready  = false;
var gris_x      = 0;
var gris_y      = 0;
var step        = 0;
var lat         = 0;
var long        = 0;
var east        = 0;
var west        = 0;
var zoom        = 0;

img.addEventListener('load', function() {
  // on attend que notre image principale ait été chargé et on la dessine dans notre canvas
        context.drawImage(img,0,0,600,600,0,0,600,600);
        img_ready = true;
        init();
    });

gris.addEventListener('load',function(){
  // on attend que le petit carré gris mobile ait été chargé et on le dessine dans notre canvas
        context.drawImage(gris,0,0,100,100,0,0,100,100);
        gris_ready = true;
        init();
})

function button_geocode() {
	//fonction onclick du bouton "c'est parti !", elle lance le géocoding du lieu
    lieu = document.getElementById('lieu').value
    get_geocode(lieu)
}
canvas.addEventListener("click",function(e){
        var mousePos = getMousePos(canvas, e);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
		console.log(message)
		var click_x = Math.trunc(mousePos.x/150)
		var click_y = Math.trunc(mousePos.y/150)
		message = 'Mouse position: ' + click_x + ',' + click_y;
		console.log(message)
		move(click_x,click_y)
})
function move(click_x,click_y){
	var dx = gris_x - click_x
	var dy = gris_y - click_y
	if (dx==0 & dy==0){
	}
	if (dx==0){
		if(dy>0){move_gris(to_up,dy)}
		else{move_gris(to_down,Math.abs(dy))}
	}
	if (dy==0){
		if(dx>0){move_gris(to_left,dx)}
		else{move_gris(to_right,Math.abs(dx))}
	}
}

function move_gris(method,n){
	for(var i = 0; i < n; i++){method()}
}
function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: e.clientX - rect.left,
	  y: e.clientY - rect.top
	};
}

function get_geocode(lieu){
  //Géocodage, on prend un lieu en entrée et on en sort la latitude et la longitude
  $.ajax({
      type: 'GET',
      dataType: 'json',
      url: create_url_geocode(lieu),
      crossDomain: true,
      complete: function (data) {
             if (data.readyState === 4 && data.status === 200) {
                console.log(data.responseJSON);
                lat   = data.responseJSON.results[0].geometry.location.lat
                long  = data.responseJSON.results[0].geometry.location.lng
				east  = data.responseJSON.results[0].geometry.viewport.northeast.lat;
				west  = data.responseJSON.results[0].geometry.viewport.southwest.lat;
				zoom  = Math.round(Math.log(960 * 360 / Math.abs(east-west) / 256) / Math.LN2) - 2;
                create_img()
            }
            else{
              alert("Aucun lieu n'a été reconnu dans ce que vous avez tapé")
            }
      }
    })
}

function create_url_geocode(lieu) {
	// créé l'url envoyé au serveur map
      var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
        url  += lieu.split(' ').join('+');
        url  += "&key="
        url  += api_key
      console.log(url);
      return url
}

function create_url_img() {
	// créé l'url envoyé au service de map static
      var url = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center="
      url    +=  lat  + ","
      url    +=  long
      url    +=  "&zoom="
	  url    +=  zoom
	  url    +=  "&size=600x600&key="
      url    +=  api_key
      console.log(url);
      return url
}

function create_img() {
	//créé un nouvelle image
      img.src = create_url_img()
}

function init() {
  // on initalise toutes nos fonctions une fois que les images sont chargés
  if(img_ready && gris_ready){
        L_img     = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        L_history = [];
        create_objs();
        do_bordel();
        draw();
        step = L_history.length-1;
  }
}

function to_right(){
  //pour faire aller le carré gris à droite
    if(gris_x<3){
        var temp_x                    = L_img[gris_x][gris_y].x
        var temp_y                    = L_img[gris_x][gris_y].y

        L_img[gris_x][gris_y].x       = L_img[gris_x+1][gris_y].x
        L_img[gris_x][gris_y].y       = L_img[gris_x+1][gris_y].y

        L_img[gris_x+1][gris_y].x     = temp_x
        L_img[gris_x+1][gris_y].y     = temp_y

        gris_x                       += 1
        L_history.push(to_left)
        draw()
      }
}

function to_left(){
  //pour faire aller le caré gris à gauche
    if(gris_x>0){
        var temp_x                    = L_img[gris_x][gris_y].x
        var temp_y                    = L_img[gris_x][gris_y].y

        L_img[gris_x][gris_y].x       = L_img[gris_x-1][gris_y].x
        L_img[gris_x][gris_y].y       = L_img[gris_x-1][gris_y].y

        L_img[gris_x-1][gris_y].x     = temp_x
        L_img[gris_x-1][gris_y].y     = temp_y

        gris_x                     -= 1
        draw()
        L_history.push(to_right)
      }
}

function to_up(){
  // pour faire monter le carré gris en haut
  if(gris_y>0){
        var temp_x                      = L_img[gris_x][gris_y].x
        var temp_y                      = L_img[gris_x][gris_y].y

        L_img[gris_x][gris_y].y       = L_img[gris_x][gris_y-1].y
        L_img[gris_x][gris_y].x       = L_img[gris_x][gris_y-1].x

        L_img[gris_x][gris_y-1].x     = temp_x
        L_img[gris_x][gris_y-1].y     = temp_y

        gris_y                       -= 1
        draw()
        L_history.push(to_down)
      }
}

function to_down(){
  // pour faire descendre le carré gris en bas
  if(gris_y<3){
      var temp_x                      = L_img[gris_x][gris_y].x
      var temp_y                      = L_img[gris_x][gris_y].y

      L_img[gris_x][gris_y].y       = L_img[gris_x][gris_y+1].y
      L_img[gris_x][gris_y].x       = L_img[gris_x][gris_y+1].x

      L_img[gris_x][gris_y+1].x     = temp_x
      L_img[gris_x][gris_y+1].y     = temp_y

      gris_y                       += 1
        draw()
        L_history.push(to_up)
      }
}

function draw() {
	//refresh l'affichage du canvas en dessinant les changements
  draw_image()
  draw_gris()
}


function draw_image(){
  // on dessine l'image par l'intermédiaire de nos objets "petites images"
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
          context.drawImage(img,
            L_img[i][j].x,
            L_img[i][j].y,
            150,
            150,
            L_img[i][j].x_draw,
            L_img[i][j].y_draw,
            150,
            150);
      }
  }
}
function draw_gris(){
	//affiche le petit carré blanc
  context.clearRect(gris_x*150,
                    gris_y*150,
                    150,
                    150)

  context.drawImage(gris,
                    0,
                    0,
                    150,
                    150,
                    gris_x*150,
                    gris_y*150,
                    150,
                    150)
}

function create_objs(){
  // on créé des objets 'petites images' qui contiennent plusieurs attributs :x,y,data
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            L_img[i][j] = {
                  x       : i * canvas.width  / 4, // la position où peindre l'image
                  y       : j * canvas.height / 4,
                  x_draw  : i * canvas.width  / 4,
                  y_draw  : j * canvas.height / 4
                  //data : context.getImageData(i*canvas.width/4 , j*canvas.height/4 ,150,150)}; // la matrice de pixel à peindre
                 }
        }
    }
}

function do_bordel() {
  // on mélange les pièces du puzzle en réalisant
  // un ensemble de mouvements aléatoires compris entre 20 et 40
    var random_1 = Math.floor((Math.random() * 20) + 100);
    var random_2 = Math.floor((Math.random() * 5));
    for (var i = 0; i < random_1; i++) {
      random_2 = Math.floor((Math.random() * 4));
      switch (random_2) {
        case 0:
          to_right();
          break;
        case 1:
          to_left();
          break;
        case 2:
          to_up();
          break;
        case 3:
          to_down();
      }
    }
    set_gris();
}

function set_gris(){
  // On remet notre petit carré gris en haut à gauche de l'écran
  for (var i = 0; i < 4; i++) {
    to_up()
  }
  for (var i = 0; i < 4; i++) {
    to_left()
  }
}

addEventListener("keyup", function(e){
  // on écoute en permanence les touches préssées par l'utilisateur,
  // ici, on ne s'intéresse qu'aux touches directionnelles du clavier
  //Dès qu'une touche a été detecté, on enclenche la méthode correspondante
  switch(e.keyCode) {
    case 38:
        to_down();
        break;
    case 37:
        to_right();
        break;
    case 40:
        to_up();
        break;
    case 39:
        to_left();
        break;
   }
})


function resolve() {
	// fonction de résolution auto
    L_history[step]();
    step--;
    if(step >= 0){
      window.setTimeout(resolve, 200);
    }
    else {
      L_history=[]
    }
}

function button_resolve() {
	// function onclick lancé par le bouton "Résolution automatique"
    step = L_history.length-1
    resolve()
}
