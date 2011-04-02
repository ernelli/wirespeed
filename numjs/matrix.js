function isInteger(arg) {
    return (typeof arg === "number" && arg === Math.floor(arg));
}

function Matrix() {
    var n;

    this.elems = [];
    this.dim = []

    if(arguments.length > 0) {
	// create a NxN matrix with zeros
	if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	    this.dim[0] = this.dim[1] = arguments[0];
        }
    }

    this.toString = function() {
	var i, j, s, d, r, c, e;
	
	s = "";
	
	r = 1*this.dim[0];
	c = 1*this.dim[1];
	e = this.elems;

	print("r,c = " + r + ", " + c);

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
	return s;
    };

    
    this.get = function() {
	var i, e;
            
	if(arguments.length <= this.dim.length) {

	print("get from: " + arguments[0] + "," + arguments[1]);

	if(arguments.length == 2) {
            print("get from: " + this.elems);
	    return this.elems[arguments[0]-1][arguments[1]-1];
	} else {
	    e = this.elems;
	    for(i = 0; i < arguments.length; i++) {
                    e = e[arguments[i]];
	    }
	    return e;
	}
	}
    };
}


function Vector() {
    var n;
    
    if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	this.apply.Matrix(1,arguments[0]);	
    }
}


var A = new Matrix(3);
print(A);
A.elems = [ [1,2,3],[4,5,6], [7,8,9]];

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