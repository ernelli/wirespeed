var tic_start = new Date().getTime();
function tic() {
    tic_start = new Date().getTime();
}

function toc() {
    return (new Date().getTime()-tic_start)/1000;
}

print("start");

tic();

var n, N;
N = 20000;
var sum = 0;
for(n = 0; n < N; n++) {
    sum += n;
}

var t = toc();
print("loop time: " + t + ", tps: " + N/t);

var v = [];


sum = 0;
for(n = 0; n < N; n++) {
    v[n] = n;
}

tic();

sum = 0;
for(n = 0; n < N; n++) {
    sum += v[n];
}

t = toc();
print("loop vec time: " + t + ", tps: " + N/t);

delete(v[500]);

tic();
sum = 0;
v.forEach(function(_v,i) { sum += _v; v[i] = sum; });

t = toc();
print("foreach vec time: " + t + ", tps: " + N/t);
print("The sum is: " + sum);
print("v is altered");



