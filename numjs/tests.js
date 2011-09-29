load('matrix.js');
load('gauss.js');

function assert(x) {
    if(!x) {
	//print("Assertion failed");
	throw new Error("Assertion failed");
	//throw new RhinoException("Assertion failed");
	//throw new exception("Assertion failed");
    }
}

print("Testing scalar primitives");

assert(equal_s([1,0],[1,0]));
assert(equal_s([-1,0],[-1,0]));
assert(equal_s([-1,2],[-1,2]));
assert(!equal_s([-1,2],[1,2]));
assert(!equal_s([1,-2],[1,2]));
assert(!equal_s([-1,-2],[1,2]));

// Checking that scalar equality works with plain numbers
assert(equal_s(1,1));
assert(equal_s(0,0));
assert(equal_s(-1,-1));
assert(!equal_s(-1, 1));

assert(equal_s([1,0],1));
assert(equal_s([-1,0],-1));
assert(equal_s(1, [1,0]));
assert(equal_s(-1, [-1,0]));
assert(!equal_s([-1,0],1));
assert(!equal_s(1, [-1,0]));

var a = [2, 3];
var b = [0, 1];
var c;

c = mul_s(a, [1,0]);
assert(equal_s(c,a));
c = mul_s(a, b);
assert(c[0] === -a[1]);
c = mul_s(c, b);
c = mul_s(c, b);
c = mul_s(c, b);
assert(equal_s(a,c));

// testing vector primitives
print("Testing vector primitives");

assert(equal_v([[1,2,3],[]],[[1,2,3],[]]));
assert(!equal_v([[1,,3],[]],[[1,2,3],[]]));
assert(equal_v([[1,,3],[]],[[1,0,3],[]]));
assert(equal_v([[1,,3],[]],[[1,,3],[]]));
assert(!equal_v([[1,,3],[]],[[1,,],[]]));
assert(equal_v([[1,,3],[]],[[1,,3,0,0,0,0,0,0],[]]));

assert(!equal_v([[],[1]],[[]]));
assert(equal_v([[],[1]],[,[1]]));

var v = [];
v[0] = [1, 2, 3, 4, 5, 6, 7, 8];
v[1] = [8, 7, 6, 5, 4, 3, 2, 1];

var r = [];
r[0] = [1, 2, 3, 4, 5, 6, 7, 8];
r[1] = [8, 7, 6, 5, 4, 3, 2, 1];


// Multiply with 1
mul_v_s(v, [1,0]);
assert(equal_v(v,r));

// multipy with i
mul_v_s(v, [0,1]);
assert(!equal_v(v,r));
mul_v_s(v, [0,1]);
assert(!equal_v(v,r));
mul_v_s(v, [0,1]);
assert(!equal_v(v,r));
mul_v_s(v, [0,1]);
assert(equal_v(v,r));

var a = clone_v(v);
var b = clone_v(v);
add_v(a,a);
mul_v_s(b,2);

a = [ , [1 ,-1 , 0]]; // im only
b = [ [1, 2, 3], ];   // real only

assert(equal_v(a,clone_v(a)) );
assert(!equal_v(a,clone_v(b)) );
print("vector clone ok");

assert(equal_v(add_v(clone_v(a), clone_v(b)),add_v(clone_v(b), clone_v(a))));

print("test mul_v, scalar multiplication");

// test single entry multiplication
assert(equal_s(mul_v([[1],[2]],[[-1], [1] ]),mul_s([1,2], [-1,1])));
assert(!equal_s(mul_v([[1],[2]],[[-1], [1] ]),mul_s([1,2], [1,1])));
// testing array multiplication
assert(equal_s(mul_v([[1,1,1,1],[2,2,2,2]],[[-1,-1,-1,-1], [1,1,1,1] ]),mul_s(4,mul_s([1,2], [-1,1]))));
assert(equal_s(mul_v([[1,1,1,,,1],[2,2,2,,,2]],[[-1,-1,-1,,,-1], [1,1,1,,,1] ]),mul_s(4,mul_s([1,2], [-1,1]))));

// check that zero entry doesnt count
assert(equal_s(mul_v([[1,1,1,0,1],[2,2,2,0,2]],[[-1,-1,-1,-1,-1], [1,1,1,1,1] ]),mul_s(4,mul_s([1,2], [-1,1]))));

// check that real array * complex works
assert(equal_s(mul_v([[1,1,1,0,1],[2,2,2,0,2]],[[-1,-1,-1,-1,-1] ]),mul_s(-4,[1,2])));
assert(equal_s(mul_v([[-1,-1,-1,-1,-1] ],[[1,1,1,0,1],[2,2,2,0,2]]),mul_s(-4,[1,2])));
assert(equal_s(mul_v([[-1,,-1,-1,,-1,-1] ],[[1,,1,1,,0,1],[2,,2,2,,0,2]]),mul_s(-4,[1,2])));

// check that real array*array works
assert(equal_s(mul_v([[1,1,1,0,1]],[[-1,-1,-1,-1,-1]]), -4));
assert(!equal_s(mul_v([[1,1,1,0,1]],[[-1,-1,-1,-1,-1]]), -5));
assert(!equal_s(mul_v([[,,1,1,1,0,1]],[[,,-1,-1,-1,-1,-1]]), -5));

assert(equal_s(mul_v([[]],[[]]), 0));
assert(equal_s(mul_v([[],[]],[[]]), 0));
assert(equal_s(mul_v([[]],[[],[]]), 0));
assert(equal_s(mul_v([[],[]],[[],[]]), 0));

print("Vector primitives passed");


if (false) {
var A = new Matrix(3);
print(A);

// A = [1 2 3; 4 5 6; 7 8 9] + i*[ 0 0 0 ; 1 0 -1; 0 0 0]

A = eye(3);
//A.re = [ [1,2,3],[4,5,6], [7,8,9]];
A.im = [ [1, 0, -1], [1, 1, 1], [-1, -1, 1] ];
print(A);
var AA = mul_m(A,A);
print(AA);

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

}
