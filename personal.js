/* ============================================================
   ⚙️ إعدادات المزامنة السحابية (JSONBin.io)
============================================================ */
const JSONBIN_ID  = '6abfaeacffd5d1605345fe46';
const JSONBIN_KEY = '$2a$10$nIQLhL1SEWyOWhbK5HhcGuPpVTJWFi/QEz7Br1SZI4VQ/17vtV1de';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;
const SYNC_ENABLED = true;

/* ============================================================
   STATE — البيانات الافتراضية
============================================================ */
const DEFAULT_STATE = {
  profile: {
    name:'اسم المبرمج',
    age:'25',
    spec:'مطور Full Stack',
    exp:'5+',
    img:'https://ui-avatars.com/api/?name=Programmer&size=400&background=0a0f1e&color=22d3ee&bold=true',
    fb:'https://facebook.com',
    ig:'https://instagram.com',
    wa:'https://wa.me/201234567890',
    tt:'https://tiktok.com'
  },
  skills: [
    {name:'HTML5',icon:'fab fa-html5',percent:100},
    {name:'CSS3',icon:'fab fa-css3-alt',percent:100},
    {name:'JavaScript',icon:'fab fa-js',percent:95},
    {name:'React.js',icon:'fab fa-react',percent:90},
    {name:'Node.js',icon:'fab fa-node-js',percent:98},
    {name:'MongoDB',icon:'fas fa-database',percent:90},
    {name:'Express.js',icon:'fas fa-server',percent:85},
    {name:'PHP',icon:'fab fa-php',percent:96},
    {name:'Python',icon:'fab fa-python',percent:88},
    {name:'TypeScript',icon:'fas fa-code',percent:85},
    {name:'Vue.js',icon:'fab fa-vuejs',percent:80},
    {name:'Angular',icon:'fab fa-angular',percent:78},
    {name:'Docker',icon:'fab fa-docker',percent:82},
    {name:'Git',icon:'fab fa-git-alt',percent:92},
    {name:'MySQL',icon:'fas fa-database',percent:87},
    {name:'Laravel',icon:'fab fa-laravel',percent:84},
    {name:'Next.js',icon:'fas fa-n',percent:80},
    {name:'Tailwind',icon:'fas fa-wind',percent:90}
  ],
  projects: [
    {id:1,title:'متجر إلكتروني متكامل',desc:'متجر إلكتروني احترافي مع لوحة تحكم متقدمة ونظام دفع آمن.',link:'https://example.com',imgs:['https://picsum.photos/seed/shop1/1000/600','https://picsum.photos/seed/shop2/1000/600','https://picsum.photos/seed/shop3/1000/600'],cat:'website'},
    {id:2,title:'نظام إدارة المهام',desc:'نظام ذكي لإدارة المهام والمشاريع مع تقارير تفصيلية.',link:'https://example.com',imgs:['https://picsum.photos/seed/task1/1000/600','https://picsum.photos/seed/task2/1000/600','https://picsum.photos/seed/task3/1000/600'],cat:'system'},
    {id:3,title:'تصميم موقع شركة',desc:'تصميم واجهة عصرية لموقع شركة تقنية مع تأثيرات حركية.',link:'https://example.com',imgs:['https://picsum.photos/seed/design1/1000/600','https://picsum.photos/seed/design2/1000/600','https://picsum.photos/seed/design3/1000/600'],cat:'frontend'}
  ],
  messages: [],
  password: 'admin123'
};

let state = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem('portfolioStateV2'));
    return saved || JSON.parse(JSON.stringify(DEFAULT_STATE));
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
})();

/* ============================================================
   💾 الحفظ المحلي
============================================================ */
function saveLocal(){
  try { localStorage.setItem('portfolioStateV2', JSON.stringify(state)); }
  catch(e) { console.warn('LocalStorage save failed:', e); }
}

/* ============================================================
   ☁️ المزامنة السحابية — قراءة
============================================================ */
async function loadFromCloud(){
  if(!SYNC_ENABLED) return null;
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_KEY },
      cache: 'no-store'
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const cloudState = data.record || data;
    if(cloudState && cloudState.profile && cloudState.skills && cloudState.projects){
      return cloudState;
    }
    return null;
  } catch(e) {
    console.warn('Cloud load failed:', e);
    return null;
  }
}

/* ============================================================
   ☁️ المزامنة السحابية — كتابة
============================================================ */
async function saveToCloud(){
  if(!SYNC_ENABLED) return false;
  try {
    const res = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(state)
    });
    return res.ok;
  } catch(e) {
    console.warn('Cloud save failed:', e);
    return false;
  }
}

