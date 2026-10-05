"""Structural checks against every generated HTML file, links, SEO and forms."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json, re

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'
class Document(HTMLParser):
 def __init__(self):
  super().__init__();self.h1=0;self.links=[];self.ids=set();self.duplicates=[];self.forms=[];self.meta={};self.title='';self.in_title=False;self.labels=set();self.fields=[];self.lang='';self.json=[];self.in_json=False;self.buf='';self.alts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if 'id' in a:
   if a['id'] in self.ids:self.duplicates.append(a['id'])
   self.ids.add(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag in ['img','script','link']:
   v=a.get('src') or (a.get('href') if tag=='link' and a.get('rel') in ['stylesheet','icon'] else None)
   if v:self.links.append(v)
  if tag=='img':self.alts.append(a.get('alt'))
  if tag=='form' and 'data-netlify' in a:self.forms.append(a)
  if tag=='label' and a.get('for'):self.labels.add(a['for'])
  if tag in ['input','textarea','select'] and a.get('type') not in ['hidden','checkbox','radio'] and a.get('name')!='bot-field':self.fields.append(a)
  if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True;self.buf=''
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_json:self.json.append(json.loads(self.buf));self.in_json=False
 def handle_data(self,text):
  if self.in_title:self.title+=text
  if self.in_json:self.buf+=text

def main():
 errors=[];pages=json.loads((OUT/'assets/data/pages.json').read_text(encoding='utf-8'));titles={'fr':set(),'en':set()};descs={'fr':set(),'en':set()}
 for p in pages:
  file=OUT/p['path'].lstrip('/')/'index.html';text=file.read_text(encoding='utf-8');d=Document();d.feed(text)
  def check(test,msg):
   if not test:errors.append(p['path']+': '+msg)
  check(d.h1==1,'exactly one H1');check(not d.duplicates,'duplicate HTML ids');check(d.lang==p['lang'],'document language');check(len(d.title)<=60,'title length');check(len(d.meta.get('description',''))<=155,'description length');check(all(v is not None for v in d.alts),'image alt');check(d.title not in titles[p['lang']],'duplicate title');titles[p['lang']].add(d.title)
  check(d.meta.get('description') not in descs[p['lang']],'duplicate description');descs[p['lang']].add(d.meta.get('description'))
  check((OUT/p['alternate'].lstrip('/')/'index.html').exists(),'alternate exists')
  for href in d.links:
   u=urlparse(href)
   if u.scheme or u.netloc:continue
   if u.path.startswith('/'):
    target=OUT/unquote(u.path).lstrip('/');target=target/'index.html' if target.is_dir() or u.path.endswith('/') else target
    check(target.exists(),'missing local target '+href)
   if not u.path and u.fragment:check(u.fragment in d.ids,'missing anchor '+href)
  for form in d.forms:check(form.get('method')=='POST' and form.get('netlify-honeypot')=='bot-field','Netlify form configuration')
  for f in d.fields:check(f.get('id') in d.labels,'missing field label '+str(f.get('name')))
  graphs=[item for ld in d.json for item in ld.get('@graph',[])]
  if '/example-' in p['path']:check(all(g.get('@type')!='JobPosting' for g in graphs),'fictional JobPosting prohibited');check('noindex' in d.meta.get('robots',''),'example noindex')
 if errors:print('\n'.join(errors));raise SystemExit(1)
 print(f'PASS: {len(pages)} pages, local links, H1, labels, bilingual alternates, unique SEO and fictional vacancy safeguards.')
if __name__=='__main__':main()
