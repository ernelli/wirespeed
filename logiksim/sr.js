var sim = require('./sim.js')

var _s = new sim.Node("_s");
var _r = new sim.Node("_r");

var n0 = new sim.Node("n0");
var n1 = new sim.Node("n1");

var g0 = new sim.NAND2(_s, n1, 1);
g0.out.label = "g0";
var g1 = new sim.NAND2(_r, n0, 1);
g1.out.label = "g1";

n0.inputs.push(g0.out);
n1.inputs.push(g1.out);

sim.addNode(n0);
sim.addNode(n1);

sim.addLogic(g0);
sim.addLogic(g1);

sim.addEvent(_s, 1, 0);
sim.addEvent(_r, 1, 0);

sim.addEvent(_s, 0, 10);
sim.addEvent(_s, 1, 15);

sim.addEvent(_r, 0, 30);
sim.addEvent(_r, 1, 35);

var probes = [];
probes.push(sim.addStateProbe(_s));
probes.push(sim.addStateProbe(_r));
probes.push(sim.addStateProbe(g0.out));

sim.runSimulation(100, function() {
    console.log("--------------------------");
    console.log("GATE0: !(" + g0.a.value + "&" + g0.b.value + ") = " + g0.out.value);
    console.log("GATE1: !(" + g1.a.value + "&" + g1.b.value + ") = " + g1.out.value);

});

for(i = 0; i < probes.length; i++) {
    sim.printTimingDiagram(probes[i].states);
}



