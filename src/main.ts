import { parse } from 'yaml'
import './style.css'

type Group = { heading?: string; bullets: string[] }
type Item = { title: string; org?: string; tagline?: string; period: string; groups: Group[] }
type Resume = {
  name: string
  contact: string[]
  summary: string
  skills: Record<string, string>
  sections: { title: string; items: Item[] }[]
  education: { school: string; degree: string; period: string }[]
}

// Vite reloads the page when any YAML file changes.
const files = import.meta.glob('../resumes/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const ids = Object.keys(files).map((path) => path.split('/').pop()!.replace('.yaml', ''))
const raw = (id: string) => files[`../resumes/${id}.yaml`]

const esc = (s = '') => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

function contact(c: string) {
  if (c.includes('@')) return `<a href="mailto:${esc(c)}">${esc(c)}</a>`
  if (/^[\w.-]+\.(com|io|dev|me)\//.test(c)) return `<a href="https://${esc(c)}">${esc(c)}</a>`
  return esc(c)
}

function item(it: Item) {
  return `<div class="item">
    <h3><b>${esc(it.title)}</b>${it.org ? `, ${esc(it.org)}` : ''}</h3>
    ${it.tagline ? `<p class="tagline">${esc(it.tagline)}</p>` : ''}
    <p class="period">${esc(it.period)}</p>
    ${it.groups
      .map((g) => `${g.heading ? `<h4>${esc(g.heading)}</h4>` : ''}<ul>${g.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`)
      .join('')}
  </div>`
}

function render(r: Resume) {
  return `<header><h1>${esc(r.name)}</h1><p>${r.contact.map(contact).join('  |  ')}</p></header>
  <h2>Summary</h2><p>${esc(r.summary)}</p>
  <h2>Technical Skills</h2>${Object.entries(r.skills)
    .map(([k, v]) => `<p class="skill"><b>${esc(k)}:</b> ${esc(v)}</p>`)
    .join('')}
  ${r.sections.map((s) => `<h2>${esc(s.title)}</h2>${s.items.map(item).join('')}`).join('')}
  <h2>Education</h2>${r.education
    .map((e) => `<div class="item"><h3><b>${esc(e.school)}</b>, ${esc(e.degree)}</h3><p class="period">${esc(e.period)}</p></div>`)
    .join('')}`
}

function show() {
  const id = ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : ids[0]
  document.querySelector('nav')!.innerHTML =
    ids.map((i) => `<a href="#${i}" class="${i === id ? 'active' : ''}">${i}</a>`).join('') +
    `<button id="export">Export PDF</button>`
  const page = document.querySelector('main')!
  try {
    const r = parse(raw(id)) as Resume
    page.innerHTML = render(r)
    // Chrome uses the page title as the default PDF file name.
    document.title = `Resume_${r.name.replace(/\W/g, '')}_${id}`
  } catch (e) {
    page.innerHTML = `<pre class="error">${esc(`resumes/${id}.yaml: ${(e as Error).message}`)}</pre>`
  }
  document.getElementById('export')!.onclick = () => print()
}

addEventListener('hashchange', show)
show()
