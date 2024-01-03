# Fastify reply-from-dummy

Small repository of codes that serves as exemple of our use case

## Requirements

```txt
node fermium-lts (14)
fastify 2.15.3 (v2)
```

## Run

```cli
npm install
npm run start
```

## Usages

Once started Swagger is served at : http://localhost:3000/docs

Then `Post` id :

- `1-150` for `200` responses
- `100` for `200` response with `204`
- `others` for `404` responses
