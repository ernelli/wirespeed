function isInteger(arg) {
    return (typeof arg === "number" && arg === Math.floor(arg));
}

function toNumber(arg) {
    if(typeof arg === "undefined") {
	print("undefined toNumber: " + (arg ? arg : 0));
    }

    if(arg) {
	return arg;
    } else {
	return 0;
    }
}


function size(m) {
    return m.dim;
}

function formatScalar(s) {
    var res;

    if(typeof s === "number") {
	return "" + s;
    } else if(typeof s === "undefined") {
	return "?";
    } else {
	if(s.length === 2) {
	    if(s[0] >= 0) {
		res = " " + s[0];
	    } else {
		res = "" + s[0];
	    }
	    
	    if(s[1] > 0) {
		res += " + " + s[1] + "i";
	    } else if(s[1] < 0) {
		res += " - " + (-s[1]) + "i";
	    }
	    return res;
	}
	throw new("Error formatScalar, " + s + ", is not a scalar");
    }
}

function s_add(a,b) {
    /*
    var res;
    if(typeof a === "number" && typeof b === "number") {
	return a+b;
    } else {
	res = [ a[0]?a[0]:0+b[0]?b[0]:0, a[1]?a[1]:0+b[1]?b[1]:0 ];
	if(res[1]) {
	    return res;
	} else {
	    return res[0];
	}
    }
    */
    if(typeof a === "number") {
	if(typeof b === "number") {
	    return a+b;
	} else {
	    return [ a+(b[0]?b[0]:0), b[1]?b[1]:0 ];
	}
    } else {
	if(typeof b === "number") {
	    return [ b+(a[0]?a[0]:0), a[1]?a[1]:0];
	} else {
	    print("s_add: " + formatScalar(a) + " + " + formatScalar(b) );
	    return [ (a[0]?a[0]:0)+(b[0]?b[0]:0), (a[1]?a[1]:0)+(b[1]?b[1]:0) ];
	}
    }

}

// multiply two scalars, real or complex
function s_mul(a, b) {
    var a0, a1, b0, b1;
    print("s_mul: " + a + " with " + b);
    print("s_mul: " + formatScalar(a) + " * " + formatScalar(b) );
    if(typeof a === "number") {
	if(typeof b === "number") {
	    return a*b;
	} else {
	    return [ a*(b[0]?b[0]:0), a*(b[1]?b[1]:0) ];
	}
    } else {
	if(typeof b === "number") {
	    return [ b*(a[0]?a[0]:0), b*(a[1]?a[1]:0) ];
	} else {
	    a0 = a[0]?a[0]:0;
	    a1 = a[1]?a[1]:0;
	    b0 = b[0]?b[0]:0;
	    b1 = b[1]?b[1]:0;
	    return [ a0*b0 - a1*b1, a1*b0 + a0*b1 ];
	}
    }
}

var old_mul = s_mul;
s_mul = function(a,b) {
    var res = old_mul(a,b);
    
    print("result " + formatScalar(res));

    return res;
}

// divide two scalars, real or complex
function s_div(a,b) {
    var c;
    if(typeof a === "number") {
	if(typeof b === "number") {
	    return a/b;
	} else {
	    //  a * 1/z = a * conj(z)/(z*conj(z)
	    c = a/(b[0]*b[0] + b[1]*b[1]);
	    return [ c*b[0], -c*b[1] ];
	}
    } else {
	if(typeof b === "number") {
	    // easy case z / b
	    return [ a[0]/b, a[1]/b ];
	} else {
	    // z/z = ( a * conj(b) ) / (b * conj(b))
	    c = b[0]*b[0] + b[1]*b[1];
	    return [ (a[0]*b[0] + a[1]*b[1])/c, (a[1]*b[0] - a[0]*b[1])/c ];
	}
    }    
}

