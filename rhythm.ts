
const Rhythm = (function(){
  function euclid_pulse(
    steps:number,
    pulses:number,
    step_n:number,
    rotation=0
  ) {
    return ((step_n + rotation) * pulses) % steps < pulses;
  }

  function euclid_binary(
    steps: number | [steps:number,rot_0:number],
    ...pulses: (number | [p:number,rot_p:number])[]
  ) {
    if (steps===0) return [];

    let r0=0;
    if (Array.isArray(steps)) {
      r0=Number(steps[1]);
      steps=Number(steps[0]);
    }
    else
      steps=Number(steps);

    const reverse=steps<0;
    steps=Math.abs(steps);
    const result=Array.from({length:steps},(_,i)=>i);
    for(let s=0;s<steps;++s) {
      let ps=0;
      for(let c=0;c<pulses.length;++c) {
        let kc= pulses[c];
        let rc = r0;

        if (Array.isArray(kc)) {
          rc += Number(kc[1]);
          kc = Number(kc[0]);
        }
        else kc = Number(kc);

        ps |= euclid_pulse(steps,kc,s,rc) ? (1<<c) : 0;
      }
      result[s]=ps;
    }
    if (reverse) result.reverse();

    return result;
  }

  function euclid_map<T>(
    callback: (pulse:number, step:number, rot: number)=>T,
    steps: number | [steps:number,rot_0:number],
    ...pulses: (number | [p:number,rot_p:number])[]
  ) {
    if (steps===0) return [];

    let r0=0;
    if (Array.isArray(steps)) {
      r0=Number(steps[1]);
      steps=Number(steps[0]);
    }
    else
      steps=Number(steps);

    const reverse=steps<0;
    steps=Math.abs(steps);
    const result:T[][]=Array.from({length:steps},()=>[]);
    for(let s=0;s<steps;++s) {
      const ps = result[s];
      for(let c=0;c<pulses.length;++c) {
        let kc= pulses[c];
        let rc = r0;

        if (Array.isArray(kc)) {
          rc += Number(kc[1]);
          kc = Number(kc[0]);
        }
        else kc = Number(kc);

        if (euclid_pulse(steps,kc,s,rc)) ps.push(callback(kc, s, rc));
      }
      result[s]=ps;
    }
    if (reverse) result.reverse();

    return result;
  }
  
  const Euclid = {
    binary: euclid_binary,
    map: euclid_map,
    pulse: euclid_pulse,
  }

  return {Euclid};
})();
