/* SLIDEVERSE main — theme, filters, favorites, recents, preview, code viewer. Vanilla JS, no deps. */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S=window.SLIDERS,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let favs=store.get('sv-favs',[]),recent=store.get('sv-recent',[]),state={q:'',cat:'All',tech:'All',page:1};
const PAGE_SIZE=12;
const REPO='https://github.com/adnanalamin/SLIDEVERSE';
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1800)}

/* theme */
$('#themeBtn').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('sv-theme',n)}catch(e){}};
/* header + mobile menu */
const hdr=$('#hdr'),nav=$('#nav'),mb=$('#menuBtn');
addEventListener('scroll',()=>hdr.classList.toggle('on',scrollY>8),{passive:true});
mb.onclick=()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕':'☰'};
$$('a',nav).forEach(a=>a.onclick=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded',false);mb.textContent='☰'});

/* ticker */
const words=['DESIGN','DEVELOP','ANIMATE','EXPLORE'];
$('.tk').innerHTML=[0,1].map(()=>[0,1].map(()=>words.map(w=>`<span>${w}</span><em>✦</em>`).join('')).join('')).join('');

/* static sections rendered from data */
const catDesc={Minimal:'Clean and quiet',Modern:'Current patterns','3D':'Depth and perspective',Glass:'Frosted surfaces',Gallery:'Image-first',Product:'Showcase items',Cards:'Card-based layouts',Hero:'Full-width openers',Creative:'Expressive motion',Experimental:'Unusual ideas'};
const catMap={Glass:'Glassmorphism',Gallery:'Image Gallery',Cards:'Card'};
const grads=['#8B6CFF,#65E3D9','#ff6a88,#8B6CFF','#65E3D9,#3a5bff','#ffb86c,#ff4d8d','#8B6CFF,#171B29'];
$('#cats').innerHTML=Object.keys(catDesc).map((c,i)=>`<button class="cat rv" data-cat="${catMap[c]||c}"><div class="v" style="background:linear-gradient(120deg,${grads[i%5]})"></div><div class="t"><b>${c} <i>→</i></b><small>${catDesc[c]}</small></div></button>`).join('');
$$('.cat').forEach(b=>b.onclick=()=>{state.cat=b.dataset.cat;state.tech='All';state.page=1;syncChips();render();$('#explore').scrollIntoView()});
const feats=[['▶','Live previews','Open any slider in a full preview before you copy a line.'],['</>','Developer friendly','Plain files and readable code you can drop into a project.'],['⇔','Responsive by design','Every component adapts from phone to desktop.'],['☝','Touch & swipe','Swipe gestures work on touch screens.'],['⌨','Keyboard accessible','Arrow keys, Escape and visible focus states.'],['◌','Reduced motion','Animations calm down when your system asks.'],['❖','Reusable components','One data entry per slider keeps the library easy to grow.'],['♡','Open source','MIT licensed and built in public.']];
$('#feats').innerHTML=feats.map(f=>`<article class="feat rv"><div class="ic">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p></article>`).join('');
const fws=[['H','HTML','Semantic markup for every slider.'],['C','CSS','Transforms and transitions, no libraries.'],['JS','JavaScript','Small vanilla scripts.'],['Re','React','Coming soon'],['Tw','Tailwind CSS','Growing collection'],['Bs','Bootstrap','Growing collection']];
const fwTech={HTML:'HTML / CSS / JavaScript',CSS:'HTML / CSS / JavaScript',JavaScript:'HTML / CSS / JavaScript',React:'React','Tailwind CSS':'Tailwind CSS',Bootstrap:'Bootstrap'};
$('#fw').innerHTML=fws.map(f=>`<article class="fwc rv"><div class="lg">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p><small>Growing collection</small><button class="btn sm ghost" data-tech="${fwTech[f[1]]}">Explore</button></article>`).join('');
$$('[data-tech]').forEach(b=>b.onclick=()=>{state.tech=b.dataset.tech;state.cat='All';state.page=1;syncChips();render();$('#explore').scrollIntoView()});

/* filters */
const cats=['All','Favorites',...CATEGORIES],techs=['All',...TECHS,'Vue','Next.js','Svelte'],later=['Vue','Next.js','Svelte'];
$('#catChips').innerHTML=cats.map(c=>`<button class="chip" data-v="${c}" aria-pressed="false">${c==='Favorites'?'♥ Favorites':c}</button>`).join('');
$('#techChips').innerHTML=techs.map(c=>`<button class="chip" data-t="${c}" aria-pressed="false" ${later.includes(c)?'disabled title="Coming later"':''}>${c}</button>`).join('');
$$('#catChips .chip').forEach(b=>b.onclick=()=>{state.cat=b.dataset.v;state.page=1;syncChips();render()});
$$('#techChips .chip').forEach(b=>b.onclick=()=>{state.tech=b.dataset.t;state.page=1;syncChips();render()});
function syncChips(){$$('#catChips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===state.cat));$$('#techChips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===state.tech))}
$('#q').oninput=e=>{state.q=e.target.value.trim().toLowerCase();state.page=1;render()};
$('#reset').onclick=()=>{state={q:'',cat:'All',tech:'All',page:1};$('#q').value='';syncChips();render()};

/* cards */
/* component links: a slider with a demo folder gets a Live Demo link (relative, GitHub Pages safe) and its own GitHub folder */
const folderOf=s=>s.demo?String(s.demo).replace(/^\.?\/+|\/+$/g,''):'';
const ghUrl=s=>folderOf(s)?`${REPO}/tree/main/${encodeURI(folderOf(s))}`:`${REPO}/tree/main/components`;
const demoLink=s=>folderOf(s)?`<a class="btn sm" href="${encodeURI(folderOf(s))}/" target="_blank" rel="noopener" aria-label="Live demo: ${esc(s.title)}">Live Demo ↗</a>`:'';
function card(s){const f=favs.includes(s.id);return `<article class="card" data-id="${s.id}">
<div class="thumb ${s.kind}" style="background:${s.slides[0][2]}"><button class="fav" aria-pressed="${f}" aria-label="${f?'Remove from':'Add to'} favorites: ${esc(s.title)}">${f?'♥':'♡'}</button><b>${esc(s.slides[0][0])}</b><span>${esc(s.slides[0][1])}</span></div>
<div class="cb"><span class="num">SLIDE / ${s.id}</span><h3>${esc(s.title)}</h3><p class="meta">${esc(s.category)} · ${esc(s.technologies.join(', '))}</p><p>${esc(s.description)}</p>
<div class="tags">${s.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
<div class="acts"><button class="btn sm" data-act="pv">Preview ↗</button><button class="btn sm ghost" data-act="cd">View Code ↗</button>${demoLink(s)}<a class="btn sm ghost" href="${ghUrl(s)}" target="_blank" rel="noopener">GitHub ↗</a></div></div></article>`}
function getFiltered(){
 return S.filter(s=>{const hay=[s.title,s.category,s.technologies.join(' '),s.tags.join(' '),s.description].join(' ').toLowerCase();
  return(!state.q||hay.includes(state.q))&&(state.cat==='All'||(state.cat==='Favorites'?favs.includes(s.id):s.category===state.cat||s.tags.includes(state.cat)))&&(state.tech==='All'||s.technologies.includes(state.tech))});
}
function renderPagination(total){
 const nav=$('#pagination');
 if(!nav)return;
 const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
 if(state.page>pages)state.page=pages;
 if(total<=PAGE_SIZE){nav.innerHTML='';nav.hidden=true;return}
 nav.hidden=false;
 const make=(label,page,disabled=false,current=false)=>`<button class="page-btn" type="button" data-page="${page}" ${disabled?'disabled':''} ${current?'aria-current="true"':''} aria-label="${label}">${label}</button>`;
 let out=make('←',Math.max(1,state.page-1),state.page===1);
 const addPage=p=>{out+=make(String(p),p,false,p===state.page)};
 if(pages<=7){
   for(let p=1;p<=pages;p++)addPage(p);
 }else{
   addPage(1);
   if(state.page>4)out+='<span class="page-ellipsis">…</span>';
   const start=Math.max(2,state.page-1),end=Math.min(pages-1,state.page+1);
   for(let p=start;p<=end;p++)addPage(p);
   if(state.page<pages-3)out+='<span class="page-ellipsis">…</span>';
   addPage(pages);
 }
 out+=make('→',Math.min(pages,state.page+1),state.page===pages);
 nav.innerHTML=out;
}
function render(){
 const list=getFiltered();
 const pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
 if(state.page>pages)state.page=pages;
 const start=(state.page-1)*PAGE_SIZE;
 const visible=list.slice(start,start+PAGE_SIZE);
 $('#grid').innerHTML=visible.map(card).join('');$('#grid').hidden=!visible.length;$('#empty').hidden=!!list.length;
 $('#count').textContent=list.length?`Showing ${start+1}–${Math.min(start+visible.length,list.length)} of ${list.length} matching components`:`Showing 0 of ${S.length} components`;
 renderPagination(list.length);
 if(!list.length){const nf=state.cat==='Favorites'&&!state.q;$('#emptyT').textContent=nf?'No favorites yet':'No sliders found';$('#emptyP').textContent=nf?'Tap the heart on any slider to save it here.':'Try another keyword or category.'}
 renderRecent();
}
$('#pagination').onclick=e=>{
 const b=e.target.closest('[data-page]');if(!b||b.disabled)return;
 state.page=Number(b.dataset.page);render();
 document.getElementById('explore').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
};
function renderRecent(){const l=recent.map(id=>S.find(s=>s.id===id)).filter(Boolean);$('#recent').innerHTML=l.map(card).join('');$('#recentEmpty').hidden=!!l.length}
document.addEventListener('click',e=>{
 const c=e.target.closest('.card');if(!c)return;const s=S.find(x=>x.id===c.dataset.id);
 if(e.target.closest('.fav')){favs=favs.includes(s.id)?favs.filter(i=>i!==s.id):[...favs,s.id];store.set('sv-favs',favs);const b=e.target.closest('.fav');render();const nb=$(`.card[data-id="${s.id}"] .fav`);nb&&(nb.classList.add('pop'));return}
 const a=e.target.closest('[data-act]');if(a)a.dataset.act==='pv'?openPreview(s,a):openCode(s,a)});

/* modals (focus trap, restore focus) */
let lastFocus=null,openM=null;
function openModal(m,t){lastFocus=t||document.activeElement;m.hidden=false;openM=m;document.body.style.overflow='hidden';(m.querySelector('[data-close]')).focus()}
function closeModal(){if(!openM)return;if(document.fullscreenElement)document.exitFullscreen();stopAuto();openM.hidden=true;openM=null;document.body.style.overflow='';lastFocus&&lastFocus.focus&&lastFocus.focus()}
$$('.modal').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))closeModal()})});
function addRecent(id){recent=[id,...recent.filter(i=>i!==id)].slice(0,6);store.set('sv-recent',recent);renderRecent()}

