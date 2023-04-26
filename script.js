//scoring elements with some UI elements as well
const modalEl = document.querySelector('#modalEl');
const title = document.querySelector('#title');
const instruction = document.querySelector('#instruction');
const gameovertxt = document.querySelector('#gameovertxt');
const bigScoreEl = document.querySelector('#bigScoreEl');
const textScoreEl = document.querySelector('#textScoreEl');
const bigHighScoreEl = document.querySelector('#bigHighScoreEl');
const newHighScoreText = document.querySelector('#newHighScoreText');
const startGameBtn = document.querySelector('#startGameBtn');
const instBtn = document.querySelector('#instBtn');
const scoreDisplay = document.querySelector('#scoreDisplay');
const highscoreDisplay = document.querySelector('#highscoreDisplay');
const scoreEl = document.querySelector('#scoreEl');
const highscoreEl = document.querySelector('#highscoreEl');
const gameBoard = document.querySelector('#gameBoard');
const usetouchpad = document.querySelector('#usetouchpad');
const touchpad = document.querySelector('#touchpad');
var left = document.querySelector('#left');
var right = document.querySelector('#right');

//game characters
var platform = document.querySelector('#platform');
var spikes = document.querySelector('#spikes');
var character = document.getElementById("character");
var characterRadius = parseInt(window.getComputedStyle(character).getPropertyValue("width"));
var game = document.getElementById("game");

//game variables
var gamewidth = parseInt(window.getComputedStyle(game).getPropertyValue("width"));
var interval;
var both = 0;
var counter=0;
var currentBlocks = [];
var speed = 0.5;
var score = 0;
var temp = 0;
var charSpeed = 2;
var over = false;
var blocks;
var holeWidth = 50;

function init(){
    counter = 0;
    currentBlocks = [];
    both = 0;
    speed = 0.5;
    score = 0;
    temp = 0;
    charSpeed = 2;
    over = false;
    blocks = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;  
}

//music set up
var music = new Audio("./audio/bgm.mp3");
music.addEventListener('ended', () => {
    this.currentTime = 0;
    this.play();
}, false); //music loop
var dropSound = new Sound('./audio/drop.mp3', 10, 1.0);
var gameoverSound = new Sound('./audio/gameover.mp3');

function moveLeft(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left > 0){
        character.style.left = left - charSpeed + "px";
    }
}
function moveRight(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left < (gamewidth - characterRadius)){
        character.style.left = left + charSpeed + "px";
    }
}

touchpad.addEventListener('mousedown', function(event) {    
    var posx = event.clientX;
    var posy = event.clientY;
    var ele = document.elementFromPoint(posx, posy);
    var id = ele.getAttribute("id");

    if(both == 0){
        both++;
        if(id == "left"){
            interval = setInterval(moveLeft,1);
        }
        if(id == "right"){
            interval = setInterval(moveRight,1);
        }
    }
});

addEventListener('mouseup', () => {
    clearInterval(interval);
    both = 0;
})

addEventListener('touchstart', function(event) {
    var touch = event.touches[0];
    var posx = touch.pageX;
    var posy = touch.pageY;
    var ele = document.elementFromPoint(posx, posy);
    var id = ele.getAttribute("id");
    
    if(both == 0){
        both++;
        if(id == "left"){
            interval = setInterval(moveLeft,1);
        }
        if(id == "right"){
            interval = setInterval(moveRight,1);
        }
    }
});

addEventListener('touchend', () => {
    clearInterval(interval);
    both = 0;
})

addEventListener('keydown', function (event) {
    if(both == 0){
        both++;
        if(event.key === "ArrowLeft"){
            interval = setInterval(moveLeft,1);
        }
        if(event.key === "ArrowRight"){
            interval = setInterval(moveRight,1);
        }
    }
});

addEventListener("keyup", () => {
    clearInterval(interval);
    both = 0;
});

