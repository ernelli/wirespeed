function gauss_im(a)
{
    var M, N, m, n, mp, pv, re, im, p, z, max, imax, tmp;

    if(a.dim.length > 2) {
	throw new("error: invalid conversion of NDArray to Matrix");
    }

    M = a.dim[0];
    N = a.dim[1];

    re = a.re;
    im = a.im;

    // initialise the pivot array
    p = [];
    for(m = 0; m < M; m++) {
	p[m] = m;
    }

    print("Start gauss elimination on\n" + a);

    // Work down along all rows
    for(m = 0; m < M; m++) {
	max = re[m] ? abs_s([re[m][m], im[m][m]]) : 0;
	imax = m;
	for(n = m+1; n < M; n++) {
	    if(re[n] && (tmp=abs_s([re[n][m],im[n][m]])) > max) {
		max = tmp;
		imax = n;
	    }
	}

	// swap curr row with the row with the largest pivoting element
	if (imax !== m) {
	    print("swap: " + imax + ", " + m);
	    // mark the swap in the pivot array
	    tmp = p[imax];
	    p[imax] = p[m];
	    p[m] = tmp;

	    tmp = re[imax];
	    re[imax] = re[m];
	    re[m] = tmp;

	    tmp = im[imax];
	    im[imax] = im[m];
	    im[m] = tmp;
	}
	
	for(mp = m+1; mp < M; mp++) {
	    pv = -div_s([re[mp][m]?re[mp][m]:0, im[mp][m]?im[mp][m]:0], [re[m][m]?re[m][m]:0, im[m][m]?im[m][m]:0]) ;

	    delete re[mp][m];
	    delete im[mp][m];

	    add_v_mul_s([re[mp],im[mp]], [re[m][n],im[m][n]], pv);
	}

	mul_v_s([re[m],im[m]], div_s(1, [re[m][m],im[m][m]]));

	re[m][m] = 1;
	im[m][m] = 0;
    }

    //print("return Pivot array: " + p);

    return p;
}


function gauss_real(a)
{
    var M, N, m, n, mp, pv, re, p, z, max, imax, tmp;

    if(a.dim.length > 2) {
	throw new("error: invalid conversion of NDArray to Matrix");
    }

    M = a.dim[0];
    N = a.dim[1];
    re = a.re;

    // initialise the pivot array
    p = [];
    for(m = 0; m < M; m++) {
	p[m] = m;
    }

    //print("Pivot array: " + p);
    for(m = 0; m < M; m++) {
	// insert zero row in empty sparse matrix, note! makes matrix singular
	if(!re[m]) {
            z = [];
	    for(n = 0; n < N; n++) {
		z[n] = 0;
	    }
	    re[m] = z;
	} else {
	// Check that the row has non empty elements
	    z = re[m];
	    for(n = 0; n < N; n++) {
		if(!z[n]) {
		    z[n] = 0;
		}
	    }	    
	}
    }

    // Work down along all rows
    for(m = 0; m < M; m++) {
	max = re[m][m] ? Math.abs(re[m][m]) : 0;
	imax = m;
	for(n = m+1; n < M; n++) {
	    if(re[n][m] && Math.abs(re[n][m]) > max) {
		max = Math.abs(re[n][m]);
		imax = n;
	    }
	}

	// swap curr row with the row with the largest pivoting element
	if (imax !== m) {
	    // mark the swap in the pivot array
	    tmp = p[imax];
	    p[imax] = p[m];
	    p[m] = tmp;

	    tmp = re[imax];
	    re[imax] = re[m];
	    re[m] = tmp;
	}
	
	for(mp = m+1; mp < M; mp++) {
	    pv = -re[mp][m]/re[m][m];

	    re[mp][m] = 0;
	    for(n = m+1; n < N; n++) {
		re[mp][n] += pv*re[m][n];
	    }
	}
        pv = 1/re[m][m];
	for(n = m+1; n < N; n++) {
	    re[m][n] *= pv;
	}
	re[m][m] = 1;
    }
    return p;
}

function gaussjordan_real(a)
{
    var M, N, m, n, pv, mp, re, p;
    M = a.dim[0];
    N = a.dim[1];

    p = gauss_real(a);
    //print("gauss eliminated matrix: \n" + a);

    re = a.re;

    for(n = M-1; n >= 0; n--) {
	for(m = n-1; m >= 0; m--) {
	    pv = re[m][n]/re[m][m];
	    //debug("pv [" + n + ", " + m + "] = " + pv);
	    for(mp = m+1; mp < N; mp++) {
		re[m][mp] -= pv*re[n][mp];
	    }
	}
    }

    //print("row echelon matrix: \n" + a);
    //print("pivot array: " + p);

    return p;
}

function inverse(m) {
    var r, i, re, n, res;

    if(m.dim.length != 2 || m.dim[0] !== m.dim[1]) {
	throw new("error: inverse: argument must be a square matrix");
    }

    if(m.im.length) {
	throw new("error: inverse: complex matrices not supported yet");
    }

    n = m.dim[0];
    
    // augment result matrix with eye
    r = new Matrix(m.dim[0], 2*m.dim[0]);
    i = m.firstrow();
    do {
	re = m.getrow(i)[0].slice(0);
	re[n++] = 1;
        r.setrow(i, re, false);
    } while(m.nextelem(i));

//    print("Augmented matrix");
//    print(r);
    res = gaussjordan_real(r);
//    print("Inverse matrix");
//    print(r);

    n = m.dim[0];
    i = r.firstrow();
    do {
	re = r.getrow(i)[0].slice(n);
        r.setrow(i, re, false);
    } while(r.nextelem(i));

    r.dim[1] = r.dim[0];

    return r;    
}