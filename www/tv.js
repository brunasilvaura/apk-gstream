/* Navegação por controle remoto (TV / TV box), teclado e arrastar com mouse. Toque continua igual. */
(()=>{
const D=document,B=D.body,$=i=>D.getElementById(i);
const DIR={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',38:'u',40:'d',37:'l',39:'r',19:'u',20:'d',21:'l',22:'r'};
const SEL='button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])';
const scope=()=>$('upd')||$('pl')||$('ov')||B;
const vis=el=>{const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const s=getComputedStyle(el);if(s.visibility=='hidden'||s.display=='none')return false;
  const p=el.closest('.wh');if(p&&p.closest('.hid'))return false;return true};
const cands=()=>{const sc=scope();let L=[...sc.querySelectorAll(SEL)];if(sc.id=='pl'){const f=sc.querySelector('iframe');if(f)L.push(f)}return L.filter(vis)};
function focusEl(el){try{el.focus({preventScroll:true})}catch(e){el.focus()}try{el.scrollIntoView({block:'center',inline:'center',behavior:'smooth'})}catch(e){}}
const scroller=el=>{for(let n=el;n&&n!==B;n=n.parentElement){const s=getComputedStyle(n);if(/(auto|scroll)/.test(s.overflowY)&&n.scrollHeight>n.clientHeight+2)return n}return D.scrollingElement||D.documentElement};

/* marca modo "controle" na primeira tecla; toque desliga */
const NAVK=e=>DIR[e.key]||DIR[e.keyCode]||e.key=='Enter'||e.keyCode==23||e.key=='Tab';
addEventListener('keydown',e=>{if(NAVK(e))B.classList.add('kb')},true);
addEventListener('touchstart',()=>B.classList.remove('kb'),{passive:true});

/* cartões viram focáveis */
let raf=0;const mk=()=>{raf=0;D.querySelectorAll('.c:not([tabindex])').forEach(c=>c.tabIndex=0)};
new MutationObserver(()=>{if(!raf)raf=requestAnimationFrame(mk)}).observe(B,{childList:true,subtree:true});mk();

function move(d){
 const cur=D.activeElement,L=cands();if(!L.length)return false;
 const inList=cur&&L.includes(cur);
 if(!inList){const vh=innerHeight,f=L.find(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=vh})||L[0];focusEl(f);return true}
 const a=cur.getBoundingClientRect(),fx=(a.left+a.right)/2,fy=(a.top+a.bottom)/2;let best=null,bs=1e18;
 for(const el of L){if(el===cur)continue;const r=el.getBoundingClientRect(),cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;let m,c;
  if(d=='r'){m=cx-fx;c=Math.abs(cy-fy);if(r.left<a.right-2&&m<=4)continue;if(m<=4)continue}
  else if(d=='l'){m=fx-cx;c=Math.abs(cy-fy);if(m<=4)continue}
  else if(d=='d'){m=cy-fy;c=Math.abs(cx-fx);if(m<=4)continue}
  else{m=fy-cy;c=Math.abs(cx-fx);if(m<=4)continue}
  const s=m+c*(d=='l'||d=='r'?3:2);if(s<bs){bs=s;best=el}}
 if(best){focusEl(best);return true}
 /* nada naquela direção: rola a tela / a faixa */
 if(d=='d'||d=='u'){const s=scroller(cur),k=(d=='d'?1:-1)*Math.round(innerHeight*.6),b=s.scrollTop;s.scrollBy({top:k,behavior:'smooth'});return true}
 const rl=cur.closest&&cur.closest('.rail.hz');if(rl){rl.scrollBy({left:(d=='r'?1:-1)*Math.round(rl.clientWidth*.6),behavior:'smooth'});return true}
 return false}

function back(){
 const pl=$('pl'),ov=$('ov');if($('upd'))return false;
 const click=s=>{const b=(pl||ov).querySelector(s);if(b)b.click()};
 if(pl){const a=D.activeElement;
  if(a&&a.tagName=='IFRAME'){a.blur();const f=pl.querySelector('.wb.f');if(window.barra)barra(5000);if(f)f.focus();return true}
  if(pl.classList.contains('sheet')){click('[data-a=eps]');return true}
  if(pl.classList.contains('big')){click('[data-a=big]');return true}
  click('[data-a=close]');return true}
 if(ov){click('[data-a=closedet]');return true}
 return false}

addEventListener('keydown',e=>{
 const t=e.target,tag=t&&t.tagName,typing=(tag=='INPUT'&&!/^(button|checkbox|radio)$/.test(t.type))||tag=='TEXTAREA';
 const d=DIR[e.key]||DIR[e.keyCode];
 const pl=$('pl');
 if(pl&&(d||e.key=='Enter')&&pl.classList.contains('hid')&&tag!='IFRAME'){if(window.barra)barra(3500);const f=pl.querySelector('.wb.f');if(f)f.focus();e.preventDefault();return}
 if(pl&&pl.classList.contains('big')&&window.barra&&!pl.classList.contains('sheet'))barra(3500);
 if(d){
  if(typing&&(d=='l'||d=='r'))return;
  if(tag=='IFRAME')return;
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if(move(d))e.preventDefault();return}
 if((e.key=='Enter'||e.key==' '||e.keyCode==23)&&t&&!/^(BUTTON|A|INPUT|SELECT|TEXTAREA|IFRAME)$/.test(tag)&&t.matches&&t.matches('[tabindex]')){e.preventDefault();t.click();return}
 if((e.key=='Escape'||e.key=='GoBack'||(e.key=='Backspace'&&!typing))&&back())e.preventDefault()},true);

/* botão VOLTAR do Android (e do navegador) */
let pushed=false,ign=false;
const count=()=>['upd','pl','ov'].filter(i=>$(i)).length;
function sync(){const n=count();if(n&&!pushed){try{history.pushState({tv:1},'')}catch(e){}pushed=true}else if(!n&&pushed){pushed=false;ign=true;try{history.back()}catch(e){ign=false}}}
addEventListener('popstate',()=>{if(ign){ign=false;return}pushed=false;back();sync()});
new MutationObserver(()=>{sync();const pl=$('pl');if(pl&&!pl._tv){pl._tv=1;const f=pl.querySelector('.wb.f');
  if(f){const b=D.createElement('button');b.className='wb ctl';b.dataset.tv='ctl';b.textContent='🎮 Controlar vídeo';f.parentNode.insertBefore(b,f)}
  if(B.classList.contains('kb')){const h=D.createElement('div');h.className='tvhint';h.textContent='Aperte VOLTAR no controle para abrir o menu do vídeo';B.appendChild(h);setTimeout(()=>h.remove(),5000)}}}).observe(B,{childList:true});
D.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-tv=ctl]');if(b){const f=$('pl')&&$('pl').querySelector('iframe');if(f)f.focus()}});

/* arrastar com o mouse (ou controle com ponteiro): rola para os lados e para baixo/cima */
let dr=null,sup=false;
D.addEventListener('pointerdown',e=>{if(e.pointerType!='mouse'||e.button||e.target.closest('input,select,textarea,.key,iframe'))return;
 dr={x:e.clientX,y:e.clientY,r:e.target.closest('.rail.hz'),s:scroller(e.target),m:false};dr.sx=dr.r?dr.r.scrollLeft:0;dr.sy=dr.s.scrollTop});
addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;
 if(!dr.m&&Math.abs(dx)+Math.abs(dy)>8){dr.m=true;if(dr.r)dr.r.style.scrollSnapType='none'}
 if(dr.m){if(dr.r)dr.r.scrollLeft=dr.sx-dx;dr.s.scrollTop=dr.sy-dy;getSelection().removeAllRanges()}});
addEventListener('pointerup',()=>{if(!dr)return;const m=dr.m;if(dr.r)dr.r.style.scrollSnapType='';dr=null;if(m){sup=true;setTimeout(()=>sup=false,0)}});
D.addEventListener('click',e=>{if(sup){e.stopPropagation();e.preventDefault()}},true);
D.addEventListener('dragstart',e=>{if(e.target.tagName=='IMG')e.preventDefault()});
})();
