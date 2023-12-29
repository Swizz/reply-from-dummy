module.exports = async function (fastify, opts, done) {
  fastify.get(
    "/post/:id",
    {
      schema: {
        params: {
          id: { type: "number" },
        },
      },
    },
    async function (request, reply) {
      const post = await (await reply.fetch(`/posts/${request.params.id}`)).json()

      if (post.id) {
        const user = await (await reply.fetch(`/users/${post.userId}`)).json()

        post.user = { id: user.id, username: user.username }
        delete post.userId

        post.comments = (
          await (await reply.fetch(`/posts/${request.params.id}/comments`)).json()
        ).comments

        post.comments.forEach((comment) => {
          delete comment.postId
        })
      }

      return post
    },
  )
}
