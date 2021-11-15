class User {
    balance = 10000;
    round = new GameRound();
}

class GameRound {
    low = 0;
    high = 0;
    red = 0;
    black = 0;
    king = 0;
    ace = 0;
    green = 0;

    placeBet(amount, id) {
        if ( id == "bet-low" ) this.low += amount;
        if ( id == "bet-high" ) this.high += amount;
        if ( id == "bet-red" ) this.red += amount;
        if ( id == "bet-black" ) this.black += amount;
        if ( id == "bet-king" ) this.king += amount;
        if ( id == "bet-ace" ) this.ace += amount;
        if ( id == "bet-joker" ) this.green += amount;
    }
}

const user = new User();
const balance_display = document.getElementById("balance");
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const bet_input = document.getElementById("bet-input");
const bet_panel = document.getElementById("button-panel-inner");
const game_info = document.getElementById("game-info");
const history_display = document.getElementById("history-display-inner");
const result_display = document.getElementById("game-display");
const results = [
    '0','2','2','3','3',
    '4','4','5','5','6',
    '6','7','7','8','8',
    '9','9','J','J','Q',
    'Q','K','K','A','A'
]
function onButtonClick(e) {

    let bet = bet_input.value;
    if (e.id=="control-max") {
        bet=roundToTwo(user.balance);
        bet_input.value = bet;
        return;
    }
    bet = isNaN(bet)||bet=="" ? 0 : parseFloat(bet);
    if (e.id.startsWith("bet")) {
        if (bet_panel.classList.contains("disabled")) return;
        if (bet > user.balance) {
            alert("Bet too large! Insufficent Balance!");
            return;
        }
        if (bet==0) return;
        user.round.placeBet(bet, e.id);
        let line = document.createElement("p");
        line.innerText = formatter.format(bet) + " " + e.id;
        history_display.appendChild(line);
        user.balance -= bet;
        balance_display.innerText = formatter.format(user.balance);
    } else {
        if (e.id=="control-double") bet*=2;
        if (e.id=="control-half") bet/=2;
        if (e.id=="control-triple") bet*=3;
        bet = roundToTwo(bet);
        bet_input.value = bet;
    }
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function sayTime(time) {
    if (time == 0) {
        countEnd();
        return;
    }
    if (time % 100 ==0)
    game_info.innerText = "Next Round " + (time/100);
    time--;
    setTimeout(sayTime, 10, time);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function countEnd() {
    game_info.innerText = "Good Luck!"
    bet_panel.classList.add("disabled");
    const result = getRandomInt(25);
    if (result == 0) {
        result_display.innerText = "JOKER";
        result_display.style.fontSize = "50pt";
        result_display.style.color = "green";
    } else {
        result_display.innerText = results[result];
        result_display.style.color = (result & 1) === 0 ? "red" : "black";
        result_display.style.fontSize = "100pt";
    }
    payout(result);
}

function payout(result) {
    if (result == 0) user.balance+=user.round.green*24;
    else {
        if (result < 17) {
            user.balance+=user.round.low*1.5;
        } else {
            user.balance+=user.round.high*3;
            if (result >= 23) user.balance+=user.round.ace*12;
            if (result >= 21) user.balance+=user.round.king*6;
        }
        if ((result & 1) === 0) user.balance+=user.round.red*2;
        else user.balance+=user.round.black*2;
    }
    balance_display.innerText = formatter.format(user.balance);
    user.round = new GameRound();
    setTimeout(reset, 5000);
}

function reset() {
    history_display.innerHTML = "";
    bet_panel.classList.remove("disabled");
    sayTime(1000);
}

(function startup() {
    balance_display.innerText = formatter.format(user.balance);
    reset();
})();

window.onload = function() {
    const buttons = document.getElementsByClassName("button");
    for (const btn of buttons) {
        btn.addEventListener('click', function(e) {
            onButtonClick(btn);  
        });
    }

    bet_input.addEventListener('keypress', function (e) {
        const key = e.key;
        if ((isNaN(key) && key !=".")||key==" ") e.preventDefault();
    });
    let currentValue = bet_input.value || '';
    let selection = {};
    bet_input.addEventListener('keydown', function (e) {
        const target = e.target;
        selection = {
            selectionStart: target.selectionStart,
            selectionEnd: target.selectionEnd,
        };
    });
    bet_input.addEventListener('input', function (e) {
        const target = e.target;
        const key = target.value;
        if (!(isNaN(key) && key !=".")||key==" ") currentValue = key;
        else {
            target.value = currentValue;
            target.setSelectionRange(selection.selectionStart, selection.selectionEnd);
        }
        if (!target.value.endsWith(".")) {
            if (target.value!="")
            target.value = roundToTwo(target.value);
        }
    });
};