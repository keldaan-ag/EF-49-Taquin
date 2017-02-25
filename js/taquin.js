
var api_key     = 'AIzaSyDzDkv9g2y3YiudOwazvdkVEfC0LhYvS5Q';
var img         = new Image();
var gris        = new Image();
var canvas      = document.getElementById('canvas');
var context     = canvas.getContext('2d');
img.src         = "img/visage.jpg";
gris.src        = "img/gris.jpg";
L_img           = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
var img_ready   = false;
var gris_ready  = false;
var gris_x      = 0;
var gris_y      = 0;

img.addEventListener('load', function() {
  // on attend que notre image principale ait été chargé et on la dessine dans notre canvas
        context.drawImage(img,0,0,600,600);
        img_ready = true;
        init();
    });

gris.addEventListener('load',function(){
  // on attend que le petit carré gris mobile ait été chargé et on le dessine dans notre canvas
        context.drawImage(gris,0,0);
        gris_ready = true;
        init();
})



function init() {
  // on initalise toutes nos fonctions une fois que les images sont chargés
  if(img_ready && gris_ready){
        create_objs();
        do_bordel();
        draw_image();
        console.log(L_img);
  }
}

function to_right(){
  //pour faire aller le carré gris à droite
    if(gris_x<3){
        temp                           = L_img[gris_x + 1][gris_y].data
        L_img[gris_x + 1][gris_y].data = L_img[gris_x][gris_y].data
        L_img[gris_x][gris_y].data     = temp
        gris_x                        += 1
        draw_image()
      }
}

function to_left(){
  //pour faire aller le caré gris à gauche
    if(gris_x>0){
        temp                           = L_img[gris_x - 1][gris_y].data
        L_img[gris_x - 1][gris_y].data = L_img[gris_x][gris_y].data
        L_img[gris_x][gris_y].data     = temp
        gris_x                        -= 1
        draw_image()
      }
}

function to_up(){
  // pour faire monter le carré gris en haut
  if(gris_y>0){
        temp                           = L_img[gris_x][gris_y - 1].data
        L_img[gris_x][gris_y - 1].data = L_img[gris_x][gris_y].data
        L_img[gris_x][gris_y].data     = temp
        gris_y                        -= 1
        draw_image()
      }
}

function to_down(){
  // pour faire descendre le carré gris en bas
  if(gris_y<3){
        temp                           = L_img[gris_x][gris_y + 1].data
        L_img[gris_x][gris_y + 1].data = L_img[gris_x][gris_y].data
        L_img[gris_x][gris_y].data     = temp
        gris_y                        += 1
        draw_image()
      }
}

function draw_image(){
  // on dessine l'image par l'intermédiaire de nos objets "petites images"
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
          context.putImageData(L_img[i][j].data,L_img[i][j].x,L_img[i][j].y)
      }
  }
}

function create_objs(){
  // on créé des objets 'petites images' qui contiennent plusieurs attributs :x,y,data
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            L_img[i][j] = {
                  x    : i * canvas.width  / 4, // la position où peindre l'image
                  y    : j * canvas.height / 4,
                  data : context.getImageData(i*canvas.width/4 , j*canvas.height/4 ,150,150)}; // la matrice de pixel à peindre
        }
    }
}

function do_bordel() {
  // on mélange les pièces du puzzle en réalisant
  // un ensemble de mouvements aléatoires compris entre 20 et 40
    var random_1 = Math.floor((Math.random() * 20) + 20);
    var random_2 = Math.floor((Math.random() * 5));
    console.log(random_1,random_2);
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
        to_up()
        break;
    case 37:
        to_left()
        break;
    case 40:
        to_down()
        break;
    case 39:
        to_right()
        break;
   }
})