/* preview slider */
let cur=null,idx=0,timer=null,auto=true;
const vp=$('#vp');
function openPreview(s,t){cur=s;idx=0;auto=!reduce;$('#pvT').textContent=s.title;
 vp.className='vp k-'+s.kind;vp.setAttribute('aria-label',s.title);
 vp.innerHTML=s.slides.map((x,i)=>`<div class="sl" role="group" aria-roledescription="slide" aria-label="${i+1} of ${s.slides.length}" style="background:${x[2]}"><h4>${esc(x[0])}</h4><p>${esc(x[1])}</p></div>`).join('');
 $('#dots').innerHTML=s.slides.map((_,i)=>`<button aria-label="Go to slide ${i+1}" data-i="${i}"></button>`).join('');
 go(0);syncAuto();openModal($('#pv'),t);addRecent(s.id);if(auto)startAuto()}
function go(i){const n=cur.slides.length;idx=(i+n)%n;$$('.sl',vp).forEach((el,k)=>{el.classList.toggle('on',k===idx);el.setAttribute('aria-hidden',k!==idx)});$$('#dots button').forEach((b,k)=>b.setAttribute('aria-current',k===idx))}
function startAuto(){stopAuto();timer=setInterval(()=>go(idx+1),3500)}function stopAuto(){clearInterval(timer);timer=null}
function syncAuto(){const b=$('#pvAuto');b.textContent=auto?'Pause':'Play';b.setAttribute('aria-pressed',auto)}
$('#pvPrev').onclick=()=>{go(idx-1);auto&&startAuto()};$('#pvNext').onclick=()=>{go(idx+1);auto&&startAuto()};
$('#dots').onclick=e=>{const b=e.target.closest('[data-i]');b&&go(+b.dataset.i)};
$('#pvAuto').onclick=()=>{auto=!auto;auto?startAuto():stopAuto();syncAuto()};
$('#pvFs').onclick=()=>{const b=$('#pvBox');document.fullscreenElement?document.exitFullscreen():b.requestFullscreen?b.requestFullscreen().catch(()=>toast('Fullscreen is not available')):toast('Fullscreen is not available')};
let sx=null;vp.addEventListener('pointerdown',e=>sx=e.clientX);vp.addEventListener('pointerup',e=>{if(sx===null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>40){go(idx+(d<0?1:-1));auto&&startAuto()}});
vp.addEventListener('pointermove',e=>{const r=vp.getBoundingClientRect();vp.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(2));vp.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(2))});

