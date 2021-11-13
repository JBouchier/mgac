const balance_display = document.getElementById("balance");

let balance = 1000.00;
let lastRes = "", lastCol="";
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

(function updateBalance() {
    balance_display.innerText = formatter.format(balance);
})();

let low=0,high=0,red=0,black=0,king=0,ace=0,joker=0;

function onButtonClick(button) {
    addBet(parseFloat(document.getElementById("bet-amount").value), button.id)
    document.getElementById("progress").classList.add("translate");
}

const w = document.getElementById('rotate'), d=document.getElementById('displayer');
const c = [
    '0','K','3','J','7',
    '8','9','6','Q','4',
    'A','2','5','3','K',
    '5','J','7','8','9',
    '6','Q','4','A','2'
], v = 13;
let ca = 0, cv = 0, cd = false;

(function start() {
    setTimeout(spin, 1);
})();

function spin() {
    spinToNumber(Math.floor(Math.random()*25));
}

function spinToNumber(index) {
    if (cd) console.log("Please wait for wheel to stop!");
    else {
        d.style.color = "purple";
        d.innerText="Spinning...";
        //d.innerText=c[index];
        cd=true;
        w.classList.remove('notransition');
        ca = 1440 + (index * 14.4);
        cv = Math.random() * v;
        w.style.transform = "rotate(" + (ca - (v/2) + cv) + "deg)";
        setTimeout(flatten, 7000, index);
        console.log("Spinning...");
    }
}

function read(index) {
    return index === 0 ? "green" : (index %2 !==0 ) ? "black" : "red";
}

function flatten(index) {
    ca = ca % 360;
    w.classList.add('notransition');
    w.style.transform = "rotate(" + (ca - (v/2) + cv) + "deg)";
    lastCol = read(index);
    d.style.color = lastCol;
    lastRes = c[index];
    d.innerText=lastRes;
    console.log("Landed on " + read(index) + " " + c[index]);
    setTimeout(startCountDown, 3000);
}

function addBet(amount,tag) {
    if (!cd) {
        if (amount > balance) {
            alert("Bet Failed! Balance too low!");
            return;
        }
        let line = document.createElement("p");
        line.classList.add("flex");
        line.innerText = formatter.format(amount) + " " + tag;
        document.getElementById("history-display-inner").appendChild(line);
        balance -= amount;
        if (tag=="bet-red") red+=amount;
        if (tag=="bet-black") black+=amount;
        if (tag=="bet-low") low+=amount;
        if (tag=="bet-high") high+=amount;
        if (tag=="bet-king") king+=amount;
        if (tag=="bet-ace") ace+=amount;
        if (tag=="bet-joker") joker+=amount;
        balance_display.innerText = formatter.format(balance);
    }
}

function clearBets() {
    document.getElementById("history-display-inner").innerHTML="";
    low=0;high=0;red=0;black=0;king=0;ace=0;joker=0;
}

function payout() {
    if (lastCol=="joker") {
        balance+=24*joker;
        return;
    }
    if (lastCol=="red")
    balance+=2*red;
    if (lastCol=="black")
    balance+=2*black;

    if (!isNaN(lastRes)) {
        balance+=1.5*low;
    } else {    
        if (lastRes=="J" || lastRes=="Q" || lastRes=="K" || lastRes=="A") balance+=3*high;
        if (lastRes=="K" || lastRes=="A") balance+=6*king;
        if (lastRes=="A") balance+=12*ace;    
    }
    balance_display.innerText = formatter.format(balance);
}

function startCountDown() {
    //document.getElementById("progress").classList.remove("translate");
    payout();
    clearBets();
    cd = false;
    d.innerText="Spinning in 15s";
    setTimeout(spin, 15000);
}