// Multiplies a with b, returns result in new matrix
function m_mul(a, b) {
    var res, i, j, r, c, s, n, N;
    // A r,c x r,c
    if(a.dim[1] !== b.dim[0]) {
	throw new("operator *: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
    }
    
    N = a.dim[1];

    r = a.dim[0];
    c = b.dim[1];

    print("result size: " + r + ", " + c);

    res = new Matrix(r, c);

    // 3x1 * 1x3

    // 1x3 * 3x1

    // matrix is real
    if(!a.im.length && !b.im.length) {
	for(i = 0; i < r; i++) {
	    res.re[i] = [];
	    for(j = 0; j < c; j++) {
		s = 0;
		if (a.re[i]) {
		    for(n = 0; n < N; n++) {
			if(a.re[i][n] && b.re[n] && b.re[n][j]) {
			    s += a.re[i][n] * b.re[n][j];
			}
		    }
		}
		res.re[i].push(s);
	    }
	}
    } else {
	for(i = 0; i < r; i++) {
	    res.re[i] = [];
	    res.im[i] = [];

	    for(j = 0; j < c; j++) {
		s = [0,0];
		
		if(a.re[i] && a.im[i]) {
		    for(n = 0; n < N; n++) {
			print("hard mul/add");
			s = s_add(s,s_mul( [a.re[i][n], a.im[i][n]], [ b.re[n] && b.re[n][j], b.im[n] && b.im[n][j] ]));
		    } 
		} else {
		    for(n = 0; n < N; n++) {
			print("safe mul/add");
			s = s_add(s,s_mul( [a.re[i] && a.re[i][n], a.im[i] && a.im[i][n] ], 
					   [b.re[n] && b.re[n][j], b.im[n] && b.im[n][j] ]));
		    }

		}
		res.re[i].push(s[0]);
		res.im[i].push(s[1]);
	    }
	}

    }

    return res;
}

// add b to a, return a
function m_add(a,b) {
    var i, j, J, n, s, t;

    if(a.dim.length === b.dim.length) {

	i = [];
	
	for(n = 0; n < a.dim.length; n++) {
	    if( a.dim[n] !== b.dim[n] ) {
		break;
	    }
	    i[n] = 1;
	}
	// dimensions agree

	var num = 0;

	if(n === a.dim.length) {
	    i.pop(); // remove last index
	    J = a.dim[a.dim.length-1];
	    
	    do {
		
		s = a.get.apply(a,i);
		t = b.get.apply(b,i);

		print("iteration ", num++);
		print("index ", i);
		print("add: " + t + " to " + s);

		if(num > 10) {
		    return a;
		}
		
		for(j = 0; j < J; j++) {
		    if(t[j]) {
			if(s[j]) {
			    s[j] += t[j];
			} else {
			    s[j] = t[j];
			}
		    }
		}

		n = i.length-1;
		while(n >= 0) {
		    if(i[n] < a.dim[n]) {
			i[n]++;
			break;
		    } else {
			i[n] = 1;
			n--;
		    }
		}
	    } while(n >= 0);
	    return a;
	}
    }

    throw new("operator +: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
}

function Matrix() {
    var n, i;

    this.re = [];
    this.im = [];
    this.dim = []

    if(arguments.length > 0) {
	// create a NxN matrix with zeros
	if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	    this.dim[0] = this.dim[1] = arguments[0];
        } else {
	    this.dim = Array.prototype.slice.call(arguments);
	}
    }

    this.toString = function() {
	var i, j, s, d, r, c, e, re, im;
	
	s = "";
	
	r = 1*this.dim[0];
	c = 1*this.dim[1];

	print("r,c = " + r + ", " + c);

	if(this.re.length > 0) {
	    if(this.im.length === 0) {
		e = this.re;
		for(i = 0; i < r; i++) {
		    for(j = 0; j < c; j++) {
			if(e[i] && (d = e[i][j])) {
			    s+= d + "\t";
			} else {
			    s+= "0\t";
			}
		    }
		    s+= "\n";
		}
	    } else {
		re = this.re;
		im = this.im;
		for(i = 0; i < r; i++) {
		    for(j = 0; j < c; j++) {
			if(re[i] && (d=re[i][j])) {
			    s+= d;
			} else {
			    s+= "0";
			}
			
			if(im[i] && (d=im[i][j])) {
			    if(d < 0) {
				s+= " - " + (-d) + "i\t";
			    } else {
				s+= " + " + d + "i\t";
			    }
			} else {
			    s+= " + 0i\t";
			}
		    }
		    s+= "\n";
		}
	    }
	} else if(this.im.length > 0) {
	    e = this.im;
	    for(i = 0; i < r; i++) {
		for(j = 0; j < c; j++) {
		    if(e[i] && (d = e[i][j])) {
			s+= d + "i\t";
		    } else {
			s+= "0\t";
		    }
		}
		s+= "\n";
	    }
	};
	return s;
    }
    
    this.get = function() {
	var i, e, re, im, res;
            
	if(arguments.length <= this.dim.length) {
	    print("get from: " + arguments[0] + "," + arguments[1]);
	    
	    if(arguments.length === 2) {
		print("get from: " + this.re);
		if( re = this.re[arguments[0]-1]) {
		    re = re[arguments[1]-1];
		}
		if( im = this.im[arguments[0]-1] ) {
		    im = im[arguments[1]-1];
		}
	    } else {
		re = this.re;
		im = this.im;
		for(i = 0; i < arguments.length; i++) {
		    re = re ? re[arguments[i]-1] : 0;
		    im = im ? im[arguments[i]-1] : 0;
		}
	    }
	    
	    if(im) {
		return [re, im];
	    } else {
		return re;
	    }
	}
	throw new("error: * : Index exceeds matrix dimension.");
    };
}


function Vector() {
    var n;
    
    if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	Matrix.call(this, 1,arguments[0]);	
    }
}


