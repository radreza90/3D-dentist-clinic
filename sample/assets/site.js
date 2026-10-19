(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileToggle=$('#menu-toggle'),mobileNav=$('#mobile-nav'),header=$('#page-header');
  const menuClose=()=>{mobileNav.hidden=true;mobileToggle.setAttribute('aria-expanded','false');};
  mobileToggle?.addEventListener('click',()=>{const state=mobileNav.hidden;mobileNav.hidden=!state;mobileToggle.setAttribute('aria-expanded',String(state));});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',menuClose));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')menuClose();});

  $$('.hero-photo,.service-photo-card img,.journey-photo img,.video-review img,.journal-image img,.experience-photo img,.innovation-visual img').forEach(img=>{const fail=()=>img.classList.add('photo-error');img.addEventListener('error',fail,{once:true});if(img.complete&&img.naturalWidth===0)fail();});

  const revealElements=$$('.reveal');
  if(reduceMotion.matches||!('IntersectionObserver' in window)){revealElements.forEach(el=>el.classList.add('is-visible'));}
  else {const io=new IntersectionObserver((entries,obs)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -25px 0px'});revealElements.forEach((el,i)=>{el.style.setProperty('--delay',`${(i%3)*75}ms`);io.observe(el);});}

  const scenes=$('.horizontal-scene'),track=$('#journey-track'),viewport=$('#journey-viewport'),progress=$('#journey-progress'),current=$('#journey-current');
  const toPersian=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
  let maxDistance=0,scrollRatio=0,wasDesktop=false;
  const desktop=()=>window.innerWidth>970&&!reduceMotion.matches;
  function updateScene(){
    if(!scenes||!track)return;
    const isDesktop=desktop();
    if(!isDesktop){
      if(wasDesktop){track.style.transform='';wasDesktop=false;}
      const denom=viewport.scrollWidth-viewport.clientWidth;
      const p=denom>0?Math.abs(viewport.scrollLeft)/denom:0;
      progress.style.width=`${25+75*Math.max(0,Math.min(1,p))}%`;
      current.textContent=toPersian(String(1+Math.min(3,Math.round(p*3))).padStart(2,'0'));
      return;
    }
    wasDesktop=true;
    const available=scenes.offsetHeight-window.innerHeight;
    scrollRatio=available>0?Math.max(0,Math.min(1,-scenes.getBoundingClientRect().top/available)):0;
    const offset=track.getBoundingClientRect().right-window.innerWidth;
    void offset; // geometry depends on right inset; scroll track width is stable
    maxDistance=Math.max(0,track.scrollWidth-window.innerWidth+Math.max(44,(window.innerWidth-1240)/2)*2);
    track.style.transform=`translate3d(${scrollRatio*maxDistance}px,0,0)`;
    progress.style.width=`${25+75*scrollRatio}%`;
    current.textContent=toPersian(String(1+Math.min(3,Math.round(scrollRatio*3))).padStart(2,'0'));
  }
  let scheduled=false;
  function onScroll(){
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{
      const height=document.documentElement.scrollHeight-window.innerHeight;
      $('#progress-bar').style.width=`${height>0?window.scrollY/height*100:0}%`;
      header.classList.toggle('scrolled',window.scrollY>15);
      updateScene();scheduled=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  viewport?.addEventListener('scroll',()=>{if(!desktop())updateScene();},{passive:true});
  const navigateScene=(direction)=>{
    if(desktop()){
      const top=window.scrollY+scenes.getBoundingClientRect().top;
      const range=scenes.offsetHeight-window.innerHeight;
      const target=Math.max(0,Math.min(1,scrollRatio+(direction/3)));
      window.scrollTo({top:top+range*target,behavior:reduceMotion.matches?'auto':'smooth'});
    } else viewport.scrollBy({left:(document.dir==='rtl'?-1:1)*direction*Math.min(560,window.innerWidth*.85),behavior:reduceMotion.matches?'auto':'smooth'});
  };
  $('#journey-next')?.addEventListener('click',()=>navigateScene(1));
  $('#journey-prev')?.addEventListener('click',()=>navigateScene(-1));
  onScroll();

  // Hover depth: decorative only, never required to interact with the page.
  const hero=$('#hero-visual');
  if(hero&&!reduceMotion.matches&&window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove',e=>{
      const b=hero.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
      hero.style.transform=`perspective(1400px) rotateY(${x*2.2}deg) rotateX(${-y*2.2}deg)`;
    },{passive:true});
    hero.addEventListener('pointerleave',()=>hero.style.transform='');
  }

  // Video modal - source assigned only on explicit user click.
  const dialog=$('#video-modal'),video=$('#modal-video'),dialogClose=$('#modal-close');
  function closeVideo(){video.pause();video.removeAttribute('src');video.load();dialog.close();}
  $$('.video-review').forEach(button=>button.addEventListener('click',()=>{
    if(!dialog?.showModal){window.open(button.dataset.video,'_blank','noopener,noreferrer');return;}
    video.src=button.dataset.video;
    $('#modal-title').textContent=button.dataset.title||'ویدئوی نمونه';
    dialog.showModal();video.play().catch(()=>{});
  }));
  dialogClose?.addEventListener('click',closeVideo);
  dialog?.addEventListener('click',e=>{if(e.target===dialog)closeVideo();});
  dialog?.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();});

  $$('.faqs details').forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open)$$('.faqs details').filter(other=>other!==item).forEach(other=>other.open=false);
  }));

})();

