const { ApolloServer, gql } = require("apollo-server");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { users, events, locations, participants } = require("./data.json");

const typeDefs = gql`

    type User {
        id: String
        username: String
        email: String
        events: [Event]
    }
 
    type Event {
        id: Int
        title: String
        desc: String
        date: String
        from: String
        to: String
        location_id: Int
        user_id: Int
        locations: Location
        participants: [Participant]
        users: [User]
    }

    type Location{
        id: Int
        name: String
        desc: String
        lat: Float
        lng: Float
    }

    type Participant {
        id: Int
        user_id: Int
        event_id: Int
    }

    type Query {
        users: [User] 
        user(id: Int!): User

        events: [Event]
        event(id: Int!): Event

        locations: [Location]
        location(id: Int!): Location

        participants: [Participant]
        participant(id: Int!): Participant


    }


`;

const resolvers = {
    Query: {
        //users
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),

    //events
    events: () => events,
    event: (parent, args) => events.find((event) => event.id === args.id),

    //locations
    locations: () => locations,
    location: (parent, args) => locations.find((location) => location.id === args.id),

    //participants
    participants: () => participants,
    participant: (parent, args) => participants.find((participant) => participant.id === args.id),
    },

    Event : {
        users: (parent, args) => users.find((user) => user.id === parent.user_id),
        locations: (parent, args) => locations.find((location) => location.id === parent.location_id),
        participants: (parent, args) => participants.filter((participant) => participant.event_id === parent.id && participant.user_id === parent.user_id),
    },

    User : {
        events: (parent, args) => events.filter((event) => event.user_id === parent.id),
    }

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});