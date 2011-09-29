var enableDebug;

if(enableDebug) {
    function debug(str) {
	print(str);
    }

} else {
    function debug() {
    }
}

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

function whos() {
  var i;
  for(i in this) { 
    if(this[i] instanceof Matrix) {
        print( "" + i + "\t" + size(this[i]) ); 
    }
  }
}

// scalar functions

function size(m) {
    var s = m.dim.slice(0);
    s.toString = function() {
      return "" + s.join("x");
    };
    return s;
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

// test

function equal_s(a,b) {
    if(typeof a === "number") {
	if(typeof b === "number") {
	    return a===b;
	} else {
	    return (a === b[0] && b[1] === 0);
	}
    } else {
	if(typeof b === "number") {
	    return (a[0] === b && a[1] === 0);
	} else {
	    return a[0] === b[0] && a[1] === b[1];
	}
    }    
}


// Add two scalars return new scalar
function add_s(a,b) {

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
//	    debug("add_s: " + formatScalar(a) + " + " + formatScalar(b) );
	    return [ (a[0]?a[0]:0)+(b[0]?b[0]:0), (a[1]?a[1]:0)+(b[1]?b[1]:0) ];
	}
    }

}

// multiply two scalars, real or complex
function mul_s(a, b) {
    var a0, a1, b0, b1;
    debug("mul_s: " + a + " with " + b);
    debug("mul_s: " + formatScalar(a) + " * " + formatScalar(b) );
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

// divide two scalars, real or complex
function div_s(a,b) {
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

// vector-scalar functions

// v = [ re[], im[] ]
// s = number | [ re, im ]

// add scalar to vector, note N indicates size of vector if vector is sparse
function add_v_s(v, s, N) {
    var n, re, im, s0, s1;
    
    if(typeof s === "number") {
	s0 = s;
	s1 = 0;
    } else {
	s0 = s[0] ? s[0] : 0;
	s1 = s[1] ? s[1] : 0;
    }

    // N not given, vector is not sparse
    if (!N) {
	N = v[0].length;
    }

    // Process real part of vector
    if(s0) {
	if(!v[0]) {
	    re = [];
	    v[0] = re;
	    for(n = 0; n < N; n++) {
		re[n] = s0;
	    }
	} else {
	    re = v[0];
	    for(n = 0; n < N; n++) {
		re[n] = re[n] ? re[n] + s0 : s0;
	    }
	}
    }

    // Process imaginary vector
    if(s1) {
	if(!v[1]) {
	    im = [];
	    v[1] = im;
	    for(n = 0; n < N; n++) {
		im[n] = s1;
	    }
	} else {
	    im = v[1];
	    for(n = 0; n < N; n++) {
		im[n] = im[n] ? im[n] + s1 : s1;
	    }
	}
    }

    return v;
}

// multiply vector with scalar
function mul_v_s(v, s) {
    var n, N, re, im, s0, s1, v0, v1;

    if(typeof s === "number") {
	s0 = s;
	s1 = 0;
    } else {
	s0 = s[0] ? s[0] : 0;
	s1 = s[1] ? s[1] : 0;
    }

    if (v[1] && v[1].length > 0) { // vector has both real and imaginary parts
	if(v[0]) {
	    re = v[0];
	} else {
	    re = [];
	    v[0] = re;
	}

	im = v[1];

	N = Math.max(re.length, im.length);
	for(n = 0; n < N; n++) {
	    v0 = re[n] ? re[n] : 0;
	    v1 = im[n] ? im[n] : 0;

	    re[n] =  v0*s0 - v1*s1;
	    im[n] =  v1*s0 + v0*s1;
	}
    } else {
	// vector has only real entries
	if(v[0]) {
	    N = v[0].length;
	    re = v[0];

	    // check if complex scalar
	    if(s1) {
		for(n = 0; n < N; n++) {
		    im[n] = re[n] *s1;
		    re[n] *= s0;
		}		
	    } else {
		for(n = 0; n < N; n++) {
		    re[n] *= s0;
		}
	    }
	}
    }
    return v;
}
// vector-vector ops
function clone_v(v) {
    var res, re;
    if(v[0] && v[0].length  && v[1] && v[1].length) {
	res = [ v[0].slice(0), v[1].slice(0)];
    } else if(v[0] && v[0].length) {
	res = [ v[0].slice(0) ];
    } else if(v[1] && v[1].length) {
	re = [];
	v[1].forEach(function(v,i) { re[i] = 0; } );
	res = [ re, v[1].slice(0) ];
    } else {
	res = [[]];
    }
    return res;
}
// returns true if both vectors are equal
function equal_v(a,b) {
  var v0, v1, n, N;
    
  // check real
  if(a[0] || b[0]) {
      v0 = a[0] ? a[0] : [];
      v1 = b[0] ? b[0] : [];

      N = Math.max(v0.length, v1.length);
      for(n = 0; n < N; n++) {
	  if(v0[n] && v1[n] && v0[n] !== v1[n]) {
	      return false;
	  }
	  if(v0[n] && !v1[n] || !v0[n] && v1[n]) {
	      return false;
	  }
      }
  }  

  if(a[1] || b[1]) {
      v0 = a[1] ? a[1] : [];
      v1 = b[1] ? b[1] : [];

      N = Math.max(v0.length, v1.length);
      for(n = 0; n < N; n++) {
	  if(v0[n] && v1[n] && v0[n] !== v1[n]) {
	      return false;
	  }
	  if(v0[n] && !v1[n] || !v0[n] && v1[n]) {
	      return false;
	  }
      }
  }  


  return true;

  /* forEach might not work for array comparision
  if(a[0] || b[0]) {
      v0 = a[0] ? a[0] : [];
      v1 = b[0] ? b[0] : [];
      v0.forEach(function(v,i) { 
		     if( (v1[i] && v1[i] !== v) || (!v1[i] && v) ) { 
			 throw 1;  
		     } 
		 });
  }
*/
}

// add vector b to vector a, real or complex, returns vector a
function add_v(a, b) {
  var re, im;    

  // add real entries
  if(b[0]) {
      if(!a[0]){
	  a[0] = b[0].slice(0);
      } else {
	  re = a[0];
	  b[0].forEach(function(v,i) { re[i] = re[i] ? re[i] + v : v; });      
      }
  }

  // add im entries
  if(b[1]) {
      if(!a[1]) {
	  a[1] = b[1].slice(0);
      } else {
	  im = a[1];
	  b[1].forEach(function(v,i) { im[i] = im[i] ? im[i] + v : v; });
      }
  }

  return a;
}

// Add vector b multiplied by scalar s to a, return a
function add_v_mul_s(a, b, s) {
  var re, im;    
    
  // non optimised implementation
  return add_v(a, mul_v_s(clone_v(b), s));
}

// multiplies two vectors element wise (.), real or complex, returns new vector
function dmul_v(a, b) {
    
}

// multiplies two vectors, real or complex, returns scalar
function mul_v(a, b) {
    var re = 0, im = 0, a0, a1, b0, b1, r0, r1, i0, i1;
    // one of the vectors has imaginary values

    if (a[1] || b[1]) {
	// calculate complex sum

	if (a[1] && b[1]) {
	    // both vectors has complex values
	    a0 = a[0] ? a[0] : [];
	    a1 = a[1] ? a[1] : [];
	    
	    b0 = b[0] ? b[0] : [];
	    b1 = b[1] ? b[1] : [];

	    a0.forEach(function(v,i) { if ((r1=b0[i])) { r0=v; i0=a1[i]; i1=b1[i]; re += r0*r1-i0*i1; im+=i0*r1+r0*i1; } });
	} else {
	    // one of the vectors has complex values
	    if (a[1]) {
		a0 = b[0] ? b[0] : []; // the real vector
		
		b0 = a[0]; // the complex vector
		b1 = a[1];
	    } else {
		a0 = a[0] ? a[0] : []; // the real vector
		
		b0 = b[0]; // the complex vector
		b1 = b[1];		
	    }

	    a0.forEach(function(v,i) { if ((r1=b0[i])) { re += v*b0[i]; im += v*b1[i]; } } );
	}
	return [re, im];
    } else {
	re = 0;
	b0 = b[0];
	a[0].forEach(function(v,i) { if((r0=b0[i])) { re += b0[i]*v; } } );
	return re;
    }
}


function Matrix() {
    var n, i;

    this.re = [];
    this.im = [];
    this.dim = [];

    if(arguments.length > 0) {
	// create a NxN matrix with zeros
	if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	    this.dim[0] = this.dim[1] = arguments[0];
        } else {
	    this.dim = Array.prototype.slice.call(arguments);
	}
    }

    this.toString = function() {
	var i, j, s, d, r, c, e, re, im, sp = "          ";
	
	s = "";
	
	r = 1*this.dim[0];
	c = 1*this.dim[1];

	debug("r,c = " + r + ", " + c);

	if(this.im.length === 0) {
	    // only real elements
	    e = this.re;
	    for(i = 0; i < r; i++) {
		for(j = 0; j < c; j++) {
		    if(e[i] && (d = e[i][j])) {
			if(d < 1 && d > -1) {
			    d = d.toFixed(5);
			} else {
			    d = d.toPrecision(6);
			}

		    } else {
			d = "0";
		    }

		    s += sp.substring(d.length) + d;
		}
		s+= "\n";
	    }
	} else if (this.re.length === 0){
	    // only imaginary elements
	    e = this.im;
	    for(i = 0; i < r; i++) {
		for(j = 0; j < c; j++) {
		    if(e[i] && (d = e[i][j])) {
			if(d < 1 && d > -1) {
			    d = d.toFixed(5);
			} else {
			    d = d.toPrecision(6);
			}

		    } else {
			d = "0";
		    }
		    s += sp.substring(d.length) + d + "i";
		}
		s+= "\n";
	    }	    
	} else {
	    // mixed real/image elements
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

	return s;
    };

    //adresses one full row in matrix, always returns an array of [re, im]
    //row,col index is zero based. Lack of values is indicated by false, not empty array
    this.getrow = function(index) {
	var i, re, im;	

	if(index.length === (this.dim.length-1) ) {
	    re = this.re;
	    im = this.im;
	    for(i = 0; i < index.length; i++) {
		if (index[i] >= this.dim[i]) {
		    throw new("error: getrow : Index exceeds matrix dimension. index[" + i + "] (" + index[i] + " >= " + this.dim[i]);		    
		}
		re = re ? re[index[i]] : false;
		im = im ? im[index[i]] : false;
	    }
	    return [re && re.length ? re : false, im && im.length ? im : false];
	}	
	throw new("error: getrow : Index dimension not equal to matrix dimension - 1");
    };

    //adresses one full row in matrix, sets the row to the array of [re, im],
    //row,col index is zero based
    this.setrow = function(index, _re, _im) {
	var i, re, im;	

	if(index.length === (this.dim.length-1) ) {
	    re = this.re;
	    im = this.im;
	    for(i = 0; i < index.length; i++) {
		if (index[i] >= this.dim[i]) {
		    throw new("error: * : Index exceeds matrix dimension.");
		}
		// final row adressed, assign new row arrays
		if(i === index.length-1) {
		    if( (_re && _re.length > this.dim[i+1]) ||
			(_im && _im.length > this.dim[i+1]) ) {
			throw new("error: setrow M([I,J,...],X) : dimensions mismatch");
		    }

		    if(_re) {
			re[index[i]] = _re;			
		    } else {
			delete re[index[i]];
		    }

		    if(_im) {
			im[index[i]] = _im;			
		    } else {
			delete im[index[i]];
		    }
		} else {
		    // populate empty matrix indices, if row value exists
		    if(_re && !re[index[i]]) {
			re[index[i]] = [];
		    } 
		    
		    if(_im && !im[index[i]]) {
			im[index[i]] = [];
		    } 
		    
		    re = re[index[i]];
		    im = im[index[i]];
		}
	    }
	}	
    };

    this.firstrow = function() {
	var i = this.dim.slice(0);
	this.nextelem(i);
	i.pop();
	return i;
    };

    this.nextelem = function (i) {
	n = i.length-1;

	while(n >= 0) {
	    i[n]++;
	    if(i[n] < this.dim[n]) {
		break;
	    } else {
		i[n] = 0;
		n--;
	    }
	}
	return n >= 0;
    };

    this.clone = function() {
	var m = {}, i, r, re, im;
	Matrix.apply(m, this.dim);
	i = m.firstrow();
	do {
	    r = this.getrow(i).slice(0);
	    m.setrow(i, r[0] ? r[0].slice(0) : false, r[1] ? r[1].slice(0) : false);
	} while(m.nextelem(i));
	return m;
    };

    // returns scalar element in matrix if num args == dim.length, else
    // returns a sub matrix from matrix, index supports
    //row,col index is 1 based
    this.get = function() {
	var i, re, im;
            
	if(arguments.length <= this.dim.length) {
	    debug("get from: " + arguments[0] + "," + arguments[1]);
	    
	    // unnecesary premature optimisation
	    if(arguments.length === 2) {
		debug("get from: " + this.re);
		if( (re = this.re[arguments[0]-1]) ) {
		    re = re[arguments[1]-1];
		}
		if( (im = this.im[arguments[0]-1]) ) {
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

    this.set = function(index, re, im) {
	var i;
	if(index.length <= dim.length) {

	    re = this.re;
	    im = this.im;

	    for(i = 0; i < index.length; i++) {
		if(!re[index[i]-1]) {
		    
		}

		re = re ? re[index[i]-1] : 0;
		im = im ? im[index[i]-1] : 0;
	    }
	    
	} else {
	    throw new("error: * : Index exceeds matrix dimension.");
	}
    };
}

// matrix-matrix ops

// Multiplies matrix a with matrix b, returns result in new matrix
function mul_m(a, b) {
    var res, i, j, r, c, s, n, N;
    // A r,c x r,c
    if(a.dim[1] !== b.dim[0]) {
	throw new("operator *: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
    }
    
    N = a.dim[1];

    r = a.dim[0];
    c = b.dim[1];

    debug("result size: " + r + ", " + c);

    res = new Matrix(r, c);

    // 3x1 * 1x3 = 3x3

    // 1x3 * 3x1 = 1x1

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
	// complex matrix
    } else {
	for(i = 0; i < r; i++) {
	    res.re[i] = [];
	    res.im[i] = [];

	    for(j = 0; j < c; j++) {
		s = [0,0];
		
		if(a.re[i] && a.im[i]) {
		    for(n = 0; n < N; n++) {
			debug("hard mul/add");
			s = add_s(s,mul_s( [a.re[i][n], a.im[i][n]], [ b.re[n] && b.re[n][j], b.im[n] && b.im[n][j] ]));
		    } 
		} else {
		    for(n = 0; n < N; n++) {
			debug("safe mul/add");
			s = add_s(s,mul_s( [a.re[i] && a.re[i][n], a.im[i] && a.im[i][n] ], 
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
function add_m(a,b) {
    var i, j, J, n, s, t, a_re, b_re, a_im, b_im;

    if(a.dim.length === b.dim.length) {

	i = [];
	
	for(n = 0; n < a.dim.length; n++) {
	    if( a.dim[n] !== b.dim[n] ) {
		break;
	    }
	    i[n] = 0;
	}
	// dimensions agree

	var num = 0;

	// and the matrices has the same dimension, do the adding
	if(n === a.dim.length) {

	    // i is an index counter array used to index each row in the matrices

	    i.pop(); // remove last index
	    J = a.dim[a.dim.length-1]; // J is the number of elements in each row
	    
	    do {
		s = a.getrow(i);
		t = b.getrow(i);

		a_re = s[0];
		a_im = s[1];

		b_re = t[0];
		b_im = t[1];

		debug("iteration ", num++);
		debug("index ", i);
		debug("add: " + t + " to " + s);

		if(num > 10) {
		    return a;
		}

		if(b_re) {
		    if(!a_re) {
			a_re = b_re.slice(0);
		    } else {
			for(j = 0; j < J; j++) {
			    a_re[j] = a_re[j] ? a_re[j] + b_re[j] : b_re[j];
			}		    			
		    }
		}

		if(b_im) {
		    if(!a_im) {
			a_im = b_im.slice(0);
		    } else {
			for(j = 0; j < J; j++) {
			    a_im[j] = a_im[j] ? a_im[j] + b_im[j] : b_im[j];
			}		    			
		    }
		}
		
		a.setrow(i, a_re, a_im);

	    } while(a.nextelem(i));
	    return a;
	}
    }

    throw new("operator +: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
}


// creates a 1xN sized matrix, a vector.
function Vector() {
    var n;
    
    if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	Matrix.call(this, 1,arguments[0]);	
    }
}


function eye() {
    var a = {}, m, M, re;
    Matrix.apply(a, arguments);
    if(a.dim > 2) {
	throw new ("error: Invalid call to eye.  Correct usage is eye(M), eye(M,N)");
    }

    M = Math.min(a.dim[0], a.dim[1]);
    
    for(m = 0; m < M; m++) {
	re = [];
	re[m] = 1;
	a.re[m] = re;
    }

    return a;
}

function rand() {
    var n, i, I, a = {}, e, re;
    Matrix.apply(a, arguments);

    debug("got a matrix: " + size(a));
 
    n = a.firstrow();

     // inner loop length
    I = a.dim[a.dim.length-1];

    debug("inner loop length: " + I);

    do {
	debug("getrow from a, index: " + n + ", a.dim: " + a.dim);
	e = a.getrow(n);
	
	if(e[0]) {
	    re = e[0];
	} else {
	    re = [];
	}

	for(i = 0; i < I; i++) {
	    re[i] = Math.random();
	}
	
	a.setrow(n, re, false);

    } while(a.nextelem(n));

    return a;
}