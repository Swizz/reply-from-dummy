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
      const postRequest = await reply.fetch(`/posts/${request.params.id}`)

      const post = await postRequest.json()

      // we will love to be able to test postRequest.status here instead
      if (post.id) {
        const userRequest = await reply.fetch(`/users/${post.userId}`, {
          method: post.userId !== 39 ? "GET" : "OPTIONS", // Return faked 204 response for userId 39
        })

        // we will love to be able to test userRequest.request status here instead
        if (userRequest.readableLength) {
          const user = await userRequest.json()

          // same here
          if (!user.id) {
            return user // returns instead the parsed error of the userRequest
          }

          post.user = { id: user.id, username: user.username }
        } else {
          post.user = {}
        }
        delete post.userId

        post.comments = (
          await (await reply.fetch(`/posts/${request.params.id}/comments`)).json()
        ).comments

        post.comments.forEach((comment) => {
          delete comment.postId
        })
      }

      return post // returns instead the parsed error of the postRequest
    },
  )
}
