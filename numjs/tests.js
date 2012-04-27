load('seedrandom.js');
enableDebug = true;
load('matrix.js');
load('gauss.js');

function assert(x) {
    if(!x) {
	(null).fail();
	//print("Assertion failed");
	throw new Error("Assertion failed");
	//throw new RhinoException("Assertion failed");
	//throw new exception("Assertion failed");
    }
}

try {
    
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

assert(abs_s(-1) == 1);
assert(abs_s(2) == 2);
assert(abs_s([2,0]) == 2);
assert(abs_s([2]) == 2);
assert(abs_s([0,3]) == 3);
assert(abs_s([0,-3]) == 3);
assert(abs_s([3,-4]) == 5);
assert(abs_s([-3,4]) == 5);

// testing vector primitives
print("Testing vector primitives");

assert(equal_v([[1,2,3]],[[1,2,3]]));
assert(!equal_v([[1,0,3]],[[1,2,3]]));
assert(equal_v([[1,0,3]],[[1,0,3]]));
assert(equal_v([[1,0,3]],[[1,0,3]]));
assert(!equal_v([[1,0,3],[0,0,0]],[[1],[0]]));
assert(!equal_v([[1,0,3],[0,0,0]],[[1,0,3,0,0,0,0,0,0],[0,0,0]]));

assert(!equal_v([[0],[1]],[[0]]));
assert(equal_v([[0],[1]],[[0],[1]]));

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
assert(equal_v(a,b));

a = [ [1,0,3],[0,0,0] ];
mul_v_s(a,2);
assert(equal_v(a,[[2,0,6]]));
mul_v_s(a,[0,1]);
assert(equal_v(a,[[0,0,0],[2,0,6]]));


a = [ [0,0,0], [1 ,-1 , 0]]; // im only
b = [ [1, 2, 3]];   // real only

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
assert(equal_s(mul_v([[1,1,1,0,0,1],[2,2,2,0,0,2]],[[-1,-1,-1,0,0,-1], [1,1,1,0,0,1] ]),mul_s(4,mul_s([1,2], [-1,1]))));

// check that zero entry doesnt count
assert(equal_s(mul_v([[1,1,1,0,1],[2,2,2,0,2]],[[-1,-1,-1,-1,-1], [1,1,1,1,1] ]),mul_s(4,mul_s([1,2], [-1,1]))));

// check that real array * complex works
assert(equal_s(mul_v([[1,1,1,0,1],[2,2,2,0,2]],[[-1,-1,-1,-1,-1] ]),mul_s(-4,[1,2])));
assert(equal_s(mul_v([[-1,-1,-1,-1,-1] ],[[1,1,1,0,1],[2,2,2,0,2]]),mul_s(-4,[1,2])));
assert(equal_s(mul_v([[-1,0,-1,-1,0,-1,-1] ],[[1,0,1,1,0,0,1],[2,0,2,2,0,0,2]]),mul_s(-4,[1,2])));

// check that real array*array works
assert(equal_s(mul_v([[1,1,1,0,1]],[[-1,-1,-1,-1,-1]]), -4));
assert(!equal_s(mul_v([[1,1,1,0,1]],[[-1,-1,-1,-1,-1]]), -5));
assert(!equal_s(mul_v([[0,0,1,1,1,0,1]],[[0,0,-1,-1,-1,-1,-1]]), -5));

assert(equal_s(mul_v([[]],[[]]), 0));
assert(equal_s(mul_v([[],[]],[[]]), 0));
assert(equal_s(mul_v([[]],[[],[]]), 0));
assert(equal_s(mul_v([[],[]],[[],[]]), 0));

print("test dmul_v, vector vector element multiplication");

// check real vectors
assert(equal_v(dmul_v([[1,0,1,0]], [[0,1,0,1]]), [[0,0,0,0]]));
assert(equal_v(dmul_v([[1,0,1,0]], [[0,1,0,1]]), [[0,0,0,0]]));
assert(equal_v(dmul_v([[1,0,1,0]], [[0,1,0,1]]), [[0,0,0,0]]));

assert(equal_v(dmul_v([[1,1,1,1]], [[1,1]]), [[1,1]]));
assert(equal_v(dmul_v([[1,1]], [[1,1,1,1]]), [[1,1]]));

// check sparse complex vectors
assert(equal_v(dmul_v([ [1,1,1,1],[1,1,1,1] ], [ [1,1,1,1], [1,1,1,1] ]), mul_v_s( [ [1,1,1,1], [1,1,1,1] ], [1,1]) ));
assert(equal_v(dmul_v([ [1,0,1,1],[1,0,1,1] ], [ [0,1,1,1], [0,1,1,1] ]), dmul_v([ [1,0,1,1],[1,0,1,1] ], [ [0,1,1,1], [0,1,1,1] ]) ));
assert(equal_v(dmul_v([ [1,1],[1,1] ], [ [0,1,1,1], [0,1,1,1] ]), dmul_v([ [1,1],[1,1] ], [ [0,1], [0,1] ]) ));
assert(equal_v(dmul_v([ [1,1],[1,1] ], [ [0,1,1,1], [0,1,1,1] ]), dmul_v([ [1,1],[1,1] ], [ [0,1], [0,1] ]) ));

print("test add_v_mul_s");

assert(equal_v([[1,1,1,1]],add_v_mul_s([[1,0,1,0]],[[0,1,0,1]],1)));
assert(equal_v([[1,-2,1,-2]],add_v_mul_s([[1,0,1,0]],[[0,1,0,1]],-2)));
assert(equal_v([[0,0,0,0],[1,1,1,1]],add_v_mul_s([[0,0,0,0]],[[1,1,1,1]],[0,1])));
assert(equal_v([[-1,-1,-1,-1],[0,0,0,0]],add_v_mul_s([[0,0,0,0]],[[0,0,0,0],[1,1,1,1]],[0,1])));
assert(equal_v([[-1,-1,-1,-1],[1,1,1,1]],add_v_mul_s([[0,0,0,0],[1,1,1,1]],[[0,0,0,0],[1,1,1,1]],[0,1])));
assert(equal_v([[-1,-1,-1,-1],[3,3,3,3]],add_v_mul_s([[-1,-1,-1,-1],[1,1,1,1]],[[1,1,1,1],[0,0,0,0]],[0,2])));

print("Vector primitives passed");

print("testing matrix primitives");
var M = new Matrix(3,3);
M.re = [1,2,3,4,5,6,7,8,9];

var i;
for(i = 0; i < 9; i++) {
    assert( M.get(1 + (i / 3)|0, 1 + i % 3 ) === (i+1) ) ;
}
print("matrix [3x3] get ok!");

M = new Matrix(4,2);
M.re = [1,2,3,4,5,6,7,8];
print(M);

for(i = 0; i < 8; i++) {
    assert( M.get(1 + (i / 2)|0, 1 + i % 2 ) === (i+1) ) ;
}
print("matrix [4x2] get ok!");
quit();

var M1 = mul_m_s(M,1.5);
var str = M1.toString();
var ref = ("   1.50000   3.00000   4.50000\n"+
"   6.00000   7.50000   9.00000\n"+
"   10.5000   12.0000   13.5000\n");
print("compare str:\n" + str);
print("compare ref:\n" + ref);
assert(str === ref);

M = ones(4,3);
print("dim: " + M.dim);
print("re: " + M.re);
print(M);

//print("print matrix");
//print(M1);

var A = ones(3,3);
print(mul_m_s(A,2));
print("A.im: " + typeof A.im);
print(mul_m_s(A,[1,2]));

print("testing sum_m");

A = ones(3,3,3);
var S1 = sum_m(A);
print("sum:\n" + S1);

var B = ones(2,2,2,2);
var S2 = sum_m(B);
print("sum:\n" + S2);

var C = ones(3,3);
print("summing:\n" + C);
var S3 = sum_m(C);
print("sum:\n" + S3);

quit(0);

print("testing gauss elimination");

Math.seedrandom(4711);

var N = 3;

var A = add_m(ones(N,N), mul_m_s(rand(N),-2) );
print(A);
print("-----------------");
tic();
var IA = inverse(A);
toc();
print(IA);

var AIA = mul_m(A, IA);
var IAA = mul_m(IA, A);

print(AIA);
print(IAA);

var diff = sub_m(AIA, eye(N,N));
diff = abs_m(diff);
print("-------------------- diff");
print(diff);
var s = sum_m(diff);

//printMatlab(A);

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
var P = res[1];
print(G);
print(P);

var IG = inverse(G);
print(IG);
var GIG = mul_m(GIG, IG);
}


} catch (e) {
    print("Testcase failed with [" + e.name + "] : ", e, " at file: " + e.fileName + ", line " + e.lineNumber);
    //    print("message: " + e.rhinoException.getLineNumber());
    if(e.rhinoException) {
	print("stack: " + e.rhinoException.getScriptStackTrace());
    }
}
