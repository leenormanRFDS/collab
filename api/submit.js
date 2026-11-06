/**
 * OPTIONAL email endpoint for COLLAB, intended for Vercel Node functions.
 * Disabled until RESEND_API_KEY, COLLAB_FROM_EMAIL, COLLAB_ALLOWED_ORIGIN and
 * COLLAB_SUBMISSIONS_ENABLED=true are configured. A staff SSO/auth layer is
 * REQUIRED before any production RFDS use; an Origin check is not authentication.
 */
const DESTINATION = 'lee.norman@flyingdoctor.net';
function clean(value, max = 4000) { return String(value ?? '').trim().slice(0, max); }
function esc(value){ return clean(value, 12000).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function line(label,value){return `<tr><td style="font:600 12px Arial;color:#466;white-space:nowrap;padding:9px;vertical-align:top">${esc(label)}</td><td style="font:14px/1.5 Arial;padding:9px;white-space:pre-wrap">${esc(value||'Not supplied')}</td></tr>`;}
function safePart(s){return clean(s,40).replace(/[^a-z0-9\- ]/gi,'-').replace(/\s+/g,'-').toLowerCase()||'concept';}

module.exports = async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 if(process.env.COLLAB_SUBMISSIONS_ENABLED!=='true'||!process.env.RESEND_API_KEY||!process.env.COLLAB_FROM_EMAIL||!process.env.COLLAB_ALLOWED_ORIGIN){return res.status(503).json({error:'Email delivery has not been configured. Use the email draft fallback.'});}
 if(req.headers.origin!==process.env.COLLAB_ALLOWED_ORIGIN)return res.status(403).json({error:'Origin not allowed'});
 let body; try {body=typeof req.body==='string'?JSON.parse(req.body):req.body;} catch(e) {return res.status(400).json({error:'Invalid JSON'});}
 if(!body||JSON.stringify(body).length>3000000)return res.status(413).json({error:'Brief or attachments too large for email. Use a local export.'});
 const c=body.concept;
 if(!c||typeof c!=='object'||typeof c.title!=='string'||typeof c.summary!=='string'||!c.title.trim()||!c.summary.trim())return res.status(400).json({error:'Missing title or summary'});
 const author=clean(body.author||c.createdBy||'Colleague',80);
 const status=clean(c.status,50);
 const journey=Array.isArray(c.journey)?c.journey.slice(0,25).map((n,i)=>`${i+1}. ${clean(n.type,50)} — ${clean(n.note,500)}`).join('\n'):'';
 const rows=[
 ['Idea',c.summary],['Campaign type',c.category],['Objective',c.objective],['Audience',Array.isArray(c.audience)?c.audience.join(', '):''],
 ['Audience insight',c.insight],['Creative notes',c.creativeNotes],['Colours',Array.isArray(c.colourChoices)?c.colourChoices.join(', '):''],
 ['Font',c.fontPreference],['Style',c.styleKeywords],['Avoid',c.thingsToAvoid],['Creative link',c.assetLink],
 ['Headline',c.headline],['Suggested copy',c.bodyCopy],['CTA',c.cta],['Claims/checks',c.proof],
 ['Visitor journey',journey],['Primary KPI',c.outcomes?.primary],['Target',c.outcomes?.target],
 ['Secondary KPI',c.outcomes?.secondary],['Budget',c.outcomes?.budget],['Launch timing',c.outcomes?.launch],['Notes',c.notes]
 ];
 const report=`<!doctype html><html><head><meta charset="utf-8"><title>COLLAB — ${esc(c.title)}</title></head><body style="font:16px Arial,sans-serif;color:#111"><h1 style="font-size:36px;letter-spacing:-2px">COL<span style="color:#008dc7">LAB</span></h1><h2>${esc(c.title)}</h2><p>From ${esc(author)} · RFDS SA/NT · ${esc(status)}</p><table style="border-collapse:collapse">${rows.map(([key,val])=>line(key,val)).join('')}</table><p>Images, if included, are separate attachments. Check all approvals and claims before publication.</p></body></html>`;
 const assets=Array.isArray(c.assets)?c.assets.slice(0,8):[];
 const attachments=[{filename:`COLLAB-${safePart(c.title)}-brief.html`,content:Buffer.from(report).toString('base64')}];
 let imageCount=0;
 for(const a of assets){
  if(!a||typeof a.data!=='string')continue;
  const match=/^data:image\/jpeg;base64,([a-zA-Z0-9+/=]+)$/.exec(a.data);
  if(!match)continue;
  if(match[1].length>600000)continue;
  imageCount++;
  attachments.push({filename:`reference-${imageCount}.jpg`,content:match[1]});
 }
 const email={
  from:process.env.COLLAB_FROM_EMAIL,
  to:[DESTINATION],
  subject:`COLLAB: ${clean(c.title,100)} — ${author}`,
  html:`<main style="font:16px Arial,sans-serif;max-width:620px"><h1 style="font-size:36px;letter-spacing:-2px">COL<span style="color:#008dc7">LAB</span></h1><p><b>${esc(author)}</b> has a new RFDS SA/NT fundraising concept for you.</p><h2>${esc(c.title)}</h2><p>${esc(c.summary)}</p><p><b>Campaign type:</b> ${esc(c.category)}<br><b>Primary KPI:</b> ${esc(c.outcomes?.primary)}<br><b>References attached:</b> ${imageCount} of ${assets.length}</p><p>The full written brief is attached as HTML. Please check any impact statements, imagery permissions, and medical claims before publication.</p></main>`,
  attachments,
 };
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(email)});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){console.error('COLLAB email provider error',response.status,JSON.stringify(payload).slice(0,500));return res.status(502).json({error:'Email provider rejected the request. A draft can be opened instead.'});}
  return res.status(200).json({sent:true,id:payload.id||null});
 }catch(error){console.error('COLLAB email unavailable',error);return res.status(502).json({error:'Email service unavailable.'});}
};