function save(){
  saveLocal();
  if(SYNC_ENABLED){
    saveToCloud().then(ok=>{
      if(!ok) console.warn('⚠️ فشلت المزامنة السحابية');
    });
  }
}

/* ============================================================
   🎬 WELCOME & NOTIFICATIONS
============================================================ */
function initNotifications(){
  const welcome = document.getElementById('welcomeOverlay');
  const sideContainer = document.getElementById('sideNotifContainer');
  const WELCOME_DURATION = 3000;
  const TRANSITION_DURATION = 700;

  setTimeout(()=>{
    welcome.classList.add('hide');
    setTimeout(()=>{
      welcome.style.display = 'none';
      document.body.classList.remove('preload');
      const page1 = document.getElementById('page1');
      page1.style.animation = 'none';
      void page1.offsetWidth;
      page1.style.animation = '';
      setTimeout(()=>{ sideContainer.style.display = 'flex'; }, 250);
    }, TRANSITION_DURATION);
  }, WELCOME_DURATION);
}

function closeSideNotif(n){
  const el = document.getElementById('sideNotif'+n);
  if(el) el.style.display = 'none';
}

/* ============================================================
   🧭 NAVIGATION
============================================================ */
function showPage(n){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page'+n).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-links a[data-page="${n}"]`);
  if(activeLink) activeLink.classList.add('active');
  document.querySelector('.nav-links').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(n===2) animateSkills();
  if(n===3) renderProjects();
}

/* ============================================================
   🏠 PAGE 1 — RENDER
============================================================ */
function renderPage1(){
  document.getElementById('profileName').textContent = state.profile.name;
  document.getElementById('profileSpec').textContent = state.profile.spec;
  document.getElementById('profileImg').src = state.profile.img;

  const expNum = String(state.profile.exp).replace(/[^\d+]/g,'') || '5+';
  const ageNum = String(state.profile.age).replace(/[^\d]/g,'') || '25';
  document.getElementById('profileExpNum').textContent = expNum.includes('+') ? expNum : expNum + '+';
  document.getElementById('profileAgeNum').textContent = ageNum;

  const socialMap = { fb: state.profile.fb, ig: state.profile.ig, wa: state.profile.wa, tt: state.profile.tt };
  const socialClasses = ['fb','ig','wa','tt'];
  document.querySelectorAll('.social-bar a').forEach((a,i)=>{ a.href = socialMap[socialClasses[i]]; });

  const linkWa = document.getElementById('linkWa');
  const linkFb = document.getElementById('linkFb');
  const linkIg = document.getElementById('linkIg');
  const linkTt = document.getElementById('linkTt');
  if(linkWa) linkWa.href = state.profile.wa || '#';
  if(linkFb) linkFb.href = state.profile.fb || '#';
  if(linkIg) linkIg.href = state.profile.ig || '#';
  if(linkTt) linkTt.href = state.profile.tt || '#';
}

/* ============================================================
   🛠️ PAGE 2 — SKILLS (الخبرات)
============================================================ */
function renderSkills(){
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = state.skills.map((s)=>{
    const icon = s.icon && s.icon.trim() ? s.icon : 'fas fa-code';
    return `
    <div class="skill-card">
      <div class="skill-top">
        <div class="skill-icon"><i class="${icon}"></i></div>
        <div class="skill-meta">
          <h4>${s.name}</h4>
          <span class="pct">${s.percent}%</span>
        </div>
      </div>
      <div class="skill-track">
        <div class="skill-progress" data-pct="${s.percent}"></div>
      </div>
    </div>`;
  }).join('');
}

function animateSkills(){
  setTimeout(()=>{
    document.querySelectorAll('.skill-progress').forEach(el=>{
      el.style.width = el.dataset.pct + '%';
    });
  }, 200);
}

/* ============================================================
   📁 PAGE 3 — PROJECTS
============================================================ */
const CAT_LABELS = {
  website: {name:'مواقع الويب سايت (front end - back end)', icon:'fas fa-globe'},
  system:  {name:'الأنظمة للأعمال الإدارية',                icon:'fas fa-cogs'},
  frontend:{name:'تصاميم واجهات الويب سايت (front end)',   icon:'fas fa-paint-brush'}
};

