/* SLIDEVERSE main — theme, search/filters, favorites, recents, pagination, preview, code viewer, image manager.
   Vanilla JS, no dependencies, no backend: everything works on GitHub Pages. */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S=window.SLIDERS||[],reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAGE_SIZE=12,REPO='https://github.com/adnanalamin/SLIDEVERSE';
let favs=store.get('sv-favs',[]).filter(id=>S.some(s=>s.id===id)),recent=store.get('sv-recent',[]).filter(id=>S.some(s=>s.id===id)),state={q:'',cat:'All',tech:'All',page:1};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}
const folderOf=s=>String(s.demo||'').replace(/^\.?\/+|\/+$/g,'');
const ghUrl=s=>`${REPO}/tree/main/${encodeURI(folderOf(s))}`;
const byId=id=>S.find(x=>x.id===id);

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
/* features */
const feats=[['▶','Live previews','Open any slider in a full preview before you copy a line.'],['</>','Real source code','View and copy the actual HTML, CSS and JavaScript files.'],['⇔','Responsive by design','Every component adapts from phone to desktop.'],['☝','Touch & swipe','Swipe gestures work on touch screens.'],['⌨','Keyboard accessible','Arrow keys, Escape and visible focus states.'],['▣','Image manager','Try your own images in a slider, right in the browser.'],['❖','Reusable components','One folder and one data entry per slider.'],['♡','Open source','MIT licensed and built in public.']];
$('#feats').innerHTML=feats.map(f=>`<article class="feat rv"><div class="ic">${esc(f[0])}</div><h3>${esc(f[1])}</h3><p>${esc(f[2])}</p></article>`).join('');

