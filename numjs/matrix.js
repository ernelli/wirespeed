var enableDebug;

if(enableDebug) {
    function debug(str) {
	print(str);
    }

} else {
    function debug() {
    }
}


function tic() {
    var now;
    now = new Date().getTime();
    tic.start = now;
}

tic.start = new Date().getTime();

function toc() {
    var now, elapsed;
    now = new Date().getTime();
    elapsed = (now - tic.start)/1000;
    tic.start = now;

    print("Elapsed time is " + elapsed + " seconds .");

    return elapsed;
}



function printMatlab(a) {
    var m,n, re, im, str;

    str = "[";

    for(m = 0; m < a.dim[0]; m++) {
        re = a.re[m] ? a.re[m] : [];
        im = a.im[m] ? a.im[m] : [];
        for(n = 0; n < a.dim[1]; n++) {
            str += re[n] ? re[n] : 0 + " ";

            if(im[n] && im[n] > 0) {
                str += "+" + im[n] + "i ";
            } else if (typeof im[n] != "undefined") {
                str += im[n] + "i ";  
            }
            str += " ";
        }
        if(m == a.dim[0]-1) {
            print(str + "]");
        } else {
            print(str + ";");            
        }
        str = "";
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
    var t, s = m.dim.slice(0);
    t = s[0];
    s[0] = s[1];
    s[1] = t;

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

function formatVector(v) {
    var s = "", im, re, i, I, d,  sp = "          ";
    re = v[0];
    im = v[1];

    I = re.length;

    if(!im) {
	    // only real elements
	for(i = 0; i < I; i++) {
            
            d = re[i];
            
	    if(d < 1 && d > -1) {
		d = d.toFixed(5);
	    } else {
		d = d.toPrecision(6);
	    }
            
	    s += sp.substring(d.length) + d;
	}

    } else {
	    // complex vector

	for(i = 0; i < I; i++) {
            
	    s+= re[i];
	    
	    d=im[i];
	    if(d < 0) {
		s+= " - " + (-d) + "i\t";
	    } else {
		s+= " + " + d + "i\t";
	    }
	}
    }
    return s;    
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
    //debug("mul_s: " + a + " with " + b);
    //debug("mul_s: " + formatScalar(a) + " * " + formatScalar(b) );
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

// abs scalar

function abs_s(s) {
    
    if(typeof s === "number") {
	return s < 0 ? -s : s;
    } else {
	if (s[0] && s[1]) {
	    return Math.sqrt(s[0]*s[0]+s[1]*s[1]);
	} else if(s[0]) {
	    return s[0] < 0 ? -s[0] : s[0] == undefined ? 0 : s[0];
	} else {
	    return s[1] < 0 ? -s[1] : s[1] == undefined ? 0 : s[1];
	}
    }
}

// vector-scalar functions

// v = [ re[], im[] ]
// s = number | [ re, im ]

// add scalar to vector
function add_v_s(v, s) {
    var N, n, re, im, s0, s1;
    
    if(typeof s === "number") {
	s0 = s;
	s1 = 0;
    } else {
	s0 = s[0] ? s[0] : 0;
	s1 = s[1] ? s[1] : 0;
    }

    N = v[0].length;

    // N not given, vector is not sparse

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

    if (v[1]) { // vector has both real and imaginary parts
	re = v[0];
	im = v[1];

	N = re.length;
	for(n = 0; n < N; n++) {
	    v0 = re[n];
	    v1 = im[n];

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
		v[1] = im = [];
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
    if(v[0] && v[1] ) {
	res = [ v[0].slice(0), v[1].slice(0)];
    } else if(v[0]) {
	res = [ v[0].slice(0) ];
    } else {
	res = [];
    }
    return res;
}
// returns true if both vectors are equal
function equal_v(a,b) {
    var v0, v1, n, N;
    
  // check real
    v0 = a[0];
    v1 = b[0];

    if(v0.length !== v1.length) {
        return false;
    }

    N = v0.length;
    for(n = 0; n < N; n++) {
	if(v0[n] !== v1[n]) {
	    return false;
	}
    }
    
    // check imaginary if present

    if(a[1] || b[1]) {
        v0 = a[1];
        v1 = b[1];

        // if only one vector has imaginary present, check that it only contains 
        // zeros, otherwise the vectors are non equal
        if(!v0 || !v1) {
            v0 = v0 ? v0 : v1;
            for(n = 0; n < N; n++) {
                if(v0[n]) {
                    return false;
                }
            }
        } else {
            if(v0.length !== v1.length) {
                return false;
            }
        
            N = v0.length;
            for(n = 0; n < N; n++) {
	        if(v0[n] !== v1[n]) {
	            return false;
	        }
            }
        }
    }  
    return true;
}

// add vector b to vector a, real or complex, returns vector a
function add_v(a, b) {
  var v0, v1, im, n, N;    

  v0 = a[0];
  v1 = b[0];

  N = a[0].length;

  // add re entries
  for(n = 0; n < N; n++) {
      v0[n] += v1[n];
  }

  // add im entries from b if present
  if(b[1]) {
      if(!a[1]) {
          a[1] = b[1].slice(0);
      } else {
          v0 = a[1];
          v1 = b[1];
          
          for(n = 0; n < N; n++) {
              v0[n] += v1[n];
          }
      }
  }

  return a;
}

// Add vector b multiplied by scalar s to a, return a
function add_v_mul_s(a, b, s) {
    var a0, a1, b0, b1, s0, s1, n, N;    

    N = a[0].length;

    if(typeof s === "number") {
	s0 = s;
	s1 = 0;
    } else {
	s0 = s[0] ? s[0] : 0;
	s1 = s[1] ? s[1] : 0;
    }

    // a & b are complex vectors and complex scalar
    if(a[1] && b[1] && s1) {
      a0 = a[0];
      a1 = a[1];

      b0 = b[0];
      b1 = b[1];

      for(n = 0; n < N; n++) {
        a0[n] += b0[n]*s0 - b1[n]*s1;
        a1[n] += b1[n]*s0 + b0[n]*s1;
      }

    // b is complex vector and complex scalar
    } else if(b[1] && s1) {
      a0 = a[0];
      a[1] = a1 = [];

      b0 = b[0];
      b1 = b[1];

      for(n = 0; n < N; n++) {
        a0[n] += b0[n]*s0 - b1[n]*s1;
        a1[n] = b1[n]*s0 + b0[n]*s1;
      }        
    // complex scalar, real b vector
    } else if(s1) {
      a0 = a[0];
      b0 = b[0];

      if(a[1]) {
          for(n = 0; n < N; n++) {
              a0[n] += b0[n]*s0;
              a1[n] += b0[n]*s1;
          }                  
      } else {
          a[1] = a1 = [];

          for(n = 0; n < N; n++) {
              a0[n] += b0[n]*s0;
              a1[n] = b0[n]*s1;
          }        
      }
    // real scalar
    } else {
        a0 = a[0];
        b0 = b[0];
        
        for(n = 0; n < N; n++) {
            a0[n] += b0[n]*s0;
        }

        if(b[1]) {
            b1 = b[1];

            if(a[1]) {
                a1 = a[1];
                
                for(n = 0; n < N; n++) {
                    a1[n] += b1[n]*s0;
                }
            } else {
                a[1] = a1 = [];
                for(n = 0; n < N; n++) {
                    a1[n] = b1[n]*s0;
                }
            }
        }
    }

    
  // non optimised implementation


//    return add_v(a, mul_v_s(clone_v(b), s));

    return a;
}

// dot mul vector, multiply each element of vector a with each element of vector b, real or complex, returns a
function dmul_v(a, b) {
    var N, n, a0, a1, b0, b1, r0, r1, i0, i1;

    if (a[1] || b[1]) {
	// calculate complex sum

	if (a[1] && b[1]) {
	    // both vectors has complex values
	    a0 = a[0];
	    a1 = a[1];
	    
	    b0 = b[0];
	    b1 = b[1];

	    N = a0.length;

            for(n = 0; n < N; n++) {
                r1=b0[n];
                r0=a0[n]; 
                i0=a1[n]; 
                i1=b1[n]; 

                a0[n] = r0*r1 - i0*i1; 
                a1[n] = i0*r1 + r0*i1;
            }
	} else {
	    // setup so that a0,a1 represents the complex vector and b0 the real vector

	    // one of the vectors has complex values, e.g become a0, a1
	    if (a[1]) {
		b0 = b[0]; // the real vector
	    } else {
		b0 = a[0] ? a[0] : []; // the real vector
		
		// need to clone b into a since b may not be altered
		a0 = b[0].slice(0);
		a1 = b[1].slice(0);		
	    }

	    // truncate a to honor sparse b, or sparse a
	    N = Math.min(a0.length, b0.length);

	    a0.length = N;
	    a1.length = N;

	    a0.forEach(function(v,i) { if (b0[i]) { a0[i]*=b0[i]; a1[i]*=b0[i]; } else { a0[i] = 0; a1[i] = 0; } } );
	}
	return [a0, a1];
    } else {
	a0 = a[0] ? a[0] : [];
	b0 = b[0] ? b[0] : [];

	// honor the sparseness of b
	N = Math.min(a0.length, b0.length);

	a0.length = N;

	a0.forEach(function(v,i) { a0[i] = b0[i] ? v*b0[i] : 0; } );

	return [a0];
    }    
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

	    a0.forEach(function(v,i) { if ((b0[i])) { re += v*b0[i]; im += v*b1[i]; } } );
	}
	return [re, im];
    } else {
	re = 0;
	b0 = b[0];
	a[0].forEach(function(v,i) { if((r0=b0[i])) { re += b0[i]*v; } } );
	return re;
    }
}

// Matrix of dimension N order in memory
//
// array of elements stored row by row.
// 
// elements [2,..,N,r][c], where 2..n is matrix index when dim > 2
//
// dim hold matrix dimension in order
//
// [rows, cols, 2, ..., N]
// 
// address (r,c,2..N) -> [2,..,N,r][c]
//
// 
//



function Matrix() {
    var n, i;

    //this.im = [];
    this.dim = [];

    // dim[0] = num cols
    // dim[1] = num rows
    // dim[2..n] = matrix index

    if(arguments.length > 0) {
	// create a NxN matrix with zeros
	if(arguments.length === 1 && arguments[0] && isInteger(arguments[0])) {
	    this.dim[0] = this.dim[1] = arguments[0];
        } else if(arguments.length === 1 && arguments[0] && typeof arguments[0] == "object" && arguments[0].length) {
            this.dim = arguments[0].slice(0);
        } else {
	    this.dim = Array.prototype.slice.call(arguments);
	}

        // swap row, col to make matrix dimension matlab compliant
        n = this.dim[0];
        this.dim[0] = this.dim[1];
        this.dim[1] = n;
        

        //if(this.dim.length > 2) {
        //    this.dim = this.dim.slice(2).concat(this.dim.slice(0,2));
        //}

        n = 1;
        for(i = 0; i < this.dim.length; i++) {
            n = n * this.dim[i];
        }
        this.re = new Array(n);
    } else {
        this.re = [];        
    }

    this.toString = function() {
        var i, j, J, e, m, s = "";
        
        j = 1;
        J = this.dim[1];
        i = this.firstrow();

        m = this.dim.length > 2;

        //print("first row: " + i.index);

        do {
            // print matrix index
            if(m && (++j === J)) {
                s += "index: " + i.index + "/" + this.dim + "\n";                
                j = 0;
            }
            
            e = this.getrow(i);
            //print("got row: " + e + ", size is: " + e[0].length);
            s += formatVector(e) + "\n";
        } while(this.nextrow(i));
        return s;
    };

    this.toStringX = function() {
	var i, j, s, d, r, c, e, re, im, sp = "          ";
	
	s = "";

        if(this.dim.length > 2) {
            return "dimension > 2 not supported yet: " + this.dim;
        }
	
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

    // elements are adressed [c,r,...,N]

    this.getindex = function(index) {
        var i, m, o;

        m = 1;
        o = index[0];
        
        for(i = 1; i < index.length; i++) {
            m *= this.dim[i-1];
            o += index[i] * m;
        }

        return o;
    };

    //adresses one full row in matrix, always returns an array of [re, im]
    //row,col index is zero based. Lack of values is indicated by undefined, not empty array
    this.getrow = function(index) {
	var i, re, im;	

        if(index.size) {
            i = index.index;  
        } else {
	    if(index.length === (this.dim.length-1) ) {
                i = this.getindex(index);
            } else {
                throw "error: getrow : Invalid index";
            }
        }
        re = this.re.slice(i, i+this.dim[0]);

        if(this.im) {
            im = this.im.slice(i, i+this.dim[0]);
        }
        return [re, im];
            /*
	    re = this.re;
	    im = this.im;
	    for(i = 0; i < index.length; i++) {
		if (index[i] >= this.dim[i]) {
		    throw "error: getrow : Index exceeds matrix dimension. index[" + i + "] (" + index[i] + " >= " + this.dim[i];		    
		}
		re = re ? re[index[i]] : false;
		im = im ? im[index[i]] : false;
	    }
	    return [re && re.length ? re : undefined, im && im.length ? im : undefined];
             */
    };

    //adresses one full row in matrix, sets the row to the array of [re, im],
    //row,col index is zero based
    this.setrow = function(index, _re, _im) {
	var i, m, n, N, re, im;	

        if(index.size) {
            i = index.index;  
        } else {
	    if(index.length === (this.dim.length-1) ) {
                i = this.getindex(index);
            } else {
                throw "error: setrow : Invalid index";
            }
        }

        N = i + this.dim[0];

	re = this.re;
	im = this.im;

        if(_re) {
            for(n = i, m = 0; n < N; n++,m++) {
                re[n] = _re[m];
            }
        }

        if(_im) {
            if(!im) {
                im = [];
                for(n = 0; n < i; n++) {
                    im[n] = 0;
                }
            }
            for(n = i, m = 0; n < N; n++,m++) {
                im[n] = _im[m];
            }

            if(!this.im) {
                N = re.length;
                while(n < N) {
                    im[n++] = 0;
                }
                this.im = im;
            }
        }


        /*
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
		    }

		    if(_im) {
			im[index[i]] = _im;			
		    }

		} else {
		    // populate empty matrix indices if row value is to be set
		    if(_re) {
                        if(!re[index[i]]) {
			    re[index[i]] = [];
                        }
		        re = re[index[i]];
		    } 
		    
		    if(_im) {
                        if(!im[index[i]]) {
			    im[index[i]] = [];
                        }
		        im = im[index[i]];
		    } 
		}
	    }
	}
	*/
    };

    this.firstrow = function() {
        var i, I, m = 1;
        I = this.dim.length;
        for(i = 0; i < I; i++) {
            m *= this.dim[i];
        }
	return { index: 0, size: m };
    };

    this.nextrow = function (i) {
        i.index += this.dim[0];
        if(i.index >= i.size) {
            i.index -= i.size;
            return false;
        }
        return true;
    };

    this.nextelem = function (i) {
        i.index++;

        if(i.index >= i.size) {
            i = 0;
            return false;
        }
        return true;
    };

    this.clone = function() {
	var m = {}, i, r, re, im;
	Matrix.apply(m, this.dim);
	i = m.firstrow();
	do {
	    r = this.getrow(i).slice(0);
	    m.setrow(i, r[0] ? r[0].slice(0) : false, r[1] ? r[1].slice(0) : false);
	} while(m.nextrow(i));
	return m;
    };

    // returns scalar element in matrix if num args == dim.length, else
    // returns a sub matrix from matrix, index supports
    //row,col index is 1 based
    this.get = function() {
	var o, m, i, re, im;
            
	if(arguments.length <= this.dim.length) {
	    //debug("get from: " + Array.prototype.slice.call(arguments));
	    
            // adress scalar element in matrix
	    if(arguments.length === this.dim.length) {
                o = (arguments[0]-1)*this.dim[0] + arguments[1] - 1;

                //print("get from offset: " + o + ", args: " + arguments + ", dim: " + this.dim);

                m = this.dim[0];
                    
                for(i = 2; i < arguments.length; i++) {
                    m *= this.dim[i-1];
                    o += (arguments[i]-1) * m;

                    //print("iterate i=" + i + ", arg: " + arguments[i] + ", offset: " + o + ", multiplier: " + m);
                }

                if(this.im) {
                    im = this.im[o];
                }
                re = this.re[o];

            } else {
	        throw new("error: get submatrix not supported yet.");                
            }

	    if(im) {
		return [re, im];
	    } else {
		return re;
	    }
	}
	throw new("error: Index exceeds matrix dimension.");
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

function mul_m_s(a,b) {
    var n, e;

    n = a.firstrow();

    do {
	e = a.getrow(n);
	mul_v_s(e,b);
	a.setrow(n,e[0],e[1]);
    }  while(a.nextrow(n));

    return a;
}

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

	    } while(a.nextrow(i));
	    return a;
	}
    }

    throw new("operator +: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
}

// sub b from a, return a
function sub_m(a,b) {
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

		for(j = 0; j < J; j++) {
		    a_re[j] -= b_re[j];
		}		    			


		if(b_im) {
		    if(!a_im) {
                        a_im = [];
			for(j = 0; j < J; j++) {
                            a_im[j] = -b_im[j];
                        }
		    } else {
			for(j = 0; j < J; j++) {
			    a_im[j] -= b_im[j];
			}		    			
		    }
		}
		
		a.setrow(i, a_re, a_im);

	    } while(a.nextrow(i));
	    return a;
	}
    }

    throw new("operator -: nonconformant arguments " + a.dim[0] + "x" + a.dim[1] + ", " + b.dim[0] + "x" + b.dim[1]);
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

    a = zeros.apply(this, arguments);

//    Matrix.apply(a, arguments);
    if(a.dim > 2) {
	throw new ("error: Invalid call to eye.  Correct usage is eye(M), eye(M,N)");
    }

    M = Math.min(a.dim[0], a.dim[1]);
    
    for(m = 0; m < M; m++) {
	a.re[m][m] = 1;
    }

    return a;
}

