var sim = require('./sim.js')

var clk = new sim.Node();
clk.label = "clk";

var data = new sim.Node();
data.label = "clk";


var rs0outu = new sim.Node();
var rs0outl = new sim.Node();

var rs1outu = new sim.Node();
var rs1outl = new sim.Node();

var rs2outu = new sim.Node();
var rs2outl = new sim.Node();

var rs0u = new sim.NAND2(rs1outl, rs0outl, 1);
var rs0l = new sim.NAND2(rs0outu, clk, 1);

var rs1u = new sim.NAND(rs0outl, clk, rs1outl, 1);
var rs1l = new sim.NAND2(rs1outu, data, 1);

var rs2u = new sim.NAND2(rs0outl, rs2outl, 1);
var rs2l = new sim.NAND2(rs2outu, rs1outu, 1);

rs0outu.inputs.push(rs0u.out)
rs0outl.inputs.push(rs0l.out)

rs1outu.inputs.push(rs1u.out)
rs1outl.inputs.push(rs1l.out)

rs2outu.inputs.push(rs2u.out)
rs2outl.inputs.push(rs2l.out)

sim.addNode(rs0outu);
sim.addNode(rs0outl);
sim.addNode(rs1outu);
sim.addNode(rs1outl);
sim.addNode(rs2outu);
sim.addNode(rs2outl);

sim.addLogic(rs0u);
sim.addLogic(rs0l);
sim.addLogic(rs1u);
sim.addLogic(rs1l);
sim.addLogic(rs2u);
sim.addLogic(rs2l);

sim.addEvent(clk, 0, 0);
sim.addEvent(data, 0, 0);
sim.addEvent(data, 1, 10);
sim.addEvent(clk, 1, 15);
sim.addEvent(data, 0, 20);
sim.addEvent(clk, 0, 22);
sim.addEvent(clk, 1, 25);
sim.addEvent(data, 1, 30);
sim.addEvent(data, 0, 40);
sim.addEvent(data, 1, 50);
sim.addEvent(data, 0, 60);
sim.addEvent(data, 1, 70);


var probes = [];
probes.push(sim.addStateProbe(data));
probes.push(sim.addStateProbe(clk));
probes.push(sim.addStateProbe(rs2outu));

sim.runSimulation(100);

for(i = 0; i < probes.length; i++) {
    sim.printTimingDiagram(probes[i].states);
}