/* Enhancements for the V2-based homepage: interaction, not a redesign. */
(() => {
'use strict';
const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// Accessible case tabs with actual content changes.
const gallery={
 smile:{title:'جزئیات در طراحی لبخند',subtitle:'زیبایی طبیعی با ارزیابی تخصصی',counter:1,
  images:['photo-1609840114035-3c981b782dfe','photo-1606265752439-1f18756aa5fc','photo-1612277795421-9bc7706a4a41'],alt:'تصاویر نمونه مرتبط با طراحی لبخند'},
 implant:{title:'بازسازی عملکرد لبخند',subtitle:'آشنایی با پروتز و درمان‌های جایگزینی دندان',counter:2,
  images:['photo-1606811971618-4486d14f3f99','photo-1612531386530-97286d97c2d2','photo-1629909613654-28e377c37b09'],alt:'تصاویر نمونه مرتبط با ایمپلنت و پروتز'},
 align:{title:'یک قدم به لبخندی هماهنگ‌تر',subtitle:'بررسی روابط فکی و نظم دندانی پیش از انتخاب درمان',counter:3,
  images:['photo-1606811841689-23dfddce3e95','photo-1588776814546-1ffcf47267a5','photo-1598256989800-fe5f95da9787'],alt:'تصاویر نمونه مرتبط با ارتودنسی'},
 care:{title:'توجه به سلامت دندان‌های طبیعی',subtitle:'معاینه، مراقبت پیشگیرانه و درمان‌های ترمیمی',counter:4,
  images:['photo-1588776814546-1ffcf47267a5','photo-1612531386530-97286d97c2d2','photo-1606811971618-4486d14f3f99'],alt:'تصاویر نمونه مرتبط با درمان‌های ترمیمی'}
};
const tabs=$$('.case-tab');
const stage=$('.case-stage');
const tabPanel=$('#case-stage');
const featureImage=$('#case-feature-image');
const sideOne=$('#case-side-one');
const sideTwo=$('#case-side-two');
const updateTab=tab=>{
 if(!tab||!stage) return;
 const item=gallery[tab.dataset.case];if(!item)return;
 tabs.forEach(t=>{const active=t===tab;t.classList.toggle('is-active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 tabPanel?.setAttribute('aria-labelledby',tab.id);
 const src=(id,w)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
 [featureImage, sideOne, sideTwo].forEach((im,i)=>{
   im.alt=item.alt + [' — تصویر اصلی',' — تصویر دوم',' — تصویر سوم'][i];
   im.src='assets/illustrations/'+(tab.dataset.case==='implant'?'implant':tab.dataset.case==='align'?'align':tab.dataset.case==='care'?'care':'smile')+'.svg';
   im.dataset.photoSrc=src(item.images[i],i===0?1200:700);
   window.loadSamplePhoto?.(im);
 });
 $('#case-feature-title').textContent=item.title;
 $('#case-feature-subtitle').textContent=item.subtitle;
 $('#case-counter').textContent=`${fa(String(item.counter).padStart(2,'0'))} / ۰۴`;
 stage.classList.remove('is-changing');void stage.offsetWidth;stage.classList.add('is-changing');
};
tabs.forEach((tab,i)=>{
 tab.addEventListener('click',()=>updateTab(tab));
 tab.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();
  const dir=e.key==='ArrowRight'?-1:1;
  const target=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+dir+tabs.length)%tabs.length;
  tabs[target].focus();updateTab(tabs[target]);
 });
});

// 3D testimonial cards; click active card to play in existing V2 modal.
const deck=$('#video-deck');
if(deck){
 const cards=$$('.deck-card',deck);
 const dots=$('#deck-dots');
 let active=0,timer=0,startX=null;
 const getRelative=(i)=>{let d=i-active;if(d>cards.length/2)d-=cards.length;if(d<-cards.length/2)d+=cards.length;return d};
 const paint=()=>{
  cards.forEach((card,i)=>{
   const d=getRelative(i);
   card.classList.remove('is-active','is-prev','is-next','is-far-prev','is-far-next');
   if(d===0)card.classList.add('is-active');
   else if(d===-1)card.classList.add('is-prev');
   else if(d===1)card.classList.add('is-next');
   else if(d<0)card.classList.add('is-far-prev');
   else card.classList.add('is-far-next');
   card.tabIndex=(d===0)?0:-1;
   card.setAttribute('aria-hidden',d===0?'false':'true');
  });
  $('#deck-counter-now').textContent=fa(String(active+1).padStart(2,'0'));
  if(dots){$$('.deck-dot',dots).forEach((dot,i)=>{
    dot.classList.toggle('is-active',i===active);
    dot.setAttribute('aria-label',`نمایش ویدئوی ${fa(i+1)}`);
    dot.setAttribute('aria-current',i===active?'true':'false');
  });}
 };
 const next=(dir=1)=>{active=(active+dir+cards.length)%cards.length;paint()};
 cards.forEach((card,i)=>{
  const dot=document.createElement('button');dot.className='deck-dot';dot.type='button';
  dot.addEventListener('click',()=>{active=i;paint();pause();});
  dots?.append(dot);
  card.addEventListener('click',()=>{
    if(active!==i){active=i;paint();pause();return;}
    const modal=$('#video-modal'),video=$('#modal-video');
    if(!modal||!video)return;
    $('#modal-title').textContent=card.dataset.title||'ویدئوی نمونه';
    video.src=card.dataset.video;
    if(typeof modal.showModal==='function')modal.showModal();
    else{window.open(card.dataset.video,'_blank','noopener,noreferrer');return;}
    pause();video.play().catch(()=>{});
  });
 });
 const pause=()=>{clearInterval(timer);timer=0};
 const resume=()=>{if(reduce.matches||timer||document.hidden||$('#video-modal')?.open)return;timer=setInterval(()=>next(1),5800)};
 $('#deck-prev')?.addEventListener('click',()=>{next(-1);pause()});
 $('#deck-next')?.addEventListener('click',()=>{next(1);pause()});
 deck.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse') startX=e.clientX},{passive:true});
 deck.addEventListener('pointerup',e=>{if(startX!==null&&Math.abs(e.clientX-startX)>45){next(e.clientX>startX?-1:1);pause()}startX=null},{passive:true});
 deck.addEventListener('mouseenter',pause);deck.addEventListener('mouseleave',resume);
 deck.addEventListener('focusin',pause);deck.addEventListener('focusout',()=>{if(!deck.contains(document.activeElement))resume()});
 document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
 $('#video-modal')?.addEventListener('close',resume);
 paint();resume();
}

// Duplicate reviews for truly seamless continuous marquee. Pausable by user.
const reviewTrack=$('#reviews-track');const reviewPause=$('#reviews-pause');
if(reviewTrack){
 [...reviewTrack.children].forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');reviewTrack.appendChild(clone)});
 if(reduce.matches) reviewTrack.classList.add('is-paused');
 reviewPause?.addEventListener('click',()=>{
  const paused=reviewTrack.classList.toggle('is-paused');
  reviewPause.setAttribute('aria-pressed',String(paused));
  reviewPause.innerHTML=paused?'ادامه حرکت نظرات <span aria-hidden="true">▶</span>':'توقف حرکت نظرات <span aria-hidden="true">Ⅱ</span>';
 });
}

// Avoid leaving partially loaded images as browser broken-image chrome.
$$('img').forEach(img=>{
 const fail=()=>{img.classList.add('photo-error'); img.dataset.imageFailed='true'};
 img.addEventListener('error',fail,{once:true});
 if(img.complete&&img.naturalWidth===0)fail();
});

// Active nav state for easier orientation.
const navLinks=$$('.desktop-nav a');
const targets=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
 const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(!e.isIntersecting)return;navLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+e.target.id))});
 },{rootMargin:'-25% 0px -55% 0px',threshold:0});
 targets.forEach(t=>activeObserver.observe(t));
}