function zeros() {
    var n, N, a = {}, re;
    Matrix.apply(a, arguments);

    re = a.re;
    N = re.length;

    for(n = 0; n < N; n++) {
        re[n] = 0;
    }
    return a;
}

function ones() {
    var n, N, a = {}, re;
    Matrix.apply(a, arguments);

    re = a.re;
    N = re.length;

    for(n = 0; n < N; n++) {
        re[n] = 1;
    }
    return a;
}

function rand() {
    var n, N, a = {}, re;
    Matrix.apply(a, arguments);

    re = a.re;
    N = re.length;

    for(n = 0; n < N; n++) {
        re[n] = Math.random();
    }
    return a;
}

function abs_m(a) {
    var n, i, I, b, e, re, im;

    n = a.firstrow();

     // inner loop length
    I = a.dim[a.dim.length-1];

    do {
	e = a.getrow(n);

        re = e[0];
        im = e[1];

        if(re && im) {
	    for(i = 0; i < I; i++) {
	        re[i] = Math.sqrt(re[i]*re[i]+im[i]*im[i]);
	    }
        } else if(re){
            for(i = 0; i < I; i++) {
                if(re[i] < 0) {
                    re[i] = -re[i];
                }
            }
        }
	a.setrow(n, e[0], false);

    } while(a.nextrow(n));

    return a;        
}

// 1x3
// 1 2 3 -> sum row 6

// 3x3
// 1 2 3 -> sum rows
// 4 5 6       |
// 6 7 9
//          11 14 18

// 2x2x4
// 1 2  5 6 = 4 6  11 13
// 3 4  6 7
// 
// 2 3  7 8   6 6   8 10
// 4 3  1 2

function sum_m(a) {
    var d, m,n, i, I, s = {}, e, f;


    d = a.dim.slice(0);

    I = d.pop();
    //print("inner loop length: " + I);
    

    d = [1].concat(d);
    s = zeros(d);

    //print("sum size; " + size(s));
    //print("print matrix, re: " + s.re);
    //print(s);
    
    m = s.firstrow();
    n = a.firstrow();
    do {
        // sum all elements into e
        e = s.getrow(m);
        for(i = 0; i < I; i ++) {
            f = a.getrow(n);
            //print("add row to: [" + e + "], index " + n + ", values: " + f);
            add_v(e, f);
            a.nextrow(n);
        }
        s.setrow(m, e[0]);
    } while(s.nextrow(m));

    return s;
}