function renderProjects(){
  const cont = document.getElementById('projectsContainer');
  let html = '';
  Object.keys(CAT_LABELS).forEach(cat=>{
    const projs = state.projects.filter(p=>p.cat===cat);
    if(!projs.length) return;
    const lbl = CAT_LABELS[cat];
    html += `
      <div class="category-block">
        <div class="category-head">
          <div class="icon-box"><i class="${lbl.icon}"></i></div>
          <h3>${lbl.name}</h3>
          <span class="count">${projs.length} مشروع</span>
        </div>
        <div class="slider-shell">
          <button class="slider-nav prev" onclick="slide('${cat}',-1)"><i class="fas fa-chevron-right"></i></button>
          <div class="slider-viewport">
            <div class="slider-track" id="track-${cat}" data-index="0">
              ${projs.map(p=>renderProjectSlide(p)).join('')}
            </div>
          </div>
          <button class="slider-nav next" onclick="slide('${cat}',1)"><i class="fas fa-chevron-left"></i></button>
        </div>
      </div>`;
  });
  if(!html) html = '<div class="empty"><i class="fas fa-folder-open"></i>لا توجد مشاريع حالياً</div>';
  cont.innerHTML = html;
}

function renderProjectSlide(p){
  const imgs = (p.imgs || []).filter(Boolean);
  const imgTags = imgs.length
    ? imgs.map((u,i)=>`<img src="${u}" class="${i===0?'active':''}" data-idx="${i}" onerror="this.src='https://via.placeholder.com/600x400/0a0f1e/22d3ee?text=Project'">`).join('')
    : `<img src="https://via.placeholder.com/600x400/0a0f1e/22d3ee?text=Project" class="active">`;
  const dots = imgs.map((_,i)=>`<span class="media-dot ${i===0?'active':''}" onclick="setImg(${p.id},${i})"></span>`).join('');
  return `
    <div class="slide-item">
      <div class="project-card">
        <div class="project-media" id="imgs-${p.id}">
          ${imgTags}
          <div class="media-overlay"><p>${p.desc || ''}</p></div>
          <button class="media-arrow prev-img" onclick="event.stopPropagation();setImg(${p.id},'prev')"><i class="fas fa-chevron-right"></i></button>
          <button class="media-arrow next-img" onclick="event.stopPropagation();setImg(${p.id},'next')"><i class="fas fa-chevron-left"></i></button>
          <div class="media-dots">${dots}</div>
        </div>
        <div class="project-info">
          <h4>${p.title}</h4>
          <p>${p.desc || ''}</p>
          <a href="${p.link || '#'}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i> عرض المشروع
          </a>
        </div>
      </div>
    </div>`;
}

function slide(cat, dir){
  const track = document.getElementById('track-'+cat);
  if(!track) return;
  const total = track.children.length;
  if(!total) return;
  let idx = parseInt(track.dataset.index || 0) + dir;
  if(idx < 0) idx = total - 1;
  if(idx >= total) idx = 0;
  track.dataset.index = idx;
  track.style.transform = `translateX(${idx * 100}%)`;
}

function setImg(id, idx){
  const container = document.getElementById('imgs-'+id);
  if(!container) return;
  const imgs = container.querySelectorAll('img');
  if(!imgs.length) return;
  if(idx === 'prev' || idx === 'next'){
    let current = 0;
    imgs.forEach((img,i)=>{ if(img.classList.contains('active')) current = i; });
    if(idx === 'prev') idx = (current - 1 + imgs.length) % imgs.length;
    else idx = (current + 1) % imgs.length;
  }
  imgs.forEach((img,i)=>img.classList.toggle('active', i===idx));
  container.querySelectorAll('.media-dot').forEach((d,i)=>d.classList.toggle('active', i===idx));
}

/* ============================================================
   ✉️ CONTACT FORM
============================================================ */
function submitContact(e){
  e.preventDefault();
  const msg = {
    name: document.getElementById('cName').value.trim(),
    email: document.getElementById('cEmail').value.trim(),
    text: document.getElementById('cMessage').value.trim(),
    date: new Date().toLocaleString('ar-EG')
  };
  state.messages.push(msg);
  save();
  document.getElementById('contactForm').reset();
  showToast('تم إرسال الرسالة بنجاح!');
}

