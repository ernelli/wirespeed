alert("gauss loaded");

var matrix = 
[
 [1, 2, 3],
 [4, 5, 6],
 [7, 8, 9]
];

matrix = [[1, 5, 3, 1, 0 ,0],[ -1, -3, -4, 0, 1, 0],[ 7, 8, 9, 0, 0, 1]];

//if(typeof print === "function") {
    var debug = function(str) {
        console.log(str);
    };
//}

function LRUfact(mat)
{
    var M = mat.length;
    var N = mat[0].length;
    debug("size = (" + M + "," + N + ")");

    for(var m = 0; m < M; m++) {
	debug("step------" + m);
	dumpMatrix(mat) ;
	for(var mp = m+1; mp < M; mp++) {
	    pv = -mat[mp][m]/mat[m][m];
	    debug("pv: " + pv);
	    mat[mp][m] = 0;
	    for(n = m+1; n < N; n++) {
		mat[mp][n] += pv*mat[m][n];
	    }
	}
	debug("done > do pivot");
	dumpMatrix(mat);
	for(n = m+1; n < N; n++) {
	    mat[m][n] /= mat[m][m];
	}
	debug("pivot done");
	mat[m][m] = 1;
    }
}

function inverse(mat)
{
    var M = mat.length;
    var N = mat[0].length;

    LRUfact(mat);

    for(n = M-1; n >= 0; n--) {
	for(m = n-1; m >= 0; m--) {
	    pv = mat[m][n]/mat[m][m];
	    debug("pv [" + n + ", " + m + "] = " + pv);
	    for(var mp = m+1; mp < N; mp++) {
		mat[m][mp] -= pv*mat[n][mp];
	    }
	}
    }
}

function dumpMatrix(mat) 
{
    var M = mat.length;
    var N = mat[0].length;
    for(m = 0; m < M; m++)
	debug(mat[m]);
}

dumpMatrix(matrix);
//LRUfact(matrix);
inverse(matrix);
dumpMatrix(matrix);