//saving highscores
const SAVE_KEY_SCORE= "highscore"; //score key for local storage
var scoreHigh;
var scoreString = localStorage.getItem(SAVE_KEY_SCORE);
if(scoreString == null)
{
    scoreHigh = 100;
    highscoreEl.innerHTML = 100;
    bigHighScoreEl.innerHTML = 100;
}
else{
    scoreHigh = parseInt(scoreString);
    highscoreEl.innerHTML = parseInt(scoreString);
    bigHighScoreEl.innerHTML = parseInt(scoreString);
}

//game over 
function gameOver() {
    gameoverSound.play();
    character.style.display = 'none';
    spikes.style.visibility = 'hidden';
    platform.style.visibility = 'hidden';
    clearInterval(interval);
    both = 0;               
    charSpeed = 0;
    speed = 0;
    setTimeout(() => {
        music.pause();
        music.currentTime = 0;
        modalEl.style.display = 'flex';
        gameovertxt.style.display = 'block';
        bigScoreEl.style.display = 'block';
        textScoreEl.style.display = 'block';
        bigScoreEl.innerHTML = score;
        bigHighScoreEl.innerHTML = scoreHigh;
        startGameBtn.innerHTML = "R e s t a r t";
        title.style.display = 'none';
        instruction.style.display = 'none';
        instBtn.style.display = 'block';
        scoreDisplay.style.visibility = 'hidden';
        highscoreDisplay.style.visibility = 'hidden';
        if(score == scoreHigh){
            newHighScoreText.style.display = 'block';
        }
        clearInterval(blocks);

        var a;
        instBtn.addEventListener('click', () => {
            if(a == 1){
                gameovertxt.style.display = 'block';
                bigScoreEl.style.display = 'block';
                textScoreEl.style.display = 'block';
                title.style.display = 'none';
                instruction.style.display = 'none';
                instBtn.innerHTML = "I n s t r u c t i o n s";
                if(score == scoreHigh){
                    newHighScoreText.style.display = 'block';
                }
                return a = 0;
            }
            else{
                gameovertxt.style.display = 'none';
                newHighScoreText.style.display = 'none';
                bigScoreEl.style.display = 'none';
                textScoreEl.style.display = 'none';
                title.style.display = 'block';
                instruction.style.display = 'block';
                instBtn.innerHTML = "H i d e\xa0\xa0I n s t r u c t i o n s";
                return a = 1;
            }
        })
    }, 0);
}

