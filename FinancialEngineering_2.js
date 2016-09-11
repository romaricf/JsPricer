var result = DiceGame(10);
console.log("debug: result:"+result);

// Dice game pricing
function DiceGame(n) {
    if(n==1) return 3.5;
    
    var previous = DiceGame(n-1);
    var ceil = Math.ceil(previous);
    var count = 7 - ceil;
    
    var proba = 0;
    for (var i = 1; i <= count; i++) {
        proba += (7-i)/6;  
    }
    var total = proba+previous*(6-count)/6;
    console.log("n:"+n+" count:"+count+" total:"+total);
    return total;
}