/* filters — chips are generated from the catalogue, so they always match real data */
const uniq=a=>[...new Set(a)];
const cats=['All','Favorites',...uniq(S.map(s=>s.category))],techs=['All',...uniq(S.flatMap(s=>s.technologies))];
$('#catChips').innerHTML=cats.map(c=>`<button class="chip" type="button" data-v="${esc(c)}" aria-pressed="false">${c==='Favorites'?'♥ Favorites':esc(c)}</button>`).join('');
$('#techChips').innerHTML=techs.map(c=>`<button class="chip" type="button" data-t="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
$$('#catChips .chip').forEach(b=>b.onclick=()=>{state.cat=b.dataset.v;state.page=1;syncChips();render()});
$$('#techChips .chip').forEach(b=>b.onclick=()=>{state.tech=b.dataset.t;state.page=1;syncChips();render()});
function syncChips(){$$('#catChips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===state.cat));$$('#techChips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===state.tech))}
$('#q').oninput=e=>{state.q=e.target.value.trim().toLowerCase();state.page=1;render()};
function clearFilters(){state={q:'',cat:'All',tech:'All',page:1};$('#q').value='';syncChips();render()}
$('#clearBtn').onclick=clearFilters;$('#reset').onclick=clearFilters;

/* cards */
function card(s){const f=favs.includes(s.id),dir=encodeURI(folderOf(s))+'/';
return `<article class="card" data-id="${esc(s.id)}">
<div class="thumb"><img src="${dir}${encodeURI(s.thumb)}" alt="${esc(s.title)} screenshot" loading="lazy"><button class="fav" type="button" aria-pressed="${f}" aria-label="${f?'Remove from':'Add to'} favorites: ${esc(s.title)}">${f?'♥':'♡'}</button></div>
<div class="cb"><span class="num">SLIDE / ${esc(s.id)}</span><h3>${esc(s.title)}</h3><p class="meta">${esc(s.category)} · ${esc(s.technologies.join(', '))}</p><p>${esc(s.description)}</p>
<div class="tags">${s.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
<div class="acts"><button class="btn sm" type="button" data-act="pv">Preview ↗</button><button class="btn sm ghost" type="button" data-act="cd">View Code ↗</button><button class="btn sm ghost" type="button" data-act="im">Images</button><a class="btn sm ghost" href="${dir}" target="_blank" rel="noopener" aria-label="Live demo: ${esc(s.title)}">Live Demo ↗</a><a class="btn sm ghost" href="${ghUrl(s)}" target="_blank" rel="noopener" aria-label="GitHub folder: ${esc(s.title)}">GitHub ↗</a></div></div></article>`}
function getFiltered(){
 return S.filter(s=>{const hay=[s.title,s.category,s.technologies.join(' '),s.tags.join(' '),s.description].join(' ').toLowerCase();
  return(!state.q||hay.includes(state.q))&&(state.cat==='All'||(state.cat==='Favorites'?favs.includes(s.id):s.category===state.cat))&&(state.tech==='All'||s.technologies.includes(state.tech))});
}
function renderPagination(total){
 const nav=$('#pagination'),pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
 if(state.page>pages)state.page=pages;
 if(total<=PAGE_SIZE){nav.innerHTML='';nav.hidden=true;return}
 nav.hidden=false;
 const make=(label,page,disabled=false,current=false)=>`<button class="page-btn" type="button" data-page="${page}" ${disabled?'disabled':''} ${current?'aria-current="true"':''} aria-label="${label}">${label}</button>`;
 let out=make('←',Math.max(1,state.page-1),state.page===1);
 const addPage=p=>{out+=make(String(p),p,false,p===state.page)};
 if(pages<=7){for(let p=1;p<=pages;p++)addPage(p)}
 else{addPage(1);if(state.page>4)out+='<span class="page-ellipsis">…</span>';
  const a=Math.max(2,state.page-1),z=Math.min(pages-1,state.page+1);for(let p=a;p<=z;p++)addPage(p);
  if(state.page<pages-3)out+='<span class="page-ellipsis">…</span>';addPage(pages)}
 out+=make('→',Math.min(pages,state.page+1),state.page===pages);nav.innerHTML=out;
}
function render(){
 const list=getFiltered(),pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
 if(state.page>pages)state.page=pages;
 const start=(state.page-1)*PAGE_SIZE,visible=list.slice(start,start+PAGE_SIZE);
 $('#grid').innerHTML=visible.map(card).join('');$('#grid').hidden=!visible.length;$('#empty').hidden=!!list.length;
 $('#count').textContent=list.length?`Showing ${start+1}–${start+visible.length} of ${list.length} matching components`:`Showing 0 of ${S.length} components`;
 renderPagination(list.length);
 if(!list.length){const nf=state.cat==='Favorites'&&!state.q;$('#emptyT').textContent=nf?'No favorites yet':'No sliders found';$('#emptyP').textContent=nf?'Tap the heart on any slider to save it here.':'Try another keyword or clear the filters.'}
 renderRecent();
}
$('#pagination').onclick=e=>{const b=e.target.closest('[data-page]');if(!b||b.disabled)return;state.page=Number(b.dataset.page);render();$('#explore').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})};
function renderRecent(){const l=recent.map(byId).filter(Boolean);$('#recent').innerHTML=l.map(card).join('');$('#recentEmpty').hidden=!!l.length}
function addRecent(id){recent=[id,...recent.filter(i=>i!==id)].slice(0,6);store.set('sv-recent',recent);renderRecent()}

/* one delegated handler; every button maps to exactly one action */
document.addEventListener('click',e=>{
 const c=e.target.closest('.card');if(!c)return;const s=byId(c.dataset.id);if(!s)return;
 if(e.target.closest('.fav')){favs=favs.includes(s.id)?favs.filter(i=>i!==s.id):[...favs,s.id];store.set('sv-favs',favs);render();return}
 const a=e.target.closest('[data-act]');if(!a)return;
 const acts={pv:openPreview,cd:openCode,im:openImages};acts[a.dataset.act]&&acts[a.dataset.act](s,a)});

/* modals (focus trap, restore focus) */
let lastFocus=null,openM=null;
function openModal(m,t){lastFocus=t||document.activeElement;m.hidden=false;openM=m;document.body.style.overflow='hidden';$('[data-close]',m).focus()}
function closeModal(){if(!openM)return;if(document.fullscreenElement)document.exitFullscreen();if(openM.id==='pv')$('#pvFrame').src='about:blank';if(openM.id==='im')freeUrls();openM.hidden=true;openM=null;document.body.style.overflow='';lastFocus&&lastFocus.focus&&lastFocus.focus()}
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))closeModal()}));

/* preview: the real component in an iframe (its own page, CSS and JS) */
function openPreview(s,t){$('#pvT').textContent=s.title;const f=$('#pvFrame');f.title=s.title+' live preview';f.src=encodeURI(folderOf(s))+'/?preview='+Date.now();openModal($('#pv'),t);addRecent(s.id)}
$('#pvFs').onclick=()=>{const b=$('#pvBox');document.fullscreenElement?document.exitFullscreen():b.requestFullscreen?b.requestFullscreen().catch(()=>toast('Fullscreen is not available')):toast('Fullscreen is not available')};

/* code viewer: fetches the component's real files */
let codes={},tab='',codeSlider=null;
async function openCode(s,t){codeSlider=s;codes={};tab=s.files[0][0];$('#cdT').textContent=s.title+' — source';
 $('#tabs').innerHTML=s.files.map(f=>`<button class="chip" type="button" role="tab" data-k="${esc(f[0])}">${esc(f[0])}</button>`).join('');
 showTab();openModal($('#cd'),t);addRecent(s.id);
 await Promise.all(s.files.map(async f=>{try{const r=await fetch(encodeURI(folderOf(s))+'/'+encodeURI(f[1]),{cache:'no-cache'});if(!r.ok)throw 0;codes[f[0]]=await r.text()}catch(e){codes[f[0]]=null}}));
 if(codeSlider===s)showTab()}
function showTab(){const f=codeSlider.files.find(x=>x[0]===tab);
 $$('#tabs .chip').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.k===tab);b.setAttribute('aria-selected',b.dataset.k===tab)});
 $('#cdPath').textContent=folderOf(codeSlider)+'/'+f[1];
 const v=codes[tab];$('#codeOut code').textContent=v===undefined?'Loading…':v===null?'Could not load this file. Open the site through GitHub Pages or a local web server (not by double-clicking index.html).':v}
$('#tabs').onclick=e=>{const b=e.target.closest('[data-k]');if(b){tab=b.dataset.k;showTab()}};
$('#copy').onclick=async()=>{const b=$('#copy'),v=codes[tab];if(typeof v!=='string'){toast('Nothing to copy yet');return}
 let ok=false;try{await navigator.clipboard.writeText(v);ok=true}catch(e){const ta=document.createElement('textarea');ta.value=v;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{ok=document.execCommand('copy')}catch(_){}ta.remove()}
 if(!ok){toast('Copy failed — select the code and press Ctrl+C');return}
 b.textContent='Copied!';b.classList.add('pop');toast(`Copied ${tab} (${v.length.toLocaleString()} characters)`);setTimeout(()=>{b.textContent='Copy Code';b.classList.remove('pop')},1500)};

/* image manager — stored in this browser's IndexedDB (db "slideverse", store "images", key = slider folder).
   The component's own script reads the same key, so the Preview and Live Demo show these images. */
const DB='slideverse',ST='images',MAX_BYTES=10*1024*1024,EXT=/\.(jpe?g|png|webp|gif)$/i,MIMES={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif'};
const openDb=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(ST))r.result.createObjectStore(ST)};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function dbGet(k){const db=await openDb();return new Promise((res,rej)=>{const q=db.transaction(ST,'readonly').objectStore(ST).get(k);q.onsuccess=()=>{db.close();res(q.result||[])};q.onerror=()=>{db.close();rej(q.error)}})}
async function dbSet(k,v){const db=await openDb();return new Promise((res,rej)=>{const tx=db.transaction(ST,'readwrite');tx.objectStore(ST).put(v,k);tx.oncomplete=()=>{db.close();res()};tx.onerror=tx.onabort=()=>{db.close();rej(tx.error)}})}
const uid=()=>crypto.randomUUID?crypto.randomUUID():'img-'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
const fmtSize=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(0)+' KB':(n/1048576).toFixed(1)+' MB';
let im={s:null,items:[],urls:new Map(),replaceId:null,dragId:null};
const slotName=(i)=>im.s.slots[i]||'';
const maxImages=()=>im.s.slots.length;
function freeUrls(){im.urls.forEach(u=>URL.revokeObjectURL(u));im.urls.clear()}
async function openImages(s,t){im.s=s;im.items=[];$('#imT').textContent=s.title+' — images';
 try{im.items=await dbGet(folderOf(s))}catch(e){toast('Image storage is not available in this browser')}
 renderImages();openModal($('#im'),t)}
async function persist(){try{await dbSet(folderOf(im.s),im.items)}catch(e){toast('Could not save images (browser storage full or blocked)');try{im.items=await dbGet(folderOf(im.s))}catch(_){}}renderImages()}
function renderImages(){freeUrls();
 $('#imCount').textContent=`${im.items.length} of ${maxImages()} image slots used`;
 $('#imUpload').disabled=im.items.length>=maxImages();$('#imReset').disabled=!im.items.length;
 const items=im.items.map((it,i)=>{const u=URL.createObjectURL(it.blob);im.urls.set(it.id,u);
  return `<li class="im-item" draggable="true" data-id="${esc(it.id)}"><span class="im-n" aria-hidden="true">${i+1}</span><img src="${u}" alt="Preview of ${esc(it.name)}" draggable="false">
<div class="im-meta"><b title="${esc(it.name)}">${esc(it.name)}</b><span>${it.width} × ${it.height} px · ${esc((it.type.split('/')[1]||'').toUpperCase())} · ${fmtSize(it.size)}</span><small>Shown on: ${esc(slotName(i))}</small></div>
<div class="im-act"><button type="button" class="ib" data-im="left" aria-label="Move ${esc(it.name)} earlier" ${i===0?'disabled':''}>◀</button><button type="button" class="ib" data-im="right" aria-label="Move ${esc(it.name)} later" ${i===im.items.length-1?'disabled':''}>▶</button><button type="button" class="btn sm ghost" data-im="replace" aria-label="Replace ${esc(it.name)}">Replace</button><button type="button" class="btn sm ghost" data-im="remove" aria-label="Remove ${esc(it.name)}">Remove</button></div></li>`}).join('');
 const add=im.items.length<maxImages()?`<li class="im-add"><button type="button" class="btn ghost" data-im="add">+ Add image <small>for: ${esc(slotName(im.items.length))}</small></button></li>`:'';
 $('#imList').innerHTML=items+add;
 if(!im.items.length)$('#imList').insertAdjacentHTML('afterbegin','<li class="im-empty muted">No custom images yet — the slider shows its original photos.</li>')}
async function toRecord(file){
 if(!EXT.test(file.name)||(file.type&&!Object.values(MIMES).includes(file.type)))throw new Error(`${file.name}: only JPG, PNG, WebP and GIF are supported`);
 if(file.size>MAX_BYTES)throw new Error(`${file.name}: larger than 10 MB`);
 const type=file.type||MIMES[file.name.split('.').pop().toLowerCase()];
 let w,h;try{const b=await createImageBitmap(file);w=b.width;h=b.height;b.close&&b.close()}catch(e){throw new Error(`${file.name}: not a readable image`)}
 return{id:uid(),name:file.name,type,size:file.size,width:w,height:h,blob:file.slice(0,file.size,type),sig:`${file.name}|${file.size}|${file.lastModified}`}}
async function addFiles(files){
 const room=maxImages()-im.items.length,errs=[];let added=0,dup=0;
 for(const f of files){if(added>=room){errs.push(`${f.name}: no free slot left`);continue}
  try{const r=await toRecord(f);if(im.items.some(x=>x.sig===r.sig)){dup++;continue}im.items.push(r);added++}catch(e){errs.push(e.message)}}
 if(added)await persist();
 toast([added&&`Added ${added} image${added>1?'s':''}`,dup&&`${dup} duplicate skipped`,errs[0]].filter(Boolean).join(' · ')||'Nothing added')}
async function replaceImage(id,file){
 const i=im.items.findIndex(x=>x.id===id);if(i<0)return;
 try{const r=await toRecord(file);if(im.items.some(x=>x.id!==id&&x.sig===r.sig)){toast('That image is already in the list');return}
  im.items[i]=r;await persist();toast('Image replaced')}catch(e){toast(e.message)}}
const pickMulti=$('#imFileMulti'),pickOne=$('#imFileOne');let oneMode='add';
$('#imUpload').onclick=()=>pickMulti.click();
pickMulti.onchange=async()=>{const f=[...pickMulti.files];pickMulti.value='';if(f.length)await addFiles(f)};
pickOne.onchange=async()=>{const f=pickOne.files[0],mode=oneMode,id=im.replaceId;pickOne.value='';if(!f)return;mode==='replace'?await replaceImage(id,f):await addFiles([f])};
$('#imReset').onclick=async()=>{im.items=[];await persist();toast('All custom images removed')};
const move=(i,j)=>{if(j<0||j>=im.items.length||i===j)return;const[x]=im.items.splice(i,1);im.items.splice(j,0,x)};
$('#imList').onclick=async e=>{const b=e.target.closest('[data-im]');if(!b)return;const li=b.closest('.im-item'),id=li&&li.dataset.id,i=im.items.findIndex(x=>x.id===id);
 switch(b.dataset.im){
  case'add':oneMode='add';pickOne.click();break;
  case'replace':oneMode='replace';im.replaceId=id;pickOne.click();break;
  case'remove':im.items=im.items.filter(x=>x.id!==id);await persist();toast('Image removed');break;
  case'left':move(i,i-1);await persist();break;
  case'right':move(i,i+1);await persist();break}};
$('#imList').addEventListener('dragstart',e=>{const li=e.target.closest('.im-item');if(!li)return;im.dragId=li.dataset.id;li.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',im.dragId)});
$('#imList').addEventListener('dragover',e=>{const li=e.target.closest('.im-item');if(!li||!im.dragId)return;e.preventDefault();$$('.im-item.over').forEach(x=>x.classList.remove('over'));li.classList.add('over')});
$('#imList').addEventListener('drop',async e=>{const li=e.target.closest('.im-item');if(!li||!im.dragId)return;e.preventDefault();
 const from=im.items.findIndex(x=>x.id===im.dragId),to=im.items.findIndex(x=>x.id===li.dataset.id);im.dragId=null;move(from,to);await persist()});
$('#imList').addEventListener('dragend',()=>{im.dragId=null;$$('.im-item.over,.im-item.dragging').forEach(x=>x.classList.remove('over','dragging'))});

/* keyboard */
function focusSearch(){$('#explore').scrollIntoView();setTimeout(()=>$('#q').focus(),250)}
$('#searchBtn').onclick=focusSearch;
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();focusSearch();return}
 if(!openM)return;
 if(e.key==='Escape'&&!document.fullscreenElement){closeModal();return}
 if(e.key==='Tab'){const f=$$('button,a,[tabindex="0"],iframe',openM).filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));$$('.sec-h,.panel,.don div').forEach(el=>{el.classList.add('rv');io.observe(el)});

render();syncChips();
/* deep link: #slider-001 opens the preview */
function hash(){const m=location.hash.match(/^#slider-(.+)$/);if(!m)return;const s=byId(m[1]);s?openPreview(s):toast('Unknown component: '+m[1])}
hash();addEventListener('hashchange',hash);
})();
