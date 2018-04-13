"undefined"==typeof require&&(require=function(t){console.log(t+" is required.")});var math=math||require("mathjs"),randomString=function(t){t=t||17;var a="",i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";a+=i.charAt(Math.floor(Math.random()*i.length)),i+="0123456789";for(var r=0;r<t;r++)a+=i.charAt(Math.floor(Math.random()*i.length));return a};function formatComplex(t){var a=math.round(t.re,8),i=math.round(t.im,8);return a+(i>=0?"+":"-")+math.abs(i)+"i"}var zeroesMatrix=function(t){for(var a=[],i=0;i<t;i++){a[i]=[];for(var r=0;r<t;r++)a[i][r]=0}return a},identityMatrix=function(t){for(var a=[],i=0;i<t;i++){a[i]=[];for(var r=0;r<t;r++)a[i][r]=r==i?1:0}return a},makeControlled=function(t){for(var a=t.length,i=identityMatrix(2*a),r=0;r<a;r++)for(var s=0;s<a;s++)i[r+a][s+a]=t[r][s];return i},basicGates={id:[[1,0],[0,1]],x:[[0,1],[1,0]],y:[[0,math.multiply(-1,math.i)],[math.i,0]],z:[[1,0],[0,-1]],h:[[1/math.sqrt(2),1/math.sqrt(2)],[1/math.sqrt(2),0-1/math.sqrt(2)]],srn:[[1/math.sqrt(2),0-1/math.sqrt(2)],[1/math.sqrt(2),1/math.sqrt(2)]],so:[[1,0],[0,math.pow(math.e,math.multiply(math.i,math.PI/2))]],s:[[1,0],[0,math.i]],ss:[[1,0],[0,math.multiply(-1,math.i)]],t:[[1,0],[0,math.pow(math.e,math.multiply(math.i,math.PI/4))]],ts:[[1,0],[0,math.multiply(-1,math.pow(math.e,math.multiply(math.i,math.PI/4)))]],r2:[[1,0],[0,math.pow(math.e,math.multiply(math.i,math.PI/2))]],r4:[[1,0],[0,math.pow(math.e,math.multiply(math.i,math.PI/4))]],r8:[[1,0],[0,math.pow(math.e,math.multiply(math.i,math.PI/8))]],swap:[[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]],srswap:[[1,0,0,0],[0,math.multiply(.5,math.add(1,math.i)),math.multiply(.5,math.subtract(1,math.i)),0],[0,math.multiply(.5,math.subtract(1,math.i)),math.multiply(.5,math.add(1,math.i)),0],[0,0,0,1]]};basicGates.cx=makeControlled(basicGates.x),basicGates.cy=makeControlled(basicGates.y),basicGates.cz=makeControlled(basicGates.z),basicGates.ch=makeControlled(basicGates.h),basicGates.csrn=makeControlled(basicGates.srn),basicGates.cs=makeControlled(basicGates.s),basicGates.cr2=makeControlled(basicGates.r2),basicGates.cr4=makeControlled(basicGates.r4),basicGates.cr8=makeControlled(basicGates.r8);var QuantumCircuit=function(t){this.init(t)};QuantumCircuit.prototype.init=function(t){this.numQubits=t||1,this.customGates={},this.clear()},QuantumCircuit.prototype.numAmplitudes=function(){return math.pow(2,this.numQubits)},QuantumCircuit.prototype.resetState=function(){this.state=[],this.resetTransform()},QuantumCircuit.prototype.initState=function(){this.resetState(),this.state.push(math.complex(1,0));for(var t=this.numAmplitudes(),a=1;a<t;a++)this.state.push(math.complex(0,0));this.initTransform()},QuantumCircuit.prototype.resetTransform=function(){this.T=[]},QuantumCircuit.prototype.initTransform=function(){this.resetTransform();for(var t=math.pow(2,this.numQubits),a=0;a<t;a++){this.T[a]=[];for(var i=0;i<t;i++)this.T[a][i]=0}},QuantumCircuit.prototype.clear=function(){this.gates=[];for(var t=0;t<this.numQubits;t++)this.gates.push([]);this.resetState()},QuantumCircuit.prototype.numCols=function(){return this.gates.length?this.gates[0].length:0},QuantumCircuit.prototype.addGate=function(t,a,i){var r=[];if(Array.isArray(i))for(var s=0;s<i.length;s++)r.push(i[s]);else r.push(i);for(var e=r.length,n=randomString(),u=0;u<e;u++){var o=r[u];for(o+1>this.numQubits&&(this.numQubits=o+1);this.gates.length<this.numQubits;)this.gates.push([]);var h=this.numCols();a+1>h&&(h=a+1);for(s=0;s<this.gates.length;s++)for(;this.gates[s].length<h;)this.gates[s].push(null);var m={id:n,name:t.toLowerCase(),connector:u};this.gates[o][a]=m}},QuantumCircuit.prototype.removeGate=function(t,a){if(this.gates[a]){var i=this.gates[a][t];if(i){var r=i.id,s=this.gates[0].length;for(a=0;a<s;a++)this.gates[a][t].id==r&&(this.gates[a][t]=null)}}},QuantumCircuit.prototype.createTransform=function(t,a){this.initTransform();var i=[];a=a.slice(0);for(var r=0;r<a.length;r++)a[r]=this.numQubits-1-a[r];a.reverse();for(r=0;r<this.numQubits;r++)-1==a.indexOf(r)&&i.push(r);var s=math.pow(2,this.numQubits);for(r=s;r--;)for(var e=s;e--;){for(var n=!0,u=i.length;u--;)if((r&1<<i[u])!=(e&1<<i[u])){n=!1;break}if(n){var o=0,h=0;for(u=a.length;u--;){var m=a[u];o|=(r&1<<m)>>m<<u,h|=(e&1<<m)>>m<<u}this.T[r][e]=t[o][h]}}},QuantumCircuit.prototype.applyGate=function(t,a){var i=basicGates[t.toLowerCase()];i?(this.createTransform(i,a),this.state=math.multiply(this.T,this.state)):console.log('Unknown gate "'+t+'".')},QuantumCircuit.prototype.decompose=function(t){if(!t.gates.length)return t;function a(t,a,i){return t.slice(0,i).concat(a).concat(t.slice(i))}for(var i=0;i<t.gates[0].length;i++)for(var r=0;r<t.numQubits;r++){var s=t.gates[r][i];if(s&&0==s.connector&&!basicGates[s.name]){var e=new QuantumCircuit,n=t.customGates[s.name];if(n){e.load(n);for(var u=e.save(!0),o=[],h=0;h<u.gates[0].length-1;h++)o.push(null);for(var m=0;m<t.numQubits;m++){var c=t.gates[m][i];c&&c.id==s.id?(t.gates[m].splice(i,1),t.gates[m]=a(t.gates[m],u.gates[c.connector],i)):t.gates[m]=a(t.gates[m],o,i+1)}}}}return t.customGates=[],t},QuantumCircuit.prototype.save=function(t){var a={numQubits:this.numQubits,gates:JSON.parse(JSON.stringify(this.gates)),customGates:JSON.parse(JSON.stringify(this.customGates))};return t?this.decompose(a):a},QuantumCircuit.prototype.load=function(t){this.numQubits=t.numQubits||1,this.clear(),this.gates=JSON.parse(JSON.stringify(t.gates)),this.customGates=JSON.parse(JSON.stringify(t.customGates))},QuantumCircuit.prototype.registerGate=function(t,a){this.customGates[t]=a},QuantumCircuit.prototype.getGateAt=function(t,a){if(!this.gates[a])return null;var i=JSON.parse(JSON.stringify(this.gates[a][t]));if(!i)return null;i.wires=[];var r=i.id,s=this.gates.length;for(a=0;a<s;a++){var e=this.gates[a][t];e&&e.id==r&&(i.wires[e.connector]=a)}return i},QuantumCircuit.prototype.run=function(t){if(this.initState(),t)for(var a=0;a<this.numQubits;a++)t[a]&&this.applyGate("x",[a]);var i=new QuantumCircuit;i.load(this.save(!0));for(var r=i.numCols(),s=0;s<r;s++)for(a=0;a<this.numQubits;a++){var e=i.getGateAt(s,a);e&&0==e.connector&&this.applyGate(e.name,e.wires)}},QuantumCircuit.prototype.stateAsString=function(){var t=this.numAmplitudes();if(!this.state||this.state.length<t)return"Error: circuit is not initialized. Please call initState() or run() method.";for(var a="",i=0;i<t;i++){i&&(a+="\n");for(var r=math.round(100*math.pow(math.abs(this.state[i]),2),2),s=i.toString(2);s.length<this.numQubits;)s="0"+s;a+=formatComplex(this.state[i])+"|"+s+"> "+r+"%"}return a},QuantumCircuit.prototype.getState=function(){var t=this.numAmplitudes();if(!this.state||this.state.length<t)return"Error: circuit is not initialized. Please call initState() or run() method.";for(var a="",i=0;i<t;i++){for(var r=math.round(100*math.pow(math.abs(this.state[i]),2),2),s=i.toString(2);s.length<this.numQubits;)s="0"+s;a+=" "+s+":"+r+"%"}return a},QuantumCircuit.prototype.print=function(){console.log(this.stateAsString())},"undefined"!=typeof module&&module.exports&&(module.exports=QuantumCircuit);