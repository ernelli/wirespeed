// array of nodes, each node contains multiple inputs, these are resolved each time a connected output changes
// each output can be 0, 1, 'Z', 'X'
// contains
// {
//   inputs: [],
//   value: 
// }
//
var nodes = [];

// the logic expressions that connects the nodes, contains callbacks
// 
// {
//   a: node,
//   b: node,
//   out: value
// }

var logic = [];

// the event queue, sorted by time
var events = [];

// probes that print internal states during simulation
// {
//   node: node to watch
//   name: name of watch
// }
var stateProbes = [];

var simulationTime = 0;

function printEvents() {
    var str = "events: ";
    for(var i = 0; i < events.length; i++) {
        str += "[" + events[i].time + "ns " + events[i].value + " -> " + (events[i].node.label?events[i].node.label:"?") + "]";
    }
    console.log(str);

}

function addEvent(node, value, delta) {
    var i, tstamp;
    
    eventTime = simulationTime + delta;

    var event = { time: eventTime, node: node, value: value };

    //console.log("addEvent: ", event);
    //console.log("events: ", events);

    for(i = 0; i < events.length; i++) {
        if(events[i].time > eventTime) {
            break;
        }
    }
    if(i === 0) {
        events.unshift(event) // prepend
    } else {
        if(i > events.length) {
            events.push(event); // append
        } else {
            //console.log("splice event: ", event, " into position: " + (i) + " before: ", events[i]);
            events.splice(i, 0, event); // insert before next event
        }
    }
    printEvents();
}

var Z = 2;
var X = 3;

function Node(label) {
    this.inputs = [];
    this.value = X;
    this.label = label;

    this.eval = function() {
        var val = Z;
        for(var i = 0; i < this.inputs.length; i++) {
            if(val !== this.inputs[i].value) {
                if(val === Z) {
                    val = this.inputs[i].value;
                } else if(this.inputs[i].value !== Z) {
                    val = X;
                    break;
                }
            }
        }
        return val;
    }
}

function Logic() {
    this.value = X;
    this.delay = 0;
    this.inputs = [];
    this.out = { value: X, label: "" };
    this.eval = function() {
        var val = this.table(inputs[0], inputs[1]);
        if(val !== this.value) {
            this.value = val;
            addEvent(this.out, this.value, this.delay);
        }
    }
}

function OR(a, b, delay) {
    this.table = 
        [      // 0    1    Z    X
                [ 0,   1,   1,   X], // 0 
                [ 1,   1,   1,   1], // 1
                [ 1,   1,   1,   1], // Z
                [ X,   1,   1,   X]  // X
        ];


}

OR.prototype = new Logic();

var NANDtable = 
[      // 0    1    Z    X
        [ 1,   1,   1,   1], // 0 
        [ 1,   0,   0,   X], // 1
        [ 1,   0,   0,   X], // Z
        [ 1,   X,   X,   X]  // X
];


function NAND2(a, b, delay) {
    
    this.value = X;
    this.delay = delay || 0;
    this.a = a;
    this.b = b;
    this.out = { value: X, label: "nand" };

    this.eval = function() {
        var val = NANDtable[this.a.value][this.b.value];
        if(this.value !== val) {
            this.value = val;
            console.log("NAND2:" + this.out.label + " add event to set output to: " + val + " NAND inputs: " + this.a.value + ", " + this.b.value);
            addEvent(this.out, this.value, this.delay);
        } else {
            console.log("NAND2:" + this.out.label + " value " + this.value + ", unchanged, inputs: " + this.a.value + ", " + this.b.value);
        }
    }
}

function NAND() {
    this.value = X;

    this.delay = 0;
    this.inputs = [];
    this.out = { value: X, label: nand };

    for(var i = 0; i < arguments.length; i++) {
        if(typeof arguments[i] === "object" && typeof arguments[i].value !== "undefined") {
            this.inputs.push(arguments[i]);
        } else {
            break;
        }
    }
    
    if(i < arguments.length && typeof arguments[i] === "number") {
        this.delay = arguments[i];
    }

    this.eval = function() {
        var i;

        var val = 0;
        
        for(i = 0; i < this.inputs.length; i++) {
            if(this.inputs[i].value === X) {
                val = X;
            } else if(this.inputs[i].value === 0) {
                val = 1;
                break;
            }
        }

        if(this.value !== val) {
            this.value = val;
            addEvent(this.out, this.value, this.delay);
        } else {
            console.log("NAND value " + this.value + ", unchanged, inputs: ", this.inputs);
        }
    }
}


