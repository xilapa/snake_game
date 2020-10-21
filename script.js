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

let direction;
let pts = 0;

function criaBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0,0,canvas.width,canvas.height);
}

function renderizaCobra () {
    for(i=0; i < snake.length; i++){
        context.fillStyle = "white";
        context.fillRect(snake[i].x - 1, snake[i].y -1, box+2, box+2);

        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);


        
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
    // caso o valor da direção seja falso (null, undefined, NaN, string vazia, 0 ou false), nada será feito. fonte: https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
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
        for (let i=0;i<snake.length;i++) {
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
    context.fillRect(comida.x, comida.y, box, box);

}

function pontuacao(){
    if (snake[0].x == comida.x && snake[0].y == comida.y){
        checaLocalComida();

        if (direction == "right" || direction == "left" || direction == "up" || direction == "down"){
            // evita pontuação quando a comida é gerada pela primeira vez
            snake.push(snake[(snake.length) - 1]);
            pts += 1;
            console.log(pts);
        }


    }
}

function evitaColisao(){
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

    for (let i=3;i<snake.length;i++) {
        if (snake[0].x == snake[i].x  && snake[0].y == snake[i].y) {
            clearInterval(iniciaJogo);}}

    criaBG ();
    renderizaCobra();   
    movimentaCobra();
    pontuacao();
    renderizaComida();
    evitaColisao();



}


var jogo = setInterval(iniciaJogo,150);




