load('matrix.js');
load('gauss.js');

var A = new Matrix(3);
print(A);

// A = [1 2 3; 4 5 6; 7 8 9] + i*[ 0 0 0 ; 1 0 -1; 0 0 0]

A.re = [ [1,2,3],[4,5,6], [7,8,9]];
A.im = [ [], [1, 0, -1] ];
print(A);

var B = new Vector(3);
B.re = [[1, 2, 3]];

var C = new Matrix(3,1);
C.re = [ [1], [2], [3] ];

// create a sparse identity matrix
var I = new eye(3);

print(I);

// Create a rank2 matrix
var R2 = new Matrix(3);

R2.re = [];
R2.re[0] = [1,2,3];
R2.re[1] = [6,9,8];


/*
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
*/

var E0 = new Matrix(3);
var E1 = new Matrix(3);

var S = add_m(E0, E1);

var R;

print(R = rand(3,3));

var G = new Matrix(3,3);
G.re = [ [1,2,3],[6, 7, 9],[12, 13, 14]];
var res = gauss_real(G.clone());
P = res[1];
print(G);
print(P);

inv = inverse(G);
print(inv);