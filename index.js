const RunButton = document.querySelectorAll("#run-button input");
const LastBall = document.querySelector("#last-balls");
const PlayerScore = document.querySelector("input#player");
const ComputerScore = document.querySelector("input#computer");
const runWicket = document.querySelector("#run-wicket");
const needOff = document.querySelector("#need-off");
const overs = document.querySelector("#overs");
const target = document.querySelector("#target");
const pause = document.querySelector(".pause");
const difficultyBtns = document.querySelectorAll(".instructions input");

var Target;
var MaxOver = 5;
var MaxWicket = MaxOver;
var Score = 0;
var Wicket = 0;
var Balls = 0;
var Over = 0.0;
var LastButton = [];
var DisableButton = [];
var Timeline = "";
var Difficulty = "";

window.addEventListener("DOMContentLoaded", ()=>{
    difficultyBtns.forEach(Button=>{
        Button.addEventListener("click", ()=>{
            Difficulty = Button.value;
            Button.parentElement.classList.add('hidden');
            Target = getTarget();
            start();
            changeScore();
        })
    })
});

function start(){
    for (let i = 0; i < RunButton.length; i++) {
        RunButton[i].onclick = ()=> {
            var random = Math.floor(Math.random() * 6) + 1;
            for (let i = 0; i < DisableButton.length; i++) {
                while (DisableButton[i].value == random && DisableButton.length < RunButton.length) {
                    random = Math.floor(Math.random() * 6) + 1;
                };
            };
            ComputerScore.value = random;
            PlayerScore.value = parseInt(RunButton[i].value);
            Balls++;
            Over += 0.1;
    
            LastButton.push(RunButton[i]);
            updateLastBall(RunButton[i]);
            removeFocus(i);
            disableButton();
            matchResult();
            changeScore();
        };
    };
};

function updateLastBall(Button) {
    if (PlayerScore.value == ComputerScore.value) {
        Wicket++;
        Timeline += '<span class="wicket">W</span>';
    } else {
        Score += parseInt(Button.value);
        Timeline += `<span>${PlayerScore.value}</span>`;
    };
    LastBall.innerHTML = Timeline;
    if ((Balls) % 6 === 0) {
        Over += 0.4;
        Timeline = "";
    };
};

function matchResult() { 
    if ((Over >= MaxOver || Wicket >= MaxWicket) && (Score <= Target)) {
        result("Defeat", `You Lose by ${Target - Score} runs`);
    };
    if (Score >= Target) {
        result("Victory", `You Won by ${MaxWicket - Wicket} wickets`);
    };
    if (Score == Target - 1 && Over == MaxOver) {
        result("Draw", "Its a Draw Scores are leveled");
    };
};

function changeScore() {
    needOff.innerHTML = `Needed ${(Target - Score)} off ${((MaxOver * 6) - Balls)}`;
    target.innerHTML = `Target : ${Target}`;
    runWicket.innerHTML = `${Score} / ${Wicket}`;
    overs.innerHTML = `${Over.toFixed(1)} / ${MaxOver}`;
};

function disableButton() {
    for (let i = 0; i < LastButton.length; i++) {
        if (LastButton[i] == LastButton[i - 1] && LastButton[i - 1] == LastButton[i + 1]) {
            DisableButton.push(LastButton[i]);
            LastButton = [];
        };
    };
    for (let j = 0; j < DisableButton.length; j++) {
        DisableButton[j].setAttribute("disabled", "disabled");
        DisableButton[j].classList.add("inactive");
        if (DisableButton.length >= RunButton.length) {
            RunButton[0].removeAttribute("disabled");
            RunButton[0].classList.remove("inactive");
        };
    };
};

function Reset() {
    Score = 0;
    Wicket = 0;
    Balls = 0;
    Over = 0.0;
    Target = getTarget();
    LastBall.innerHTML = "";
    Timeline = "";
    DisableButton = [];
    LastButton = [];
    for (let i = 0; i < RunButton.length; i++) {
        RunButton[i].removeAttribute("disabled");
        RunButton[i].classList.remove("inactive", "focus");
    };
    LastButton = [];
    changeScore();
};

pause.addEventListener("click", function () {
    result("Pause", `You Need ${(Target - Score)} Runs off ${((MaxOver * 6) - Balls)} Balls`);
});

function result(event, margin) {
    const container = document.querySelector(".result");
    const Resume = container.querySelector("input[value='Resume']");
    const Replay = container.querySelector("input[value='Replay']");
    const Home = container.querySelector("input[value='Home']");
    const Heading = container.querySelector(".event");
    const Margin = container.querySelector(".margin");

    container.classList.remove("Draw", "Defeat", "Victory");
    container.classList.add("active", event);
    Heading.innerText = event;
    Margin.innerText = margin;

    Home.addEventListener("click", function () {
        Reset();
        document.querySelector(".instructions").classList.remove("hidden");
        container.classList.remove("active", event);
    });
    Resume.addEventListener("click", function () {
        container.classList.remove("active", event);
    });
    Replay.addEventListener("click", function () {
        Reset();
        container.classList.remove("active", event);
    });

    if (event != "Pause") {
        Resume.style.display = "none";
        Reset();
    } else {
        Resume.style.display = "block";
    };
};

function getTarget(){
    var randomTarget;
    switch (Difficulty) {
        case "Easy":
            randomTarget = Math.floor((Math.random() * 30) + 30);
            break;
        case "Moderate":
            randomTarget = Math.floor((Math.random() * 30) + 50);
            break;
        case "Hard":
            randomTarget = Math.floor((Math.random() * 20) + 100);
            break;
    }
    return randomTarget;
}

function removeFocus(index){
    for (let i = 0; i < RunButton.length; i++) {
        if (i == index) {
            RunButton[i].classList.add("focus");
        }else{
            RunButton[i].classList.remove("focus");
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5" || e.key == "6") {
        RunButton[parseInt(e.key) - 1].click();
        removeFocus((e.key) - 1);
    }
    if (e.keyCode == 32) {
        pause.click();
    }
});