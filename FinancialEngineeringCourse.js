
// should return C0=2.76
// OnePeriodBinomialPricingCall(1.01, 1.07, 1/1.07, 100, 102);

function OnePeriodBinomialPricingCall(R, u, d, S0, K) {

    var q = (R-d)/(u-d);

    var Cu = Math.max(u * S0 - K, 0);
    var Cd = Math.max(1/u * S0 - K, 0);

    var C0 = 1/R * (q*Cu + (1-q)*Cd);

	console.log("debug: C0:"+C0+ " q:"+q);

	return {
		C0: C0,
		q: q
	}
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

// should return C0=?
MultiPeriodBinomialPricingCall(1.01, 1.07, 1/1.07, 100, 100, 3);

// For European Call Options
function MultiPeriodBinomialPricingCall(R, u, d, S0, K, n) {

    N = n+1; // number of cashflow elements is n+1
    var q = (R-d)/(u-d);
    var Sn = [];
    var Cn = [];
    var Q = [];

    for (var i = 0; i <= N; i++) {
        var r = N-i;
        Sn[i] = S0 * Math.pow(u,r) * Math.pow(d,N-r);
        Cn[i] = Math.max(Sn[i] - K, 0);
        Q[i] = Combination(N, i) * Math.pow(q,r) * Math.pow(1-q,N-r);
    }

    var C0 = 0;
    for (var i = 0; i <= N; i++) {
        C0 += Q[i] * Cn[i];
    }
    
    C0 = C0/Math.pow(R,n);

	console.log("debug: C0:"+C0+ " q:"+q);

	return {
		C0: C0,
		q: q
	}
}