// Homepage blog previews open meaningful standalone educational excerpts.
const articles={
 checkup:{category:'معاینه و پیشگیری',title:'چه زمان‌هایی بهتر است برای معاینه دندان مراجعه کنیم؟',sections:[
 ['چرا معاینه دوره‌ای مهم است؟','برخی مشکلات دهان و دندان در مراحل اولیه بدون درد محسوس پیش می‌روند. معاینه می‌تواند به شناسایی زودتر تغییرات و برنامه‌ریزی برای مراقبت مناسب کمک کند. فاصله مراجعه برای همه یکسان نیست و بر اساس خطر پوسیدگی، وضعیت لثه و عوامل شخصی مشخص می‌شود.'],
 ['چه علائمی نیازمند بررسی‌اند؟','درد مداوم، خونریزی لثه، حساسیت جدید، تغییر رنگ دندان، زخم دهانی طول‌کشیده و شکستگی ترمیم‌ها از جمله موضوعاتی هستند که بهتر است بررسی شوند. درد شدید همراه با تورم یا علائم عمومی نیازمند رسیدگی سریع است.']]},
 veneers:{category:'زیبایی لبخند',title:'پیش از انتخاب لمینت یا کامپوزیت به چه نکاتی توجه کنیم؟',sections:[
 ['تفاوت روش‌ها چیست؟','کامپوزیت با مواد رزینی مستقیماً روی دندان شکل می‌گیرد؛ ونیرهای سرامیکی معمولاً در لابراتوار ساخته می‌شوند. هرکدام ویژگی‌های متفاوتی از نظر آماده‌سازی دندان، ترمیم‌پذیری و مراقبت دارند.'],
 ['انتخاب درست چگونه انجام می‌شود؟','سلامت لثه، میزان مینای سالم، عادت‌های دهانی، وضعیت بایت و اهداف زیبایی باید بررسی شوند. هر روش درمانی محدودیت‌هایی دارد و هیچ‌کدام برای همه افراد انتخاب یکسانی نیست.']]},
 implant:{category:'جایگزینی دندان',title:'ایمپلنت یا بریج؛ تفاوت چیست و چه عواملی مهم‌اند؟',sections:[
 ['دو روش با شرایط متفاوت','ایمپلنت یک پایه جایگزین ریشه دندان در استخوان فک است؛ بریج به کمک دندان‌های مجاور فضای بی‌دندانی را پر می‌کند. طراحی هر دو روش به شرایط فرد و سلامت دهان بستگی دارد.'],
 ['چه نکاتی باید بررسی شوند؟','سلامت لثه، وضعیت استخوان، شرایط دندان‌های کناری، وضعیت عمومی سلامت و مراقبت‌های بعدی در انتخاب مؤثرند. توصیه نهایی فقط پس از معاینه و در صورت لزوم تصویربرداری مناسب ارائه می‌شود.']]}
};
const articleModal=$('#article-modal');
$$('.journal-card [data-article]').forEach(a=>a.addEventListener('click',event=>{
 event.preventDefault();const article=articles[a.dataset.article];if(!article||!articleModal)return;
 $('#article-modal-category').textContent=article.category;
 $('#article-modal-title').textContent=article.title;
 const body=$('#article-modal-content');body.replaceChildren();
 article.sections.forEach(([heading,paragraph])=>{
   const h=document.createElement('h3');h.textContent=heading;
   const p=document.createElement('p');p.textContent=paragraph;
   body.append(h,p);
 });
 if(typeof articleModal.showModal==='function')articleModal.showModal();
}));
$('#article-modal-close')?.addEventListener('click',()=>articleModal.close());
$('#article-consult')?.addEventListener('click',()=>articleModal.close());
articleModal?.addEventListener('click',event=>{if(event.target===articleModal)articleModal.close()});

})();