/* ============================================================
   🔐 PASSWORD / DASHBOARD
============================================================ */
function openPasswordModal(){
  document.getElementById('passwordModal').classList.add('active');
  setTimeout(()=>document.getElementById('passwordInput').focus(), 200);
}
function closeModal(){
  document.getElementById('passwordModal').classList.remove('active');
  document.getElementById('passwordInput').value = '';
}
function checkPassword(){
  const p = document.getElementById('passwordInput').value;
  if(p === state.password){
    closeModal();
    document.getElementById('dashboard').classList.add('active');
    loadDash();
  } else {
    showToast('كلمة المرور غير صحيحة!');
  }
}
function closeDashboard(){ document.getElementById('dashboard').classList.remove('active'); }
function showDashTab(n){
  document.querySelectorAll('.dash-tab').forEach((t,i)=>t.classList.toggle('active', i===n-1));
  document.querySelectorAll('.dash-panel').forEach((p,i)=>p.classList.toggle('active', i===n-1));
}

function loadDash(){
  document.getElementById('dName').value = state.profile.name;
  document.getElementById('dAge').value = state.profile.age;
  document.getElementById('dSpec').value = state.profile.spec;
  document.getElementById('dExp').value = state.profile.exp;
  document.getElementById('dImg').value = state.profile.img;
  document.getElementById('dFb').value = state.profile.fb;
  document.getElementById('dIg').value = state.profile.ig;
  document.getElementById('dWa').value = state.profile.wa;
  document.getElementById('dTt').value = state.profile.tt;
  renderDashSkills();
  renderDashProjects();
  renderDashMessages();
}

function savePage1(){
  state.profile.name = document.getElementById('dName').value.trim() || state.profile.name;
  state.profile.age  = document.getElementById('dAge').value.trim()  || state.profile.age;
  state.profile.spec = document.getElementById('dSpec').value.trim() || state.profile.spec;
  state.profile.exp  = document.getElementById('dExp').value.trim()  || state.profile.exp;
  state.profile.img  = document.getElementById('dImg').value.trim()  || state.profile.img;
  state.profile.fb   = document.getElementById('dFb').value.trim()   || state.profile.fb;
  state.profile.ig   = document.getElementById('dIg').value.trim()   || state.profile.ig;
  state.profile.wa   = document.getElementById('dWa').value.trim()   || state.profile.wa;
  state.profile.tt   = document.getElementById('dTt').value.trim()   || state.profile.tt;
  save();
  renderPage1();
  showToast(SYNC_ENABLED ? 'تم الحفظ والمزامنة!' : 'تم حفظ التعديلات محلياً!');
}

