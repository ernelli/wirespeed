var sim = require('./sim.js')

var data0 = new sim.Node();
data0.label = "data0";

var data1 = new sim.Node();
data1.label = "data1";

var data2 = new sim.Node();
data2.label = "data2";

var gate3 = new sim.NAND(data0, data1, data2, 0);

//logic.push(clock);
//logic.push(gate);
sim.addLogic(gate3);


var i;

var data = [data0, data1, data2];

sim.addEvent(data0, 0, 0);
sim.addEvent(data0, 1, 5);
sim.addEvent(data0, 0, 10);
sim.addEvent(data0, 1, 15);
sim.addEvent(data0, 0, 20);
sim.addEvent(data0, 1, 25);
sim.addEvent(data0, 0, 30);
sim.addEvent(data0, 1, 35);

sim.addEvent(data1, 0, 0);
sim.addEvent(data1, 1, 10);
sim.addEvent(data1, 0, 20);
sim.addEvent(data1, 1, 30);

sim.addEvent(data2, 0, 0);
sim.addEvent(data2, 1, 20);

var probes = [];

for(i = 0; i < data.length; i++) {
    probes.push(sim.addStateProbe(data[i]));
}
probes.push(sim.addStateProbe(gate3.out));

sim.runSimulation(100);


for(i = 0; i < probes.length; i++) {
    sim.printTimingDiagram(probes[i].states);
}