/* code viewer: only tabs that exist (HTML, CSS, JavaScript) */
function codeFor(s){const k='.sv-'+s.kind;return{
HTML:`<div class="sv ${'sv-'+s.kind}" id="slider">\n${s.slides.map((x,i)=>`  <div class="sv-slide${i?'':' is-active'}" style="background:${x[2]}">\n    <h2>${x[0]}</h2>\n    <p>${x[1]}</p>\n  </div>`).join('\n')}\n</div>\n<button id="prev">Prev</button> <button id="next">Next</button>`,
CSS:`.sv{position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:16px}\n.sv-slide{position:absolute;inset:0;padding:48px;color:#fff;opacity:0;transition:opacity .6s,transform .7s cubic-bezier(.22,1,.36,1);${{minimal:'transform:translateX(8%);',motion:'transform:translateX(30%) scale(.9);',threed:'transform:rotateY(55deg) translateZ(-120px);',glass:'transform:scale(1.04);',gallery:'transform:scale(1.12);',product:'transform:translateY(16px);',type:'transform:translateY(40px);',parallax:'transform:scale(1.1);'}[s.kind]}}\n${s.kind==='threed'?'.sv{perspective:1000px}\n':''}.sv-slide.is-active{opacity:1;transform:none}\n@media (prefers-reduced-motion:reduce){.sv-slide{transition:none}}`,
JavaScript:`const slides=[...document.querySelectorAll('#slider .sv-slide')];\nlet i=0;\nconst show=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('is-active',k===i))};\ndocument.getElementById('next').onclick=()=>show(i+1);\ndocument.getElementById('prev').onclick=()=>show(i-1);\naddEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1);if(e.key==='ArrowLeft')show(i-1)});`}}
let codes={},tab='HTML';
function openCode(s,t){codes=codeFor(s);$('#cdT').textContent=s.title+' — source';tab='HTML';
 $('#tabs').innerHTML=Object.keys(codes).map(k=>`<button class="chip" role="tab" data-k="${k}">${k}</button>`).join('');showTab();openModal($('#cd'),t);addRecent(s.id)}
