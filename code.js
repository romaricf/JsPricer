/* The Black and Scholes (1973) Stock option formula */

function BlackScholes(PutCallFlag, S, X, T, r, v) {

	//console.log("debug:"+Math.log(S / X)+" 2:"+((r + v * v / 2.0) * T)+" 3:"+ (v * v / 2.0) +" 4:"+(r + v * v / 2.0));

	var d1, d2;
	d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
	d2 = d1 - v * Math.sqrt(T);

	var delta = CND(d1);
	var vega = S * Math.sqrt(T) * Nprime(d1) / 100;
	var gamma = Nprime(d1) / S / v / Math.sqrt(T) / 100;
	var lambda = delta * S / X;

	var theta = 0.0;
	var theroretical = 0.0;
	if (PutCallFlag== "c"){
		theroretical = S * CND(d1)-X * Math.exp(-r * T) * CND(d2);
		//console.log("theta1:"+(S * v * Nprime(d1) / 2 / Math.sqrt(T))+" 2:"+(r * X * Math.exp(-r * T) * CND(d1 - v * Math.sqrt(T))));
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
		theta: theta,
		gamma: gamma,
		lambda: lambda
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

function ImpliedVolatility(PutCallFlag, S, X, T, r, p){

	var px = [];
	for(var i = 0;i<=1000;i++)
	{
		px[i] = BlackScholes(PutCallFlag, S, X, T, r, 0.001*i).theroretical;
		//console.log("vol "+i+":"+px[i]);
	}

	// Find the best:
	var bestU = 1000;
	var bestL = 0;
	for(var i = 1;i<=1000;i++)
	{
		if(px[i] > px[bestL] && px[i] <= p)
			bestL = i;
		if(px[i] < px[bestU] && px[i] >= p)
			bestU = i;
	}

	console.log("bestL "+bestL);
	console.log("bestU "+bestU);

	if(Math.abs(p - px[bestL]) <=  Math.abs(p - px[bestU]))
		return bestL/1000.0;
	else
		return bestU/1000.0;
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

	var result = BlackScholes(PutCallFlag,S,X,T,r,v);
	var impliedVol = ImpliedVolatility(PutCallFlag,S,X,T,r,result.theroretical);

	document.getElementById('Theoretical').innerHTML = result.theroretical.toFixed(4);
	document.getElementById('Delta').innerHTML = result.delta.toFixed(4);
	document.getElementById('Vega').innerHTML = result.vega.toFixed(4);
	document.getElementById('Theta').innerHTML = result.theta.toFixed(4);
	document.getElementById('Gamma').innerHTML = result.gamma.toFixed(4);
	document.getElementById('ImpliedVol').innerHTML = impliedVol.toFixed(3);
	document.getElementById('Lambda').innerHTML = result.lambda.toFixed(4);
	//document.getElementById('Theo').value = result;
}

function calcImpliedVol()
{
	var PutCallFlag = document.getElementById('vd').value;;
	var S = parseFloat(document.getElementById('vS').value);
	var X = parseFloat(document.getElementById('vX').value);
	var T = parseFloat(document.getElementById('vT').value);

	var r = parseFloat(document.getElementById('vr').value);
	var p = parseFloat(document.getElementById('vp').value);

	console.log("calcImpliedVol "+PutCallFlag+" "+S+" "+X+" "+T+" "+r+" "+p);

	//var result = BlackScholes(PutCallFlag,S,X,T,r,v);
	var impliedVol = ImpliedVolatility(PutCallFlag,S,X,T,r,p);

	document.getElementById('vImpliedVol').innerHTML = impliedVol.toFixed(3);
	//document.getElementById('Theo').value = result;
}

document.getElementById('d').onchange = calc;
document.getElementById('S').onchange = calc;
document.getElementById('X').onchange = calc;
document.getElementById('T').onchange = calc;
document.getElementById('r').onchange = calc;
document.getElementById('v').onchange = calc;

document.getElementById('vd').onchange = calcImpliedVol;
document.getElementById('vS').onchange = calcImpliedVol;
document.getElementById('vX').onchange = calcImpliedVol;
document.getElementById('vT').onchange = calcImpliedVol;
document.getElementById('vr').onchange = calcImpliedVol;
document.getElementById('vp').onchange = calcImpliedVol;

calc();
calcImpliedVol();
