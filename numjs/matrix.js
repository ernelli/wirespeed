function isInteger(arg) {
    return (typeof arg === "number" && arg === Math.floor(arg));
}

function mul(a, b) {
    var res;
    // A r,c x r,c
    if(a.dim[1] !== b.dim[0]) {
	throw new("operator *: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
    }
    res = new Matrix(a.dim[0], b.dim[1]);

    return res;
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
		    re = re ? re[arguments[i]] : 0;
		    im = im ? im[arguments[i]] : 0;
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
A.im = [ [], [1, 0, -1] ];
print(A);

B = new Vector(3);
B.re = [[1, 2, 3]];

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