/* Final pass: sample image fallback, independent process accordion and working booking wizard. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const numerals=v=>String(v).replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
 const showPhoto=img=>{
   const photo=img.dataset.photoSrc;
   if(!photo || img.dataset.photoLoaded==='true') return;
   // Keep an optimized, relevant local illustration visible while checking the optional remote stock photo.
   const preview=new Image();
   preview.onload=()=>{if(img.dataset.photoSrc===photo){img.src=photo;img.dataset.photoLoaded='true';}};
   preview.onerror=()=>{img.dataset.photoLoaded='failed';};
   preview.src=photo;
 };
 window.loadSamplePhoto=showPhoto;
 $$('img[data-photo-src]').forEach(img=>{
   if(!img.classList.contains('hero-photo') && 'IntersectionObserver' in window){
     const obs=new IntersectionObserver((entries,o)=>{if(entries.some(e=>e.isIntersecting)){showPhoto(img);o.unobserve(img)}},{rootMargin:'250px'});
     obs.observe(img);
   } else showPhoto(img);
 });

 // The five steps are a separate interactive section. Expand the selected step.
 $$('.care-guide-steps details').forEach(details=>{
   details.addEventListener('toggle',()=>{
     if(!details.open)return;
     $$('.care-guide-steps details').forEach(other=>{if(other!==details && other.open)other.open=false});
   });
 });

 const form=$('#booking-form'),wizard=$('#booking-wizard'),result=$('#booking-result');
 if(!form||!wizard||!result) return;
 const steps=$$('.wizard-page',form),progress=$$('[data-progress]',wizard),error=$('#wizard-error');
 const inputName=form.elements.namedItem('name'),inputPhone=form.elements.namedItem('phone');
 const fieldDate=$('#booking-date');
 const today=new Date();
 const localISO=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 if(fieldDate)fieldDate.min=localISO;
 let active=1;
 function visit(step){
   active=step;
   steps.forEach(panel=>{
     const visible=Number(panel.dataset.step)===step;
     panel.hidden=!visible;
     panel.classList.toggle('is-current',visible);
   });
   progress.forEach(el=>{
     const n=Number(el.dataset.progress);
     el.classList.toggle('is-current',n===step);
     el.classList.toggle('is-complete',n<step);
   });
   result.hidden=true;
   if(error){error.hidden=true;error.textContent='';}
   const legend=steps.find(panel=>Number(panel.dataset.step)===step)?.querySelector('legend');
   if(legend && !reduced)legend.scrollIntoView({behavior:'smooth',block:'nearest'});
 }
 const validName=()=>String(inputName.value||'').trim().length>=3;
 const validPhone=()=>{
   const n=numerals(inputPhone.value).replace(/[\s()\-]/g,'');
   return /^09\d{9}$/.test(n) || /^989\d{9}$/.test(n) || /^\+989\d{9}$/.test(n);
 };
 const invalid=(field,message)=>{
   error.textContent=message;error.hidden=false;
   if(field){field.setAttribute('aria-invalid','true');field.focus();}
 };
 function validateStepTwo(){
   if(!validName()){invalid(inputName,'لطفاً نام و نام خانوادگی را با حداقل سه حرف وارد کنید.');return false;}
   if(!validPhone()){invalid(inputPhone,'لطفاً یک شماره موبایل معتبر ایران وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷.');return false;}
   const privacy=form.elements.namedItem('privacy');
   if(!privacy.checked){invalid(privacy,'لطفاً تأیید کنید که این فرم هنوز به سامانه نوبت‌دهی متصل نیست.');return false;}
   return true;
 }
 $$('[data-next]',form).forEach(btn=>btn.addEventListener('click',()=>{
   const target=Number(btn.dataset.next);
   if(active===1 && fieldDate.value && fieldDate.value<localISO){
     fieldDate.focus();fieldDate.setCustomValidity('تاریخ پیشنهادی نمی‌تواند در گذشته باشد.');fieldDate.reportValidity();return;
   }
   if(active===2 && !validateStepTwo())return;
   if(target===3)fillSummary();
   visit(target);
 }));
 fieldDate?.addEventListener('input',()=>fieldDate.setCustomValidity(''));
 $$('[data-back]',form).forEach(btn=>btn.addEventListener('click',()=>visit(Number(btn.dataset.back))));
 [inputName,inputPhone].forEach(el=>el.addEventListener('input',()=>{el.removeAttribute('aria-invalid');if(error){error.hidden=true;error.textContent='';}}));
 const vals=()=>{
   const fd=new FormData(form);
   return {service:String(fd.get('service')||'مشاوره اولیه'),date:String(fd.get('date')||'هماهنگی با پذیرش'),time:String(fd.get('time')||'هماهنگی تلفنی'),name:String(fd.get('name')||'').trim(),phone:String(fd.get('phone')||'').trim(),note:String(fd.get('note')||'').trim()};
 };
 const labels=[['نام','name'],['شماره تماس','phone'],['خدمت','service'],['تاریخ پیشنهادی','date'],['بازه زمانی','time'],['یادداشت کوتاه','note']];
 function fillSummary(){
   const data=vals(),container=$('#booking-summary');container.replaceChildren();
   labels.filter(([label,key])=>key!=='note'||data.note).forEach(([label,key])=>{
     const pair=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
     dt.textContent=label;dd.textContent=data[key];pair.append(dt,dd);container.append(pair);
   });
 }
 form.addEventListener('submit',e=>{
   e.preventDefault();
   if(!validateStepTwo()){visit(2);validateStepTwo();return;}
   const d=vals();
   $('#booking-draft').value=[
     'درخواست هماهنگی نوبت دندانپزشکی',
     `نام: ${d.name}`,
     `شماره موبایل: ${d.phone}`,
     `خدمت درخواستی: ${d.service}`,
     `تاریخ پیشنهادی: ${d.date}`,
     `بازه زمانی: ${d.time}`,
     ...(d.note?[`توضیح کوتاه: ${d.note}`]:[]),
     '',
     'این متن پیش‌نویس است و به کلینیک ارسال نشده است.'
   ].join('\n');
   steps.forEach(page=>{page.hidden=true;page.classList.remove('is-current')});
   result.hidden=false;
   progress.forEach(p=>{p.classList.remove('is-current');p.classList.add('is-complete')});
   result.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});
 });
 $('#booking-edit')?.addEventListener('click',()=>visit(2));
 $('#booking-copy')?.addEventListener('click',async()=>{
   const content=$('#booking-draft').value,feedback=$('#copy-feedback');
   try{
     if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(content);
     else{
       $('#booking-draft').focus();$('#booking-draft').select();
       if(!document.execCommand('copy'))throw new Error('Clipboard unavailable');
     }
     feedback.textContent='متن درخواست در کلیپ‌بورد کپی شد.';
   } catch{
     $('#booking-draft').focus();$('#booking-draft').select();
     feedback.textContent='متن انتخاب شد؛ آن را به صورت دستی کپی کنید.';
   }
 });
 $('#booking-download')?.addEventListener('click',()=>{
   const blob=new Blob(['\ufeff'+$('#booking-draft').value],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='dental-appointment-request.txt';document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1200);
 });

 // Service choice helpers: selecting a service outside wizard prefills step one and scrolls to booking.
 const services=['ایمپلنت و پروتز','زیبایی لبخند','معاینه و مراقبت','ارتودنسی','ترمیم و درمان ریشه','مشاوره اولیه'];
 $$('.service-photo-card').forEach((card,index)=>{
   card.addEventListener('click',()=>{
     const choice=$(`input[name="service"][value="${services[index%services.length]}"]`,form);
     if(choice)choice.checked=true;
     visit(1);
   });
 });
 $$('.doctor-card a').forEach(a=>a.addEventListener('click',()=>{
   visit(1);
   const c=$('input[value="مشاوره اولیه"]',form);if(c)c.checked=true;
 }));
})();