function CLK(low, high) {
    this.low = low;
    this.high = high || low;
    this.value = X;
    this.out = { value: 0 };
    this.out.label = "clk";
    
    this.eval = function () {
        var val, dt = simulationTime % (this.low + this.high);
        console.log("dt: " + dt + ", current output value: " + this.out.value);
        if(dt === 0) {
            val = 1;
        } else if(dt === this.low) {
            val = 0;
        }
        
        if(this.value !== val) {
            this.value = val;
            console.log("add event to set clock to: " + this.value + " after " + (this.value ? this.high : this.low));
            addEvent(this.out, this.value, this.value ? this.high : this.low);
        } else {
            console.log("CLK value not changed, value: " + this.value);
        }
    }
}

function updateNodes() {
    var changed, rippling, val, i, bail = nodes.length || 1;

    console.log("updateNodes: ", nodes);

    changed = false;

    do {
        rippling = false;
        
        for(i = 0; i < nodes.length; i++) {
            val = nodes[i].eval();
            if(nodes[i].value !== val) {
                console.log("node:" + nodes[i].label + " input: " + nodes[i].inputs[0].value + " has changed from: " + nodes[i].value + ", eval: " + val);
                nodes[i].value = val;
                rippling = true;
            } else {
                console.log("node input: " + nodes[i].inputs[0].value + " has not changed from: " + nodes[i].value + ", eval: " + val);
            }
        }
        changed = rippling || changed;
    } while(rippling && bail--);

    if(!bail) {
        console.log("Simulation error, signal propagation never stabilises");
        process.exit(1);
    }

    return changed;
}

function updateLogic() {
    var i, N;

    N = events.length;

    console.log("update logic");

    for(i = 0; i < logic.length; i++) {
        logic[i].eval();
    }
    
    return N !== events.length;
}

function emitEvents() {
    var event = false;

    printEvents();

    // trigger all events with the same or older timestamp than simulation time
    while(events.length && simulationTime >= events[0].time) {
        event = events.shift();
        console.log("time: " + simulationTime + ", dispatch event: ", event);
        event.node.value = event.value;
    } 


    if(event === false) {
        console.log("no events emitted");
    }

    return event !== false;
}

function updateSimulationTime() {
    if(events.length) {
        simulationTime = events[0].time;
        console.log("Simulation time advanced to: " + simulationTime);
        return true;
    } else {
        return false;
    }
}

var firstPrint = true, lastPrint = 0;

function printStates() {
    var str = "";

    if(firstPrint) {
        for(var i = 0; i <= stateProbes.length; i++) {
            str += (i ? "\t" : "") + ((i==0) ? "time\t" : stateProbes[i-1].name);
        }
        console.log(str);
        firstPrint = false;
        str = "";
    }

    for(var i = 0; i < stateProbes.length; i++) {
        str += (i ? "\t" : "") + stateProbes[i].node.value;
    }


    while(lastPrint < simulationTime) {
        console.log("time: " + ("   " + lastPrint).slice(-3) + "\t" + str);
        lastPrint++;
    }
    console.log("time: " + ("   " + lastPrint).slice(-3) + "\t" + str);    
}

function checkProbes() {
    var i, s;

    printStates();

    for(i = 0; i < stateProbes.length; i++) {
        if(stateProbes[i].states) {
            s = stateProbes[i].states;
            if(s.length === 0 || s[s.length-1].s !== stateProbes[i].node.value) {
                console.log("push simulationTime: " + simulationTime + ", on state: " + stateProbes[i].name);
                s.push({ t: simulationTime, s: stateProbes[i].node.value})
            } 
        }
    }
}

