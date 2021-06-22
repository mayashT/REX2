var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex;
var ground;
var invisibleGround
var cloud;
var obstaculo;
var obstaculosGroup, cloudsGroup

var over;
var reiniciar;

var jump;
var die;
var puuntos;

function preload() { //cargar las imagenes y guardarlas en una variable

    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_eyes = loadAnimation("trex_collided.png"); // abrir ojos al chocar imagen

    ground_Image = loadImage("ground2.png");
    cloud_Image = loadImage("cloud.png");

    obstaculo1 = loadImage("obstacle1.png");
    obstaculo2 = loadImage("obstacle2.png");
    obstaculo3 = loadImage("obstacle3.png");
    obstaculo4 = loadImage("obstacle4.png");
    obstaculo5 = loadImage("obstacle5.png");
    obstaculo6 = loadImage("obstacle6.png");

    over_image = loadImage("gameOver.png");
    reiniciar_image = loadImage("restart.png");

    jumpSound = loadSound("jump.mp3");
    die = loadSound("die.mp3");
    puntos = loadSound("checkPoint.mp3");
}

function setup() {

    createCanvas(600, 200); // area de juego

    trex = createSprite(50, 160, 20, 50); //crear la animación
    trex.addAnimation("running", trex_running); //añadirimagen al sprite
    trex.addAnimation("chocar", trex_eyes);
    trex.scale = 0.5;
    trex.x = 50

    ground = createSprite(200, 180, 400, 10); // crear el suelo 1
    ground.addImage("ground", ground_Image); //añadir la imagen
    ground.x = ground.width / 2; //hacer que haya suelo todo el tiempo

    over = createSprite(300, 100, 10, 10); // letrero-imagen de juego terminado
    over.addImage("gameOver", over_image);
    over.scale = 0.5;

    reiniciar = createSprite(300, 140, 10, 10); //letrero de reiniciar
    reiniciar.addImage("reinicio", reiniciar_image);
    reiniciar.scale = 0.5;

    invisibleGround = createSprite(200, 190, 400, 10); //para que dino toque suelo
    invisibleGround.visible = false; //hacerlo invisible


    var azar = Math.round(random(1, 100)); // numeros aleatorios
    console.log(azar); //que se muestren en la consola

    edges = createEdgeSprites();

    console.log("H" + "e" + "l" + "l" + "o" + "World" + "5"); //cadena de caracteres

    score = 0;

    obstaculosGroup = new Group();
    cloudsGroup = new Group();

    //trex.debug=true; //poner en comentario si lo quieren quitar
    //trex.setCollider ("rectangle",0,0, 400, trex.height);

    trex.setCollider("circle", 0, 0, 40);

    //var message = ("hola");alcance de variables
}

function draw() {

    background("#CCFFFF");
    drawSprites();

    // console.log (message);alcance de variables


    text("Puntuación: " + score, 300, 50);

    console.log(trex.y) //registrar los saltos de rex
    console.log(frameCount) //registrar los cuadros aleatorios de las nubes 
    trex.collide([invisibleGround]); //aterrizar en el suelo invisible



    if (gameState === PLAY) {
        //mueve el suelo
        ground.velocityX = -(4 + score / 100);
        //puntuación
        score = score + Math.round(getFrameRate() / 60);
        // score = score + Math.round(frameCount/60);

        if (score > 0 && score % 100 == 0) {
            puntos.play();
        }
        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        //salta cuando se presiona la barra espaciadora
        if (keyDown("space") && trex.y >= 100) {
            trex.velocityY = -13;
            jumpSound.play();
        }

        //agrega gravedad
        trex.velocityY = trex.velocityY + 0.8

        //aparece las nubes
        spawnClouds();

        //aparece obstáculos en el suelo
        spawnObstaculos();

        if (obstaculosGroup.isTouching(trex)) {
            //   trex.velocityY=-7;
            //  jumpSound.play ();
            gameState = END;
            die.play();
        }

        over.visible = false;
        reiniciar.visible = false;
    } else if (gameState === END) {
        trex.changeAnimation("chocar", trex_eyes);
        trex.velocityY = 0;
        ground.velocityX = 0;

        obstaculosGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        obstaculosGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        over.visible = true;
        reiniciar.visible = true;

        if (mousePressedOver(reiniciar)) {
            console.log("reinicia el juego");
            reset();
        }
    }

}

function reset() {
    gameState = PLAY;
    over.visible = false;
    reiniciar.visible = false;

    obstaculosGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
    score = 0;
}

function spawnClouds() { //funcion apaecer nubes

    if (frameCount % 100 === 0) { //cada 80 cuadros
        cloud = createSprite(600, 50, 40, 20);
        cloud.velocityX = -2;
        cloud.addImage(cloud_Image);
        cloud.scale = 0.6;
        cloud.lifetime = 310; //ciclo de vida

        cloud.depth = trex.depth; //profundidad
        trex.depth = trex.depth + 1;

        cloudsGroup.add(cloud);
    }
}

function spawnObstaculos() {

    if (frameCount % 100 === 0) {
        obstaculo = createSprite(400, 165, 10, 40);
        obstaculo.velocityX = -(3 + score / 100);

        var azar = Math.round(random(1, 6));
        switch (azar) {
            case 1:
                obstaculo.addImage(obstaculo1);
                break;
            case 2:
                obstaculo.addImage(obstaculo2);
                break;
            case 3:
                obstaculo.addImage(obstaculo3);
                break;
            case 4:
                obstaculo.addImage(obstaculo4);
                break;
            case 5:
                obstaculo.addImage(obstaculo5);
                break;
            case 6:
                obstaculo.addImage(obstaculo6);
                break;
            default:
                break;
        }

        obstaculo.scale = 0.7;
        obstaculo.lifetime = 200;

        obstaculosGroup.add(obstaculo);
    }
}