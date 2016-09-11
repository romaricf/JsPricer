
var n = 10;

var T = 0.25;
var S0 = 100;
var r = 0.02;
var Vol = 0.3;
var c = 0.01;
var strike = 100;

var u = BlackScholesBinomialCalibration(T, n, Vol);
console.log("u: "+u);

var price = MultiPeriodBinomialPricingCall(r, u, 1/u, S0, strike, n, c, T, 1);
console.log("price: "+price);

// For European Call Options
function MultiPeriodBinomialPricingCall(R, u, d, S0, K, n, c, T, CallPut) {
		N = n+1; // number of cashflow elements is n+1

		console.log("debug: "+R );
    //var q = (r - c - d) / (u-d);
    var q = (Math.exp( (R-c)*T/n ) - d) / (u-d);
    
    var Sn = [];
    var Cn = [];
    var Q = [];

    for (var i = 0; i <= N; i++) {
        var r = N-i;
        Sn[i] = S0 * Math.pow(u,r) * Math.pow(d,N-r);
        Cn[i] = Math.max(CallPut*(Sn[i] - K), 0);
        Q[i] = Combination(N, i) * Math.pow(q,r) * Math.pow(1-q,N-r);
    }

    var C0 = 0;
    for (var i = 0; i <= N; i++) {
        C0 += Q[i] * Cn[i];
    }
    
    C0 = C0/Math.pow(1+R,n);

	console.log("debug: C0:"+C0+ " q:"+q);

	return {
		C0: C0,
		q: q
	}
}


// should return u=1.0395....
//var u = BlackScholesBinomialCalibration(0.25, 15, 0.3);
//console.log("u: "+u);

function BlackScholesBinomialCalibration(T, n, Vol)
{
    return Math.exp(Vol * Math.sqrt(T/n));
}

function Factorial(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function Combination(n, k)
{
    return Factorial(n)/Factorial(k)/Factorial(n-k);
}