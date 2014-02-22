var sim = require('./sim.js')


var a = new sim.Node();
var b = new sim.Node();

var n0 = new sim.Node();
var n1 = new sim.Node();

var gate = new sim.NAND2(a, b);

//sim.addNode(a);
//sim.addNode(b);
sim.addNode(n0);
sim.addNode(n1);
sim.addLogic(gate);

n0.inputs.push(gate.out);
n1.inputs.push(n0);

sim.addEvent(a, 0, 0);
sim.addEvent(b, 0, 0);

sim.addEvent(a, 1, 5);

sim.addEvent(a, 0, 10);
sim.addEvent(b, 1, 10);

sim.addEvent(a, 1, 15);
sim.addEvent(b, 1, 15);

sim.addEvent(a, 0, 20);
sim.addEvent(b, 0, 20);

var probes = [];
probes.push(sim.addStateProbe(a, "a"));
probes.push(sim.addStateProbe(b, "b"));
probes.push(sim.addStateProbe(gate.out, "!(a&b)"));
probes.push(sim.addStateProbe(n0, "n0"));
probes.push(sim.addStateProbe(n1, "n1"));

sim.runSimulation(100);

for(i = 0; i < probes.length; i++) {
    sim.printTimingDiagram(probes[i].states);
}


