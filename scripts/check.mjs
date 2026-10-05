// Fails if a resume YAML does not parse or misses a field that the page renders.
import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import assert from 'node:assert/strict'

for (const f of readdirSync('resumes').filter((f) => f.endsWith('.yaml'))) {
  const r = parse(readFileSync(`resumes/${f}`, 'utf8'))
  for (const k of ['name', 'contact', 'summary', 'skills', 'sections', 'education']) assert.ok(r[k], `${f}: missing ${k}`)
  for (const s of r.sections)
    for (const it of s.items) {
      assert.ok(it.title && it.period, `${f}: item without title or period in ${s.title}`)
      for (const g of it.groups) assert.ok(Array.isArray(g.bullets), `${f}: ${it.title} has a group without bullets`)
    }
  console.log(`ok ${f}`)
}
