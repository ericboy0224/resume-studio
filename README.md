# Resume Studio

Each resume is one YAML file in `resumes/`. The browser shows a live preview and exports the page to PDF.

## Use

1. Run `npm install` one time.
2. Run `npm run dev` and open the URL that Vite shows.
3. Edit a file in `resumes/`. When you save, the page reloads.
4. Click Export PDF, then select "Save as PDF" in the print dialog. The default file name is `Resume_<Name>_<file id>`.

To add a resume, copy `resumes/example.yaml` to `resumes/<name>.yaml` and edit the copy. Git ignores every file in `resumes/` except `example.yaml`, so your resumes stay on your machine.

Run `npm run check` after you edit. It makes sure that the TypeScript compiles and that each YAML file has the fields the page renders.

## Schema

```yaml
name: string
contact: [string]            # email and linkedin.com/... or github.com/... become links
summary: string
skills: { <label>: string }  # one line per label, in file order
sections:                    # for example Experience, Freelance & Side Projects
  - title: string
    items:
      - title: string        # job title or project name, bold
        org: string          # optional, company or client
        tagline: string      # optional, line under the title
        period: string       # dates and location
        groups:
          - heading: string  # optional, project name inside a job
            bullets: [string]
education:
  - { school: string, degree: string, period: string }
```

If a string contains `: ` or starts with a special YAML character, put it in double quotes.
