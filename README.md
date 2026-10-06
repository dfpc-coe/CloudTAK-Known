<h1 align='center'>CloudTAK Known Servers API</h1>

A tiny Node.js + GitHub Actions pipeline that converts a YAML manifest of CloudTAK servers into a JSON payload published to GitHub Pages (custom domain: `api.cloudtak.io`). Logos are pulled from `logos/` and base64-encoded at build time.

## Addition Policy

Only government affiliated TAK programs will be considered for the servers list.

Integrations are ETL tasks maintained in the `dfpc-coe` GitHub organization that bring non-TAK data sources into CloudTAK.
The list is consumed by [CloudTAK-Docs](https://github.com/dfpc-coe/CloudTAK-Docs) to build the Integrations overview page.

## YAML schema (`data/config.yml`)

```yaml
version: "1.0"
servers:
  - name: COTAK
    logo: cotak.png
    url: map.cotak.gov
integrations:
  - name: CalTopo
    description: Ingests map objects from a shared CalTopo map
    url: https://github.com/dfpc-coe/etl-caltopo
```

`description` is optional for integrations and is shown on the documentation overview tile when present.
