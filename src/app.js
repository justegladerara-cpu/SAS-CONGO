/* Progressive enhancement. Pages, navigation and forms are present in HTML. */
'use strict';
const en=document.documentElement.lang==='en';
const t=(fr,eng)=>en?eng:fr;
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const menu=$('.menu-toggle'),nav=$('.primary-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?t('Fermer le menu','Close menu'):t('Ouvrir le menu','Open menu'));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');$$('.mega[open]').forEach(d=>d.open=false);}});
document.addEventListener('click',e=>{$$('.mega[open]').forEach(d=>{if(!d.contains(e.target))d.open=false;});});
window.addEventListener('scroll',()=>$('.site-header')?.classList.toggle('scrolled',scrollY>20),{passive:true});
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);} }),{threshold:.05});$$('.reveal').forEach(el=>observer.observe(el));}
/* No fabricated statistics: animation runs only after a validated numeric value is supplied. */
$$('[data-count]').forEach(el=>{const n=Number(el.dataset.count);if(!Number.isFinite(n)||!el.dataset.count)return;let start;const tick=time=>{start??=time;const p=Math.min((time-start)/900,1);el.textContent=Math.round(n*p).toLocaleString(en?'en-GB':'fr-FR');if(p<1)requestAnimationFrame(tick);};if(matchMedia('(prefers-reduced-motion: reduce)').matches)el.textContent=n;else requestAnimationFrame(tick);});
let consent=null;try{consent=JSON.parse(localStorage.getItem('sas-cookie-consent'));}catch{}
const cookie=$('.cookie-banner');if(cookie&&!consent)cookie.hidden=false;
const updateMaps=()=>{$$('[data-load-map]').forEach(button=>{button.textContent=consent?.external?t('Afficher la carte Google Maps','Show Google Maps'):t('Autoriser Google Maps et afficher la carte','Allow Google Maps and show map');});};
$$('[data-cookie-choice]').forEach(button=>button.addEventListener('click',()=>{consent={external:button.dataset.cookieChoice==='accept',savedAt:new Date().toISOString()};try{localStorage.setItem('sas-cookie-consent',JSON.stringify(consent));}catch{}cookie.hidden=true;updateMaps();if(!consent.external&&$('iframe[data-consented-map]'))location.reload();}));
$$('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{cookie.hidden=false;cookie.querySelector('button').focus();}));
$$('[data-load-map]').forEach(button=>button.addEventListener('click',()=>{consent={external:true,savedAt:new Date().toISOString()};try{localStorage.setItem('sas-cookie-consent',JSON.stringify(consent));}catch{}const frame=document.createElement('iframe');frame.dataset.consentedMap='true';frame.src='https://maps.google.com/maps?q=SAS%20Congo%20Pointe-Noire%20%40-4.7999%2C11.8489&z=15&output=embed';frame.title=t('Emplacement approximatif du siège SAS Congo','Approximate SAS Congo headquarters location');frame.loading='lazy';frame.referrerPolicy='no-referrer';button.replaceWith(frame);if(cookie)cookie.hidden=true;}));updateMaps();
$$('[data-office]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.office;$$('[data-office]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.office===id)));$$('[data-office-panel]').forEach(panel=>panel.hidden=panel.dataset.officePanel!==id);}));
$$('.map-button').forEach(el=>{const activate=()=>{$(`[data-office="${el.dataset.mapOffice}"]`)?.click();};el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});});
/* Real server acknowledgement is required before showing success. */
$$('form[data-netlify]').forEach(form=>{
 form.addEventListener('submit',async e=>{
  e.preventDefault();const status=$('.form-status',form);status.classList.remove('error');
  if(!form.reportValidity())return;
  if(form.elements['bot-field']?.value){status.textContent=t('Envoi refusé.','Submission rejected.');return;}
  const file=form.querySelector('input[type=file]')?.files?.[0];
  if(file&&(!/\.(pdf|docx)$/i.test(file.name)||file.size>5*1024*1024)){status.classList.add('error');status.textContent=t('Le CV doit être un fichier PDF ou DOCX de 5 Mo maximum.','Your CV must be a PDF or DOCX file, no larger than 5 MB.');return;}
  const submit=form.querySelector('button[type=submit]');submit.disabled=true;status.textContent=t('Envoi en cours…','Sending…');
  try{
   if(['localhost','127.0.0.1',''].includes(location.hostname))throw new Error('local');
   const data=new FormData(form);const hasFile=Boolean(file);const response=await fetch(form.action,{method:'POST',body:hasFile?data:new URLSearchParams(data),headers:hasFile?{}:{'Content-Type':'application/x-www-form-urlencoded'},credentials:'same-origin'});
   if(!response.ok)throw new Error('server');
   location.assign(form.dataset.success);
  }catch(err){status.classList.add('error');status.textContent=err.message==='local'?t('Prévisualisation locale : aucun dossier n’a été envoyé. Le traitement nécessite le déploiement et l’activation de Netlify Forms.','Local preview: nothing was submitted. Processing requires deployment and activation of Netlify Forms.'):t('L’envoi n’a pas abouti. Réessayez ou contactez le secrétariat par e-mail.','Your submission could not be sent. Please retry or email the secretariat.');submit.disabled=false;}
 });
});
/* Four-step quote form. Without JS, every fieldset stays visible and submit works. */
const quote=$('[data-quote-form]');
if(quote){
 const steps=$$('[data-step]',quote),progress=$('progress',quote),label=$('[data-step-label]',quote),next=$('[data-next]',quote),back=$('[data-back]',quote),send=$('button[type=submit]',quote);let step=0;
 const selected=new URLSearchParams(location.search).get('service');$$('input[name=services]',quote).forEach(input=>{if(input.value===selected)input.checked=true;});
 const show=()=>{steps.forEach((el,i)=>el.hidden=i!==step);progress.value=step+1;label.textContent=t(`Étape ${step+1} sur 4`,`Step ${step+1} of 4`);back.hidden=step===0;next.hidden=step===3;send.hidden=step!==3;if(step===3){const recap=$('[data-recap]',quote);recap.replaceChildren();const labels={services:t('Besoins','Requirements'),people:t('Nombre de personnes','Headcount'),profiles:t('Profils','Roles'),environment:t('Environnement','Environment'),duration:t('Durée','Duration'),start:t('Démarrage','Start date'),location:t('Lieu','Location'),company:t('Société','Company'),name:t('Nom','Name'),role:t('Fonction','Role'),email:'E-mail',phone:t('Téléphone','Phone'),country:t('Pays','Country')};for(const [key,title]of Object.entries(labels)){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;const values=new FormData(quote).getAll(key);dd.textContent=key==='services'?values.map(v=>quote.querySelector(`input[value="${CSS.escape(v)}"]`)?.closest('label').textContent.trim()||v).join(', '):values.join(', ')||t('Non renseigné','Not supplied');recap.append(dt,dd);}}};
 const check=()=>{if(step===0&&!quote.querySelector('input[name=services]:checked')){$('.form-status',quote).textContent=t('Sélectionnez au moins un besoin.','Choose at least one requirement.');return false;}for(const input of $$('input,select,textarea',steps[step]))if(!input.reportValidity())return false;$('.form-status',quote).textContent='';return true;};
 next.hidden=false;next.addEventListener('click',()=>{if(check()){step++;show();steps[step].querySelector('legend').focus();}});back.addEventListener('click',()=>{step--;show();steps[step].querySelector('legend').focus();});show();
 quote.addEventListener('invalid',e=>{const parent=e.target.closest('[data-step]');if(parent){step=steps.indexOf(parent);show();}},true);
}
const inputRole=$('input[name=position]');if(inputRole){const role=new URLSearchParams(location.search).get('position');if(role)inputRole.value=role;}
const subject=$('form[name^=contact] select[name=subject]');if(subject){const value=new URLSearchParams(location.search).get('subject');if(Array.from(subject.options).some(option=>option.value===value))subject.value=value;}
/* Vacancy filtering: text nodes only, no JSON content interpolated into HTML. */
const jobList=$('[data-job-list]'),filters=$('[data-job-filters]');
if(jobList&&filters){
 fetch('/assets/data/jobs.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(jobs=>{
 const contracts={cdi:['CDI','Permanent'],cdd:['CDD','Fixed term'],freelance:['Freelance','Freelance'],fulltime:['Temps plein','Full time'],parttime:['Temps partiel','Part time'],internship:['Stage','Internship'],temporary:['Temporaire','Temporary'],offshore:['Mission offshore','Offshore assignment']};
 const sectors={oil:['Pétrolier','Oil & Gas'],services:['Parapétrolier','Oilfield services'],industry:['Industriel','Industrial'],maritime:['Maritime','Maritime']};
 const render=()=>{const values=new FormData(filters),q=String(values.get('keywords')||'').toLocaleLowerCase();const selected=jobs.filter(j=>(j.title[en?1:0]+' '+j.description[en?1:0]).toLocaleLowerCase().includes(q)&&(!values.get('location')||j.location===values.get('location'))&&(!values.get('sector')||j.sector===values.get('sector'))&&(!values.get('contract')||j.contract===values.get('contract'))&&(!values.get('remote')||j.remote));jobList.replaceChildren();selected.forEach(j=>{const card=document.createElement('article');card.className='card job-card';const badge=document.createElement('span');badge.className='badge';badge.textContent=j.example?t('EXEMPLE · OFFRE FICTIVE','EXAMPLE · FICTIONAL VACANCY'):t('OFFRE','VACANCY');const h=document.createElement('h3');h.textContent=j.title[en?1:0];const p=document.createElement('p');p.textContent=j.description[en?1:0];const meta=document.createElement('div');meta.className='job-meta';[j.location,(contracts[j.contract]||[j.contract,j.contract])[en?1:0],(sectors[j.sector]||[j.sector,j.sector])[en?1:0]].forEach(v=>{const s=document.createElement('span');s.textContent=v;meta.append(s);});const date=document.createElement('time');date.textContent=j.publishedAt?t('Publié le ','Published ')+new Date(j.publishedAt).toLocaleDateString(en?'en-GB':'fr-FR'):t('[À COMPLÉTER : date de publication d’une offre réelle]','[À COMPLÉTER : real vacancy publication date]');const a=document.createElement('a');a.className='text-link';a.href=`/${en?'en/careers':'fr/carrieres'}/${j.id}/`;a.textContent=t('Voir la fiche','View details');card.append(badge,h,p,meta,date,a);jobList.append(card);});if(!selected.length){const p=document.createElement('p');p.className='empty';p.textContent=t('Aucune offre ne correspond à vos critères. Vous pouvez déposer une candidature spontanée.','No vacancies match your filters. You can submit a speculative application.');jobList.append(p);}$('[data-job-count]').textContent=t(`${selected.length} résultat(s) — offres de démonstration incluses`,`${selected.length} result(s) — includes demonstration vacancies`);};
 filters.addEventListener('input',render);filters.addEventListener('change',render);filters.addEventListener('submit',e=>{e.preventDefault();render();});filters.addEventListener('reset',()=>setTimeout(render,0));render();
 }).catch(()=>{$('[data-job-count]').textContent=t('Le chargement des filtres est indisponible. Les offres restent consultables ci-dessous.','Filters could not load. You can still browse the vacancies below.');});
}
const category=$('[data-article-category]');category?.addEventListener('change',()=>{$$('[data-category]').forEach(card=>card.hidden=category.value!==''&&card.dataset.category!==category.value);});
