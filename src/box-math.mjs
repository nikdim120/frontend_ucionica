export function boxDimensions(width,padding,border,margin,mode){
 const edge=2*(padding+border);
 const painted=mode==='border-box'?Math.max(width,edge):width+edge;
 return {content:painted-edge,painted,occupied:painted+2*margin};
}
