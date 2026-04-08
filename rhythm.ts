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
    
    const array = pulses.map(kc=>{
      let rc = r0;

      if (Array.isArray(kc)) {
        rc += Number(kc[1]);
        kc = Number(kc[0]);
      }
      else kc = Number(kc);

      return [kc,rc];
    });

    const result=Array.from({length:steps},(_,i)=>i);
    for(let s=0;s<steps;++s) {
      let ps=0;
      for(let c=0;c<array.length;++c) {
        const [kc,rc]=array[c];

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
    const array = pulses.map(kc=>{
      let rc = r0;

      if (Array.isArray(kc)) {
        rc += Number(kc[1]);
        kc = Number(kc[0]);
      }
      else kc = Number(kc);

      return [kc,rc];
    });

    const result:T[][]=Array.from({length:steps},()=>[]);
    for(let s=0;s<steps;++s) {
      const ps = result[s];
      for(let c=0;c<array.length;++c) {
        const [kc,rc]=array[c];

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

  function* poly_binary(...pulses:(number | [p_n:number,rot_n:number])[]) {
    if (pulses.length===0) return 0;
    const steps=pulses.map(()=>0);
    const array=pulses.map(pulse=>{
      let rotation=0;
      if (!Array.isArray(pulse)) return [Number(pulse),rotation];
      rotation = Number(pulse[1]);
      pulse = Number(pulse[0]);
      return [pulse,rotation%pulse];
    });
    let stepSum=0;
    do {
      stepSum=0;
      let current=0;
      for (let n=0;n<array.length;++n) {
        let [pulse,rotation]=array[n];

        let step=steps[n];
        if (step===rotation) current|=1<<n;
        stepSum+=steps[n]=(step+1)%pulse;
      }
      yield current;
    } while(stepSum);
  }

  function* poly_map<T>(
    callback: (n:number, p_n:number, step:number)=>T,
    ...pulses:(number | [p_n:number,rot_n:number])[]
  ) {
    if (pulses.length===0) return 0;
    const steps=pulses.map(()=>0);
    const array=pulses.map(pulse=>{
      let rotation=0;
      if (!Array.isArray(pulse)) return [Number(pulse),rotation];
      rotation = Number(pulse[1]);
      pulse = Number(pulse[0]);
      return [pulse,rotation%pulse];
    });
    let stepSum=0;
    let count=0;
    do {
      stepSum=0;
      let current:T[]=[];
      for (let n=0;n<array.length;++n) {
        let [pulse,rotation]=array[n];

        let step=steps[n];
        if (step===rotation) current.push(callback(n,pulse,count));
        ++count;
        stepSum+=steps[n]=(step+1)%pulse;
      }
      yield current;
    } while(stepSum);
  }

  const Poly = {
    binary: poly_binary,
    map: poly_map,
  }

  function time_cycle<T>(seconds:number, pattern:T[]) {
    if (seconds<=0) return pattern.map(p=>[0,p]);
    const noteLength=seconds/pattern.length;
    return pattern.map((p,i)=>[i*noteLength,p]);
  }
  const Time = {
    cycle: time_cycle
  }
  return {Euclid, Poly, Time};
})();

