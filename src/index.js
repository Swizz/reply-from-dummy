const pkg = require("../package.json")

const fastify = require("fastify")({ logger: true })

fastify.use(require("cors")({ origin: "*" }))

// Add swagger for testing purposes
fastify.register(require("fastify-oas"), {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: pkg.name,
      description: pkg.description,
      version: pkg.version,
    },
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    host: "localhost:3000",
  },
})

fastify.register(require("@fastify/reply-from"), {
  base: "https://dummyjson.com",
})

fastify.decorateReply("fetch", function (source, opts) {
  return new Promise((resolve) => {
    this.from(source, {
      ...opts,
      onResponse(_, response, result) {
        response.removeHeader("content-length")

        resolve(result) // Should resolve to the fetch response object instead of the stream
      },
      rewriteRequestHeaders(_, headers) {
        // disable remote cache for testing purposes
        return {
          ...headers,
          accept: "application/json",
          "accept-encoding": "identity",
          "if-none-match": null,
          "if-modified-since": null,
        }
      },
    })
  })
})

fastify.register(require("./routes"))

fastify.listen(3000)