function printTimingDiagram(states, from, to) {
    var i, s, p;
    
    var s = 0;
    
    var str1 = "";
    var str0 = "";

    //console.log("timing for states: ", states);

    p = states[s].s;

    for(i = 0; i < 120; i++) {
        if( (s + 1 < states.length) && states[s+1].t <= i) {
            s++;
        }

//        str1 += (states[s].s === 1) ? "1" : "0";
//        str0 += states[s].s;

        if(states[s].s === X) {
            str1 += " ";
            str0 += "X";
        } else {
            if(states[s].s !== p) {
                if(states[s].s === 1) {
                    str1 += " ";
                    str0 += "/";
                } else {
                    str1 += " ";
                    str0 += "\\";
                }            
            } else {
                if(states[s].s === 1) {
                str1 += "_";
                    str0 += " ";
                } else {
                    str1 += " ";
                    str0 += "_";
                }
            }
        }

        p = states[s].s;
    }

//    console.log("------------------\n");
    console.log(str1);
    console.log(str0);
}


function runSimulation(endtime, cb) {
    var changed, rippling, tmp;
    do {
        changed = false;
        do {
            rippling = updateLogic();
            if(rippling) {
                console.log("logic is rippling");
            }
            tmp = updateNodes();

            if(tmp) {
                console.log("nodes are rippling");
            }

            rippling = tmp || rippling;

            tmp = emitEvents();

            if(tmp) {
                console.log("events emitted");
            }

            rippling = tmp || rippling;

            changed = changed || rippling;
            if(rippling) {
                console.log("logic is rippling");
            }


            if(cb) {
                cb();
            }

        } while(rippling);

        console.log("logic is STABLE");

        checkProbes();

        changed = updateSimulationTime() || changed;

    } while( changed && simulationTime < endtime);
    
}

function addLogic(l) {
    logic.push(l);
}

function addNode(n) {
    nodes.push(n);
}

function addStateProbe(probe, label) {
    stateProbes.push({ node: probe, name: label || probe.label, states: [] });
    return stateProbes[stateProbes.length-1];
}

exports.runSimulation = runSimulation;
exports.addEvent = addEvent;
exports.addLogic = addLogic;
exports.addNode = addNode;
exports.addStateProbe = addStateProbe;
exports.printTimingDiagram = printTimingDiagram;

var ctr = [Node, NAND2, NAND, CLK];

for(i = 0; i < ctr.length; i++) {
    exports[ctr[i].name] = ctr[i];
}

/*
var clock = new CLK(5,5);

var vcc = new Node();
vcc.value = 1;
vcc.inputs.push(vcc);
vcc.label = "vcc";



var data0 = new Node();
data0.label = "data0";

var data1 = new Node();
data1.label = "data1";

var data2 = new Node();
data2.label = "data2";

var gate = new NAND2(data0, data1);

//console.log("add data, simulationTime: " + simulationTime);


var gate3 = new NAND(data0, data1, data2);

logic.push(clock);
logic.push(gate);
logic.push(gate3);

stateProbes.push({ node: data0, name: "data0", states: [] });
stateProbes.push({ node: data1, name: "data1", states: [] });
stateProbes.push({ node: data2, name: "data2", states: [] });
stateProbes.push({ node: gate, name: "gate", states: [] });
stateProbes.push({ node: gate3, name: "gate3", states: [] });
*/



//console.log("got clock: ", clock);
/*
stateProbes.push({ node: clock.out, name: "clk", states: [] });
stateProbes.push({ node: vcc, name: "vcc", states: [] });
stateProbes.push({ node: gate.out, name: "clk&1", states: [] });
stateProbes.push({ node: data, name: "data", states: [] });

console.log("nodes: ", nodes);



//console.log("clock:\n", stateProbes[0]);
//console.log("gate:\n", stateProbes[2]);

console.log("data:\n", stateProbes[3]);

printTimingDiagram(stateProbes[0].states);
printTimingDiagram(stateProbes[1].states);
printTimingDiagram(stateProbes[3].states);
*/

//for(i = 0; i < stateProbes.length; i++) {
//    printTimingDiagram(stateProbes[i].states);
//}