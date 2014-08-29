/* The Black and Scholes (1973) Stock option formula */

function BlackScholes(PutCallFlag, S, X, T, r, v) {

	//console.log("debug:"+Math.log(S / X)+" 2:"+((r + v * v / 2.0) * T)+" 3:"+ (v * v / 2.0) +" 4:"+(r + v * v / 2.0));

	var d1, d2;
	d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
	d2 = d1 - v * Math.sqrt(T);

	var delta = CND(d1);
	var vega = S * Math.sqrt(T) * Nprime(d1) / 100;

	var theta = 0.0;
	var theroretical = 0.0;
	if (PutCallFlag== "c"){
		theroretical = S * CND(d1)-X * Math.exp(-r * T) * CND(d2);
		console.log("theta1:"+(S * v * Nprime(d1) / 2 / Math.sqrt(T))+" 2:"+(r * X * Math.exp(-r * T) * CND(d1 - v * Math.sqrt(T))));
		theta = -(S * v * Nprime(d1) / 2 / Math.sqrt(T) + r * X * Math.exp(-r * T) * CND(d1 - v * Math.sqrt(T))) / 365;
	}
	else{
		theroretical = X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);
		theta = -(S * v * Nprime(d1) / 2 / Math.sqrt(T) - r * X * Math.exp(-r * T) * CND(v * Math.sqrt(T) - d1)) / 365;
		delta -= 1;
	}

	return {
		theroretical: theroretical,
		delta: delta,
		vega: vega,
		theta: theta
	}

}

function Nprime(x){
	return Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI)
}

/* The cummulative Normal distribution function: */

function CND(x){

	var a1, a2, a3, a4 ,a5, k ;

	a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;

	if(x<0.0)
		return 1-CND(-x);
	else
		k = 1.0 / (1.0 + 0.2316419 * x);
	return 1.0 - Nprime(x) * k
	* (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;

}


function calc()
{
	var PutCallFlag = document.getElementById('d').value;;
	var S = parseFloat(document.getElementById('S').value);
	var X = parseFloat(document.getElementById('X').value);
	var T = parseFloat(document.getElementById('T').value);

	var r = parseFloat(document.getElementById('r').value);
	var v = parseFloat(document.getElementById('v').value);

	//course = Number(document.getElementById("course").value)
	//nrOfLessons = Number(document.getElementById("nrOfLessons").value)

	console.log("calc "+PutCallFlag+" "+S+" "+X+" "+T+" "+r+" "+v);
	result = BlackScholes(PutCallFlag,S,X,T,r,v);
	document.getElementById('Theoretical').innerHTML = result.theroretical.toFixed(4);
	document.getElementById('Delta').innerHTML = result.delta.toFixed(4);
	document.getElementById('Vega').innerHTML = result.vega.toFixed(4);
	document.getElementById('Theta').innerHTML = result.theta.toFixed(4);
	//document.getElementById('Theo').value = result;
}

document.getElementById('d').onchange = calc;
document.getElementById('S').onchange = calc;
document.getElementById('X').onchange = calc;
document.getElementById('T').onchange = calc;
document.getElementById('r').onchange = calc;
document.getElementById('v').onchange = calc;

calc();
