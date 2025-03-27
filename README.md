## Limitations

- the website combines contents from XMC and other sources
- manage new pages
- patch operations replace all selected fields, it is not easy to detect what changed
- delete pages not supported
- new pages not supported (replace PATCH with PUT - PUT is upsert operation)

## How to start
- create your .env.local
- npm install
- npm run start
- use ngrok or alternatives to tunnel your local dev middleware
