const { withFilter } = require("graphql-yoga");


const Subscription = {
    userCreated: {
        subscribe: withFilter(
            (_,__, { pubsub }) => pubsub.asyncIterator("userCreated"),
            (payload, variables) => {
                //console.log("payload", payload)
               //console.log("variables", variables)

                return variables.id ? payload.userCreated.id === variables.id : true;
            }
        )
    },

    eventCreated: {
        subscribe: (_,__, { pubsub }) => pubsub.asyncIterator("eventCreated")
    },

    participantCreated: {
        subscribe: (_,__, { pubsub }) => pubsub.asyncIterator("participantCreated")
    },
}

module.exports = Subscription;