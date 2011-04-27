load('matrix.js');

var A = new Matrix(3);
print(A);

// A = [1 2 3; 4 5 6; 7 8 9] + i*[ 0 0 0 ; 1 0 -1; 0 0 0]

A.re = [ [1,2,3],[4,5,6], [7,8,9]];
A.im = [ [], [1, 0, -1] ];
print(A);

B = new Vector(3);
B.re = [[1, 2, 3]];

C = new Matrix(3,1);
C.re = [ [1], [2], [3] ];

// create a sparse identity matrix
I = new Matrix(3);
I.re = [];
I.re[0] = [ 1 ];
I.re[1] = [];
I.re[1][1] = 1;
I.re[2] = [];
I.re[2][2] = 1;

// Create a rank2 matrix
R2 = new Matrix(3);

R2.re = [];
R2.re[0] = [1,2,3];
R2.re[1] = [6,9,8];


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