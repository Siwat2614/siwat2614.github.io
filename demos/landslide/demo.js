// Isolated scenarios; no network or physical device commands are used.
(() => {
  window.demoScenario='normal';
  const fixtures={
    normal:{risk_level:'NORMAL',soil_moisture:35,soil_raw:710,temperature:28,humidity:65,distance:12.0,movement_cm:0,movement:false,rain:false,vibration:false},
    warning:{risk_level:'WARNING',soil_moisture:65,soil_raw:470,temperature:27,humidity:78,distance:12.0,movement_cm:0,movement:false,rain:true,vibration:false},
    danger:{risk_level:'DANGER',soil_moisture:85,soil_raw:290,temperature:26,humidity:88,distance:9.5,movement_cm:2.5,movement:true,rain:true,vibration:true},
    offline:{risk_level:'UNKNOWN',soil_moisture:35,soil_raw:710,temperature:28,humidity:65,distance:12.0,movement_cm:0,movement:false,rain:false,vibration:false}
  };
  window.fetch=async (input,options={})=>{
    const path=new URL(typeof input==='string'?input:input.url,location.href).pathname,json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json'}});
    if((options.method||'GET').toUpperCase()!=='GET')return json({error:'Commands disabled in demo'},403);
    const mode=window.demoScenario||'normal',offline=mode==='offline',current=fixtures[mode]||fixtures.normal;
    if(path==='/api/latest')return json({...current,timestamp:'2026-11-01T03:00:00Z'});
    if(path==='/api/device-status')return json({online:!offline,age_seconds:offline?null:0,sensors:{soil:offline?'UNKNOWN':'OK',rain:offline?'UNKNOWN':'OK',vibration:offline?'UNKNOWN':'OK',dht11:offline?'UNKNOWN':'OK',hc_sr04:offline?'UNKNOWN':'OK'}});
    if(path==='/health')return json({mqtt:'disconnected'});
    if(path==='/api/events')return json([{timestamp:'2026-11-01T03:00:00Z',type:'SIMULATED SAMPLE',risk_level:current.risk_level}]);
    return json({error:'Unavailable in demo'},404);
  };
})();
