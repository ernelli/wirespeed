function gauss_real(m)
{
    var M, N, m, n, mp, pv, mat, p, z;

    if(m.dim.length > 2) {
	throw new("error: invalid conversion of NDArray to Matrix");
    }

    M = m.dim[0];
    N = m.dim[1];
    mat = m.re;

    // initialise the pivot array
    p = [];
    for(m = 0; m < M; m++) {
	p[m] = m;
    }

    for(m = 0; m < M; m++) {

	// insert zero row in empty sparse matrix
	if(!mat[m]) {
            z = [];
	    for(n = 0; n < N; n++) {
		z[n] = 0;
	    }
	    mat[m] = z;
	} else {
	// Check that the row has non empty elements
	    z = mat[m];
	    for(n = 0; n < N; n++) {
		if(!z[n]) {
		    z[n] = 0;
		}
	    }	    
	}

	for(mp = m+1; mp < M; mp++) {
	    pv = -mat[mp][m]/mat[m][m];

	    mat[mp][m] = 0;
	    for(n = m+1; n < N; n++) {
		mat[mp][n] += pv*mat[m][n];
	    }
	}

	for(n = m+1; n < N; n++) {
	    mat[m][n] /= mat[m][m];
	}
	mat[m][m] = 1;
    }
}

function gaussjordan(mat)
{
    var M = mat.length;
    var N = mat[0].length;

    gauss(mat);

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
