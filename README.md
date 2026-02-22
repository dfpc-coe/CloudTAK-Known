<h1 align='center'>CloudTAK Known Servers API</h1>

A tiny Node.js + GitHub Actions pipeline that converts a YAML manifest of CloudTAK servers into a JSON payload published to GitHub Pages (custom domain: `api.cloudtak.io`). Logos are pulled from `logos/` and base64-encoded at build time.

## YAML schema (`data/config.yml`)

```yaml
version: "1.0"
servers:
  - name: COTAK
    logo: cotak.png
    url: map.cotak.gov
```
