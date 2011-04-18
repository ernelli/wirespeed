function isInteger(arg) {
    return (typeof arg === "number" && arg === Math.floor(arg));
}

function size(m) {
    return m.dim;
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

    if(!a.im.length && !a.im.length) {
	for(i = 0; i < r; i++) {
	    res.re[i] = [];
	    for(j = 0; j < c; j++) {
		s = 0;

		for(n = 0; n < N; n++) {
		    if(a.re[i][n] && b.re[n][j]) {
			s += a.re[i][n] * b.re[n][j];
		    }
		}
		res.re[i].push(s);
	    }
	}

    } else {
	throw new("mul failed, complex matrixes not supported");
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
	var i, e, re, im;
            
	if(arguments.length <= this.dim.length) {
	    print("get from: " + arguments[0] + "," + arguments[1]);
	    
	    if(arguments.length == 2) {
		print("get from: " + this.re);
		re = this.re[arguments[0]-1][arguments[1]-1];
		im = this.im[arguments[0]-1][arguments[1]-1];
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
    };
}


function Vector() {
    var n;
    
    if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	Matrix.call(this, 1,arguments[0]);	
    }
}


var A = new Matrix(3);
print(A);
A.re = [ [1,2,3],[4,5,6], [7,8,9]];
//C.im = [ [], [1, 0, -1] ];
print(A);

B = new Vector(3);
B.re = [[1, 2, 3]];

C = new Matrix(3,1);
C.re = [ [1], [2], [3] ];

var M = function(m) {
    return function(r,c) {
	if(arguments.length == 0) {
	    return m;
	}

	print("process\n" + m);
	return m.get(r,c);
    };
}(A);

M.toString = function() { return M().toString.apply(M()); };