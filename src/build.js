'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const INPUT_CONFIG = process.env.INPUT_CONFIG || process.argv[2] || 'data/config.yml';
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'dist';
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'index.json';
const LOGO_DIR = process.env.LOGO_DIR || 'logos';
const SUPPORTED_VERSION = '1.0';
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN || 'api.cloudtak.io';

function readYaml(filePath) {
    const contents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(contents, { json: true });
}

function validateConfig(config) {
    if (!config || typeof config !== 'object') {
        throw new Error('Config must be an object.');
    }

    if (config.version !== SUPPORTED_VERSION) {
        throw new Error(`Unsupported api version ${config.version}. Expected ${SUPPORTED_VERSION}.`);
    }

    if (!Array.isArray(config.servers)) {
        throw new Error('Config must include a servers array.');
    }

    config.servers.forEach((server, idx) => {
        if (!server.name || !server.url || !server.logo) {
            throw new Error(`Server at index ${idx} is missing required fields (name, url, logo).`);
        }
    });
}

function encodeLogo(logoFile) {
    const logoPath = path.join(LOGO_DIR, logoFile);
    if (!fs.existsSync(logoPath)) {
        throw new Error(`Logo file not found: ${logoPath}`);
    }

    const buffer = fs.readFileSync(logoPath);
    return buffer.toString('base64');
}

function build() {
    const configPath = path.resolve(INPUT_CONFIG);
    const config = readYaml(configPath);
    validateConfig(config);

    const output = {
        version: config.version,
        generatedAt: new Date().toISOString(),
        servers: config.servers.map((server) => ({
            name: server.name,
            url: server.url,
            logo: {
                filename: server.logo,
                mediaType: 'image/png',
                base64: encodeLogo(server.logo),
            },
        })),
    };

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'CNAME'), `${CUSTOM_DOMAIN}\n`, 'utf8');
    console.log(`Wrote ${output.servers.length} servers to ${outputPath}`);
}

build();