function startGame(){
    blocks = setInterval(() => {
        var blockLast1 = document.getElementById("block1"+(counter-1));
        var blockLast2 = document.getElementById("block2"+(counter-1));
        var holeLast = document.getElementById("hole"+(counter-1));

        //getting previous blocks and holes position inorder to create new ones
        if(counter>0){
            var blockLastTop1 = parseInt(window.getComputedStyle(blockLast1).getPropertyValue("top"));
            var blockLastTop2 = parseInt(window.getComputedStyle(blockLast2).getPropertyValue("top"));
            var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
        }

        //creating new blocks and holes
        if(blockLastTop1 < 380 || counter==0){
            var block1 = document.createElement("div");
            var block2 = document.createElement("div");
            var hole = document.createElement("div");
            block1.setAttribute("class","block1");
            block2.setAttribute("class","block2");
            hole.setAttribute("class","hole");
            block1.setAttribute("id","block1"+counter);
            block2.setAttribute("id","block2"+counter);
            hole.setAttribute("id","hole"+counter);

            block1.style.top = blockLastTop1 + 100 + "px";
            block2.style.top = blockLastTop2 + 100 +  "px";
            hole.style.top = holeLastTop + 100 + "px";

            var random = (parseInt(Math.random() * (parseInt(gamewidth / 25) - 1))) * 25;
            hole.style.left = random + "px";
            hole.style.width = holeWidth + "px";

            block1.style.width = random + "px";
            block2.style.width = (gamewidth - (random + holeWidth)) + "px";
            block2.style.left = (parseInt(hole.style.left) + holeWidth) + "px";

            game.appendChild(block1);
            game.appendChild(block2);
            game.appendChild(hole);

            currentBlocks.push(counter);
            counter++;
        }

        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        var drop = 0;
        
        //Game over
        if(characterTop < 5){
            gameOver();
        }
        
        for(var i=0;i<currentBlocks.length;i++){
            let current = currentBlocks[i];        

            let iblock1 = document.getElementById("block1"+current);
            let iblock2 = document.getElementById("block2"+current);
            let ihole = document.getElementById("hole"+current);

            //getting the blocks and hole 's respective position
            let iblockTop1 = parseFloat(window.getComputedStyle(iblock1).getPropertyValue("top"));
            let iblockTop2 = parseFloat(window.getComputedStyle(iblock2).getPropertyValue("top"));
            let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));

            //updating the position of the blockes and hole
            iblock1.style.top = iblockTop1 - speed + "px";
            iblock2.style.top = iblockTop2 - speed + "px";
            ihole.style.top = iblockTop1 - speed + "px";

            //removing them from the screen
            if(iblockTop1 < -25 && iblockTop2 < -25)
            {
                currentBlocks.shift();
                iblock1.remove();
                iblock2.remove();
                ihole.remove();
            }
            
            //checks where the ball is on the block
            if(iblockTop1 - 20 < characterTop && iblockTop1 > characterTop && iblockTop2 - 20 < characterTop && iblockTop2 > characterTop){
                drop++;

                //how smoothly the ball will be dropped near the hole and checks whether the ball is on the hole
                if(iholeLeft <= characterLeft && iholeLeft + 40 >= characterLeft){
                    drop = 0;
                    var diff = Math.floor(parseInt(ihole.style.top) - speed) - (characterTop - charSpeed);
                    temp++;

                    if((diff <= (charSpeed + 1)) && (temp >= (7 - (charSpeed - 1)))){
                        score++;
                        scoreEl.innerHTML = score;
                        console.log(score);
                        console.log("high: "+scoreHigh);
                        if(score > scoreHigh)
                        {
                            scoreHigh = score;
                            localStorage.removeItem(SAVE_KEY_SCORE);
                            localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);                    
                        }
                        highscoreEl.innerHTML = scoreHigh;

                        temp = 0;
                        dropSound.play();
                        music.volume = 0.5;

                        for(var i=5; i<=score; i+=5){
                            if((score%5 == 0) && (score >= i) && (score < (i+5))){
                                speed = speed + 0.1;
                            }
                        }
                        if(score%50 == 0){
                            charSpeed++;
                        }
                    }
                    music.volume = 1.0;
                }
            }
            
            //slides the character on the blocks
            if(drop == 0){
                if(characterTop < 425){
                    character.style.top = characterTop + charSpeed + "px";
                }
            }

            //moves the character upwards
            else{
                temp=0;
                character.style.top = characterTop - speed + "px";
            }
        }
    }, 1);
    
}

function Sound(src, maxStreams = 1, vol = 1.0){
    this.volume = vol
    this.streamNum = 0;
    this.streams = [];
    for(var i = 0; i< maxStreams; i++) {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }

    this.play = function() {
        this.streamNum = (this.streamNum + 1) % maxStreams;
        this.streams[this.streamNum].play();
    }
}

//touchpad
var a;
usetouchpad.addEventListener('click', () => {
    if(a == 1){
        usetouchpad.innerHTML = "+ Use Touchpad";
        touchpad.style.visibility = 'hidden';
        return a = 0;
    }
    else{
        usetouchpad.innerHTML = "- Hide Touchpad";
        touchpad.style.visibility = 'visible';
        return a = 1;
    }
})

//start game from button
startGameBtn.addEventListener('click', () => {
    //restart
    if(startGameBtn.innerHTML == "R e s t a r t"){
        location.reload();
    }
    //remove and add some elements
    modalEl.style.display = 'none';
    scoreDisplay.style.visibility = 'visible';
    highscoreDisplay.style.visibility = 'visible';
    character.style.visibility = 'visible';
    spikes.style.visibility = 'visible';
    platform.style.visibility = 'visible';
    //start game
    music.play();
    init();
    startGame();    
})