/* ============================================================
   🛠️ DASH — SKILLS
============================================================ */
function renderDashSkills(){
  const list = document.getElementById('skillsList');
  if(!state.skills.length){
    list.innerHTML = '<div class="empty"><i class="fas fa-inbox"></i>لا توجد خبرات</div>';
    return;
  }
  list.innerHTML = state.skills.map((s,i)=>{
    const icon = s.icon && s.icon.trim() ? s.icon : 'fas fa-code';
    return `
      <div class="list-item">
        <div class="meta"><i class="${icon}"></i> ${s.name} — ${s.percent}%</div>
        <div class="actions">
          <button class="dash-action sm" onclick="editSkill(${i})"><i class="fas fa-edit"></i></button>
          <button class="dash-action sm danger" onclick="delSkill(${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  }).join('');
}

function addSkill(){
  const name = document.getElementById('skillName').value.trim();
  const icon = document.getElementById('skillIcon').value.trim();
  const percent = parseInt(document.getElementById('skillPercent').value);
  if(!name || !percent || percent < 1 || percent > 100){
    return showToast('أدخل اسم ونسبة صحيحة (1-100)');
  }
  state.skills.push({name, icon, percent});
  save();
  renderDashSkills();
  renderSkills();
  document.getElementById('skillName').value = '';
  document.getElementById('skillIcon').value = '';
  document.getElementById('skillPercent').value = '';
  showToast('تمت إضافة الخبرة!');
}

function editSkill(i){
  const s = state.skills[i];
  const name = prompt('اسم الخبرة:', s.name); if(name === null) return;
  const icon = prompt('الأيقونة:', s.icon); if(icon === null) return;
  const percent = prompt('النسبة:', s.percent); if(percent === null) return;
  const p = parseInt(percent);
  if(isNaN(p) || p < 1 || p > 100) return showToast('نسبة غير صحيحة');
  state.skills[i] = {name: name.trim() || s.name, icon: icon.trim(), percent: p};
  save();
  renderDashSkills();
  renderSkills();
  showToast('تم التعديل!');
}

function delSkill(i){
  if(!confirm('حذف هذه الخبرة؟')) return;
  state.skills.splice(i,1);
  save();
  renderDashSkills();
  renderSkills();
  showToast('تم الحذف!');
}

/* ============================================================
   📁 DASH — PROJECTS
============================================================ */
function renderDashProjects(){
  const list = document.getElementById('projectsList');
  if(!state.projects.length){
    list.innerHTML = '<div class="empty"><i class="fas fa-inbox"></i>لا توجد مشاريع</div>';
    return;
  }
  list.innerHTML = state.projects.map(p=>{
    const catName = CAT_LABELS[p.cat] ? CAT_LABELS[p.cat].name : p.cat;
    return `
      <div class="list-item">
        <div class="meta"><i class="fas fa-folder"></i> ${p.title} — <span style="color:var(--txt-3);font-size:.8rem">${catName}</span></div>
        <div class="actions">
          <button class="dash-action sm" onclick="editProject(${p.id})"><i class="fas fa-edit"></i></button>
          <button class="dash-action sm danger" onclick="delProject(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  }).join('');
}

function addProject(){
  const title = document.getElementById('projTitle').value.trim();
  const desc = document.getElementById('projDesc').value.trim();
  const link = document.getElementById('projLink').value.trim();
  const imgs = [
    document.getElementById('projImg1').value.trim(),
    document.getElementById('projImg2').value.trim(),
    document.getElementById('projImg3').value.trim()
  ].filter(Boolean);
  const cat = document.getElementById('projCat').value;
  if(!title) return showToast('أدخل عنوان المشروع');
  state.projects.push({id:Date.now(), title, desc, link, imgs, cat});
  save();
  renderDashProjects();
  renderProjects();
  ['projTitle','projDesc','projLink','projImg1','projImg2','projImg3'].forEach(id=>document.getElementById(id).value='');
  showToast('تمت إضافة المشروع!');
}

function editProject(id){
  const p = state.projects.find(x=>x.id===id);
  if(!p) return;
  const title = prompt('العنوان:', p.title); if(title === null) return;
  const desc = prompt('الوصف:', p.desc); if(desc === null) return;
  const link = prompt('الرابط:', p.link); if(link === null) return;
  p.title = title.trim() || p.title;
  p.desc = desc.trim();
  p.link = link.trim();
  save();
  renderDashProjects();
  renderProjects();
  showToast('تم التعديل!');
}

function delProject(id){
  if(!confirm('حذف هذا المشروع؟')) return;
  state.projects = state.projects.filter(x=>x.id!==id);
  save();
  renderDashProjects();
  renderProjects();
  showToast('تم الحذف!');
}

/* ============================================================
   📥 DASH — MESSAGES
============================================================ */
function renderDashMessages(){
  const list = document.getElementById('messagesList');
  if(!state.messages.length){
    list.innerHTML = '<div class="empty"><i class="fas fa-inbox"></i>لا توجد رسائل</div>';
    return;
  }
  list.innerHTML = state.messages.slice().reverse().map(m=>`
    <div class="msg-card">
      <div class="head">
        <span class="name"><i class="fas fa-user"></i> ${m.name}</span>
        <span class="date">${m.date}</span>
      </div>
      <div class="email"><i class="fas fa-envelope"></i> ${m.email}</div>
      <div class="body">${m.text}</div>
    </div>`).join('');
}

/* ============================================================
   🔔 TOAST
============================================================ */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 3200);
}

/* ============================================================
   🚀 INIT
============================================================ */
async function init(){
  const syncLoader = document.getElementById('syncLoader');
  if(SYNC_ENABLED){
    const cloud = await loadFromCloud();
    if(cloud){
      state = cloud;
      saveLocal();
      console.log('✅ تم تحميل البيانات من السحابة');
    } else {
      console.log('ℹ️ لا توجد بيانات سحابية — استخدام المحلي');
    }
  }
  if(syncLoader) syncLoader.classList.add('hide');
  renderPage1();
  renderSkills();
  renderProjects();
  initNotifications();
}

window.addEventListener('DOMContentLoaded', init);

document.getElementById('passwordModal').addEventListener('click', e=>{
  if(e.target.id === 'passwordModal') closeModal();
});

document.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    closeModal();
    document.querySelector('.nav-links').classList.remove('open');
  }
});

window.addEventListener('online', ()=>{
  if(SYNC_ENABLED) saveToCloud();
});

window.addEventListener('beforeunload', ()=>{
  if(SYNC_ENABLED) saveLocal();
});