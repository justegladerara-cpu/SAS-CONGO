// End-to-end checks against the local static server. No production submissions.
const fs=require('fs');
const path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:4173';
 await page.goto(base+'/fr/');await page.evaluate(()=>localStorage.setItem('sas-cookie-consent',JSON.stringify({external:false})));await page.reload();await page.waitForFunction(()=>document.fonts.status==='loaded');await page.screenshot({path:'artifacts/hero-desktop.png'});
 await page.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(img=>img.loading='eager');document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));});await page.waitForTimeout(600);await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
 await page.getByText('Solutions',{exact:true}).first().click();if(!await page.locator('.mega-panel').isVisible())throw Error('mega menu');await page.keyboard.press('Escape');
 await page.goto(base+'/fr/carrieres/');await page.waitForFunction(()=>document.querySelector('[data-job-count]').textContent.includes('résultat'));
 await page.locator('select[name=sector]').selectOption('maritime');if(await page.locator('[data-job-list] article').count()!==1)throw Error('industry filter');
 await page.locator('input[name=remote]').check();if(!await page.locator('[data-job-list] .empty').isVisible())throw Error('empty filter');
 await page.goto(base+'/fr/demande-de-devis/?service=staffing');if(!await page.locator('input[value=staffing]').isChecked())throw Error('service preselection');
 await page.locator('[data-next]').click();await page.locator('input[name=profiles]').fill('Profil de test');await page.locator('input[name=location]').fill('Pointe-Noire');await page.locator('[data-next]').click();
 for(const [name,value]of Object.entries({company:'Test',name:'Utilisateur test',role:'RH',email:'test@example.com',phone:'+242000000000',country:'Congo'}))await page.locator(`form[data-quote-form] [name=${name}]`).fill(value);
 await page.locator('[data-next]').click();if(!(await page.locator('[data-recap]').textContent()).includes('Profil de test'))throw Error('quote recap');
 await page.locator('form[data-quote-form] input[name=consent]').check();await page.locator('form[data-quote-form] button[type=submit]').click();if(!(await page.locator('form[data-quote-form] .form-status').textContent()).includes('aucun dossier'))throw Error('local submit safeguard');
 await page.goto(base+'/fr/contact/');if(await page.locator('iframe').count())throw Error('map before consent');await page.locator('[data-load-map]').click();if(await page.locator('iframe').count()!==1)throw Error('consented map');await page.locator('[data-cookie-settings]').click();await page.locator('[data-cookie-choice=reject]').click();await page.waitForLoadState('load');if(await page.locator('iframe').count())throw Error('map after withdrawal');
 await page.goto(base+'/en/hr-solutions/staffing/');if(await page.locator('html').getAttribute('lang')!=='en')throw Error('English');await page.locator('.faq summary').first().click();if(!await page.locator('.faq details').first().getAttribute('open')&& !await page.locator('.faq details').first().evaluate(el=>el.open))throw Error('FAQ');
 for(const width of [375,480,768,1024,1280]){await page.setViewportSize({width,height:900});await page.goto(base+'/fr/');await page.waitForTimeout(150);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('horizontal overflow at '+width);}
 await page.setViewportSize({width:375,height:812});await page.goto(base+'/fr/');await page.locator('.menu-toggle').click();if(!await page.locator('.primary-nav').isVisible())throw Error('mobile menu');await page.keyboard.press('Escape');await page.screenshot({path:'artifacts/hero-mobile.png'});await page.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(img=>img.loading='eager');document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));});await page.waitForTimeout(600);await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 for(const route of ['/fr/candidature/','/fr/demande-de-devis/','/fr/presence-internationale/','/en/contact/']){await page.goto(base+route);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('mobile page overflow '+route);}
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/fr/');if(await page.locator('.card').first().evaluate(el=>getComputedStyle(el).opacity)!=='1')throw Error('reduced motion');
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: menus, filters, service preselection, four-step quote, recap, local submission safeguard, map consent, English, FAQ, five widths, reduced motion.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