function showTab(){$$('#tabs .chip').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.k===tab);b.setAttribute('aria-selected',b.dataset.k===tab)});$('#codeOut code').textContent=codes[tab]}
$('#tabs').onclick=e=>{const b=e.target.closest('[data-k]');if(b){tab=b.dataset.k;showTab()}};
$('#copy').onclick=async()=>{const b=$('#copy');try{await navigator.clipboard.writeText(codes[tab])}catch(e){const r=document.createRange();r.selectNodeContents($('#codeOut code'));getSelection().removeAllRanges();getSelection().addRange(r);try{document.execCommand('copy')}catch(_){}}
 b.textContent='Copied!';b.classList.add('pop');toast('Copied!');setTimeout(()=>{b.textContent='Copy Code';b.classList.remove('pop')},1500)};

/* keyboard */
function focusSearch(){$('#explore').scrollIntoView();setTimeout(()=>$('#q').focus(),250)}
$('#searchBtn').onclick=focusSearch;
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();focusSearch();return}
 if(!openM)return;
 if(e.key==='Escape'&&!document.fullscreenElement){closeModal();return}
 if(openM.id==='pv'&&e.key==='ArrowRight'){go(idx+1)}if(openM.id==='pv'&&e.key==='ArrowLeft'){go(idx-1)}
 if(e.key==='Tab'){const f=$$('button,a,[tabindex="0"]',openM).filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});

/* hero stack */
const hs=$('#stack');hs.innerHTML=S.slice(0,4).map((s,i)=>`<div class="hc" data-p="${i}" style="background:${s.slides[0][2]}"><b>${esc(s.slides[0][0])}</b><span>${esc(s.title)}</span></div>`).join('');
let hp=0;const hcs=$$('.hc',hs);function rot(d){hp=(hp+d+4)%4;hcs.forEach((c,i)=>c.dataset.p=(i-hp+4)%4)}
$('#hvNext').onclick=()=>rot(1);$('#hvPrev').onclick=()=>rot(-1);if(!reduce)setInterval(()=>rot(1),4000);
$('#heroV').addEventListener('pointermove',e=>{if(reduce)return;const r=e.currentTarget.getBoundingClientRect();hs.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*8}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*6}deg)`});

/* reveal on scroll + number reveal */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));$$('.sec-h,.panel,.don div').forEach(el=>{el.classList.add('rv');io.observe(el)});
const n=$('[data-count]');if(n&&!reduce){let v=0;const t=setInterval(()=>{v+=8;if(v>=200){v=200;clearInterval(t)}n.textContent=v+'+'},25)}

render();syncChips();
/* deep link: #slider-001 opens preview; unknown ids show a helpful message */
function hash(){const m=location.hash.match(/^#slider-(.+)$/);if(!m)return;const s=S.find(x=>x.id===m[1]);s?openPreview(s):toast('Unknown component: '+m[1]+'. Browse the library instead.')}
hash();addEventListener('hashchange',hash);
})();
