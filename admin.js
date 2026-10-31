function gen(){return 'GLM-'+Math.floor(1000+Math.random()*9000)}
let started=false;
async function unlock(){const p=$('pw').value;if(!p){$('gmsg').textContent='Enter the password.';return}
 $('gmsg').textContent='Checking…';
 try{await firebase.auth().signInWithEmailAndPassword(ADMIN_EMAIL,p);$('pw').value='';$('gmsg').textContent=''}
 catch(e){const c=e.code||'';$('gmsg').textContent=(c.includes('wrong-password')||c.includes('invalid-credential')||c.includes('invalid-login'))?'Wrong password.':(c.includes('too-many')?'Too many tries. Wait a few minutes.':'Login failed: '+(e.message||c))}}
$('ug').onclick=unlock;$('pw').onkeydown=e=>{if(e.key==='Enter')unlock()};
$('out').onclick=async e=>{e.preventDefault();try{await firebase.auth().signOut()}catch(x){}location.reload()};
firebase.auth().onAuthStateChanged(u=>{const ok=u&&u.email===ADMIN_EMAIL;
 $('gate').classList.toggle('hide',!!ok);$('panel').classList.toggle('hide',!ok);$('out').classList.toggle('hide',!ok);
 if(ok&&!started){started=true;loadAdmin();loadSampleList()}});
$('add').onclick=async()=>{const f=$('af').files[0],n=$('an').value.trim(),p=+$('ap').value;if(!f||!n||!p){$('amsg').textContent='Fill name, price and choose a video.';return}
$('amsg').textContent='Uploading…';
try{const r=await assets.upload(f);const c=gen();await db.collection('orders').doc(c).set({client:n,price:p,url:r.url,paid:false,title:'Video for '+n,at:Date.now()});
const link=new URL('index.html',location.href).href,msg='Hi '+n+', your edited video is ready! Open '+link+' , go to Client Portal and enter code '+c+'. Watch the preview free and pay Rs '+p+' by UPI to unlock the full video.';
$('amsg').textContent='Created! Code: '+c+' ';const a=document.createElement('a');a.href='https://wa.me/?text='+encodeURIComponent(msg);a.target='_blank';a.textContent='Send on WhatsApp';a.style.color='var(--c)';$('amsg').appendChild(a);
$('an').value='';$('ap').value='';$('af').value=''}catch(e){$('amsg').textContent='Failed: '+(e.message||'upload error')}};
$('sadd').onclick=async()=>{const f=$('sf').files[0];if(!f){$('smsg').textContent='Choose a file first.';return}$('smsg').textContent='Uploading…';
try{const r=await assets.upload(f);await db.collection('samples').doc('s'+Date.now()).set({title:$('st').value.trim(),url:r.url,kind:f.type.startsWith('image')?'image':'video',at:Date.now()});$('smsg').textContent='Sample added ✔';$('st').value='';$('sf').value=''}catch(e){$('smsg').textContent='Failed: '+(e.message||'error')}};
function loadSampleList(){db.collection('samples').onSnapshot(s=>{const g=$('slist');g.innerHTML='';
s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.at-a.at).forEach(o=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #ffffff14';
const t=document.createElement('span');t.textContent=(o.kind==='image'?'📷 ':'🎬 ')+(o.title||'Untitled');const b=document.createElement('button');b.className='btn ghost';b.style.padding='4px 14px';b.textContent='🗑 Remove';b.onclick=()=>{if(confirm('Remove this sample?'))db.collection('samples').doc(o.id).delete()};r.append(t,b);g.appendChild(r)})})}
function loadAdmin(){if(!db)return;let orders=[],claims={};
const draw=()=>{$('rows').innerHTML='';orders.sort((a,b)=>b.at-a.at).forEach(o=>{const tr=document.createElement('tr'),cl=claims[o.id];
const cells=[o.id,o.client,'',o.paid?'✅ Paid':(cl?'⏳ Verify':'🔒 Unpaid'),cl?cl.utr:'—'];
cells.forEach((t,i)=>{const td=document.createElement('td');if(i==2){const inp=document.createElement('input');inp.type='number';inp.value=o.price;inp.style.width='90px';inp.onchange=()=>db.collection('orders').doc(o.id).update({price:+inp.value});td.appendChild(inp)}else td.textContent=t;tr.appendChild(td)});
const td=document.createElement('td'),b=document.createElement('button');b.className='btn ghost';b.style.padding='6px 14px';b.textContent=o.paid?'Lock again':'Approve';b.onclick=()=>db.collection('orders').doc(o.id).update({paid:!o.paid});td.appendChild(b);tr.appendChild(td);$('rows').appendChild(tr)})};
db.collection('orders').onSnapshot(s=>{orders=s.docs.map(d=>({id:d.id,...d.data()}));draw()});
db.collection('claims').onSnapshot(s=>{claims={};s.docs.forEach(d=>claims[d.id]=d.data());draw()});
db.collection('feedback').onSnapshot(s=>{if(s.empty)return;$('fbs').textContent='';s.docs.forEach(d=>{const x=d.data(),p=document.createElement('p');p.textContent=d.id+' — '+'⭐'.repeat(x.rating)+' '+(x.text||'');$('fbs').appendChild(p)})})}
