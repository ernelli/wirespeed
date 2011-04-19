load('matrix.js');

var A = new Matrix(3);
print(A);
A.re = [ [1,2,3],[4,5,6], [7,8,9]];
A.im = [ [], [1, 0, -1] ];
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