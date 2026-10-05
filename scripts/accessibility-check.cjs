const fs=require('fs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.emulateMedia({reducedMotion:'reduce'});
const report=[];
for(const route of ['/fr/','/fr/solutions-rh/','/fr/demande-de-devis/','/fr/candidature/','/fr/carrieres/','/fr/contact/','/fr/presence-internationale/','/en/']){
 await page.goto('http://127.0.0.1:4173'+route);
 await page.evaluate(()=>{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));});
 await page.waitForFunction(()=>document.fonts.status==='loaded');
 await page.addScriptTag({path:'artifacts/axe.min.js'});
 const results=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
 report.push({route,violations:results.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
}
fs.writeFileSync('artifacts/accessibility.json',JSON.stringify(report,null,2));
await browser.close();
const count=report.reduce((n,r)=>n+r.violations.length,0);
if(count){console.log(JSON.stringify(report.filter(r=>r.violations.length),null,2));process.exit(1);}
console.log('PASS: no automated WCAG 2.1 A/AA violations on eight representative pages. This is not a certification.');
})().catch(e=>{console.error(e);process.exit(1);});
