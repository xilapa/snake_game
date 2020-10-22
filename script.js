let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
let box = 16;
// o canvas será renderizado como quadrados 
let snake = [];

snake[0] = {
    x: parseInt((canvas.width/2),10),
    y: parseInt((canvas.height/2),10)
};

let comida = {   
    x: Math.floor(Math.random() * (canvas.width/box)) * box,
    y: Math.floor(Math.random() * (canvas.height/box)) * box
}

let colors =[{bg: "#79856d", snake: "#455140"},{bg: "#8eb268",snake:"#34391b"}];
color = colors[0];

let direction;
let pts = 0;

let pausado = false;
let telaAgora;

let velocidade = 150;

function renderizaBG() {
    context.fillStyle = color.bg;
    context.fillRect(0,0,canvas.width,canvas.height);
}

function renderizaCobra () { 
    for(i=0; i < snake.length; i++){
            context.fillStyle = color.snake;
            context.fillRect(snake[i].x + 1, snake[i].y + 1, box - 2, box - 2);    
    }
}

function userInput(){
    // https://www.w3.org/TR/uievents-code/
    document.addEventListener('keydown', (e) =>{
        switch (e.key){
            case "Down":
            case "ArrowDown":
                if (direction != "up") direction = "down";
                break;

            case "Up":
            case "ArrowUp":
                if (direction != "down") direction = "up";
                break;

            case "Left":
            case "ArrowLeft":
                if (direction != "right") direction = "left";
                break;

            case "Right":
            case "ArrowRight":
                if (direction != "left") direction = "right";
                break;
        }
        });    

    // document.addEventListener('keyup', (e) => {direction ="";});
    // desabilita o movimento continuo da cobrinha
}

function movimentaCobra(){
    // pegando as coordenadas da cabeça da cobra
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // alterando a nova direção da cabeça da cobra conforme o input do usuário
    userInput();
    if (direction=="right") snakeX += box;
    if (direction=="left") snakeX -= box;
    if (direction=="up") snakeY -= box;
    if (direction=="down") snakeY += box;   

    // fazendo a cobrinha aparecer na outra ponta da tela
    if (snakeY < 0 ) snakeY = canvas.height - box;
    if (snakeY > (canvas.height - box)) snakeY = 0;
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX > (canvas.width - box)) snakeX = 0;
    
    if (direction == "right" || direction == "left" || direction == "up" || direction == "down"){
    // salvando a nova direção da cabeça da cobra
        let newHead = {
            x: snakeX,
            y: snakeY
        }

        // removendo o último elemento da cobra
        snake.pop();

        // adicionando a nova cabeça com a direção selecionada no início do array
        snake.unshift(newHead);
    }
   

}

function checaLocalComida(){
    // garante que a comida será gerada fora da cobra
    let dentroCobra = true;

    comida.x = Math.floor(Math.random() * (canvas.width/box)) * box;
    comida.y = Math.floor(Math.random() * (canvas.height/box)) * box;

    while (dentroCobra) {
        for (let i=0 ; i<snake.length ; i++) {
            if (snake[i].x == comida.x && snake[i].y == comida.y) {
                comida.x = Math.floor(Math.random() * (canvas.width/box)) * box;
                comida.y = Math.floor(Math.random() * (canvas.height/box)) * box;
            } else{
                dentroCobra = false;
            }
        }
    } 
}

function renderizaComida(){   
    context.fillStyle = "red";
    context.fillRect(comida.x + 1, comida.y + 1, box - 2, box - 2);
}

function pontuacao(){
    if (snake[0].x == comida.x && snake[0].y == comida.y){
        checaLocalComida();
        if (direction == "right" || direction == "left" || direction == "up" || direction == "down"){
            // evita pontuação quando a comida é gerada pela primeira vez
            snake.push(snake[(snake.length) - 1]);
            pts += 1;
            console.log(pts);
            document.getElementById("pontuacao").innerHTML = "Pontos: " + pts ;
        }
    }
}

function evitaAutoColisao(){
    if (direction == "right" || direction == "left" || direction == "up" || direction == "down" && snake.length >= 4){
        for (let i=3;i<snake.length;i++) {
            if (snake[0].x == snake[i].x  && snake[0].y == snake[i].y) {
                clearInterval(jogo);
                console.log("colisão");
            }    
        }
    }
}



function iniciaJogo() {
    renderizaBG ();
    movimentaCobra();
    renderizaCobra();   
    pontuacao();
    renderizaComida();
    evitaAutoColisao();
}
var jogo = setInterval(iniciaJogo,velocidade);




function reinciaJogo(){
    snake = [];
    snake[0] = {
        x: parseInt((canvas.width/2),10),
        y: parseInt((canvas.height/2),10)
    };
    pts = 0;
    direction = 0;
    document.getElementById("pontuacao").innerHTML = "Pontos: 0";
    checaLocalComida();
    jogo = setInterval(iniciaJogo,150);
    pausado = false;
}
document.getElementById("new_game").addEventListener("click", reinciaJogo);

function pausarJogo(){
    if (pausado){
        snake = telaAgora.SnakeNow;
        comida = telaAgora.comidaNow;
        pts = telaAgora.ptsNow;
        direction = telaAgora.directionNow;
        jogo = setInterval(iniciaJogo,150);
        pausado = false;
    }else {
        telaAgora = {
            SnakeNow: snake,
            comidaNow: comida,
            ptsNow: pts,
            directionNow: direction
        }
        pausado = true;
        clearInterval(jogo);
    }
}
document.getElementById("pause_game").addEventListener("click",pausarJogo);

function mudaCor(){
    if (color == colors[0]){
        color = colors[1];
        if (pausarJogo){
            renderizaBG();
            renderizaCobra();
            renderizaComida();
        }
    }else{
        color = colors[0];
        if (pausarJogo){
            renderizaBG();
            renderizaCobra();
            renderizaComida();
        }
    }
}
document.getElementById("muda_cor").addEventListener("click",mudaCor);

function mudaVelocidade(e){
    if (e.id == "diminuir"){
        velocidade += 10;
        clearInterval(jogo);
        jogo = setInterval(iniciaJogo,velocidade);
        console.log(velocidade);
    }
    if (e.id == "aumentar"){
        velocidade -= 10;
        clearInterval(jogo);
        jogo = setInterval(iniciaJogo,velocidade);
        console.log(velocidade);
    }
    if (e.id =="reset"){
        velocidade = 150;
        clearInterval(jogo);
        jogo = setInterval(iniciaJogo,velocidade);
        console.log(velocidade);
    }
    
}
document.getElementById("aumentar").addEventListener("click",function(){mudaVelocidade(this)});
document.getElementById("diminuir").addEventListener("click",function(){mudaVelocidade(this)});
document.getElementById("reset").addEventListener("click",function(){mudaVelocidade(this)});