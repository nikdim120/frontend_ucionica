export const IDLE_MS=60_000;
// Long timer gaps (sleep/throttling) never become credited working time.
export function activeSlice(previous,now,lastInput,{visible=true,focused=true,paused=false}={}){
 const end=Math.min(now,lastInput+IDLE_MS);
 return visible&&focused&&!paused&&now-previous<=2000?Math.max(0,end-previous):0;
}
export function formatDuration(ms){
 const seconds=Math.floor(ms/1000);
 return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
}
