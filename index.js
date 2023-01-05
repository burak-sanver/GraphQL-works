const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

const { users, events, locations, participants } = require("./data.json");

const typeDefs = `

    # User
    type User {
        id: ID!
        username: String!
        email: String!
        events: [Event!]!
    }

    input CreateUserInput {
        username: String!
        email: String!
    }

    input UpdateUserInput {
        username: String
        email: String
    }
 
    # Event
    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String
        from: String
        to: String
        location_id: ID
        user_id: ID
        locations: Location!
        participants: [Participant!]!
        users: [User!]!
    }

    input CreateEventInput {
        title: String!
        desc: String!
    }

    input UpdateEventInput {
        title: String
        desc: String
    }

    # Location
    type Location{
        id: ID!
        name: String!
        desc: String!
        lat: Float
        lng: Float
    }

    input CreateLocationInput {
        name: String!
        desc: String!
    }

    input UpdateLocationInput {
        name: String
        desc: String
    }

    # Participant
    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
    }

    input CreateParticipantInput {
        user_id: ID!
        event_id: ID!
    }

    input UpdateParticipantInput {
        user_id: ID
        event_id: ID
    }

    type DeleteAllOutput {
        count: Int!
      }

    type Query {
        users: [User!]! 
        user(id: ID!): User!

        events: [Event!]!
        event(id: ID!): Event!

        locations: [Location!]!
        location(id: ID!): Location!

        participants: [Participant!]!
        participant(id: ID!): Participant!
    }

    type Mutation {
        # User
        createUser(data: CreateUserInput): User!
        updateUser(id: ID, data: UpdateUserInput): User!
        deleteUser(id: ID): User!
        deleteAllUsers: DeleteAllOutput! 

        # Event 
        createEvent(data: CreateEventInput): Event!
        updateEvent(id: ID, data: UpdateEventInput): Event!
        deleteEvent(id: ID): Event!
        deleteAllEvents: DeleteAllOutput! 


        # Location
        createLocation(data: CreateLocationInput): Location!
        updateLocation(id: ID, data: UpdateLocationInput): Location!
        deleteLocation(id: ID): Location!
        deleteAllLocations: DeleteAllOutput!

        # Participant
        createParticipant(data: CreateParticipantInput): Participant!
        updateParticipant(id: ID, data: UpdateParticipantInput): Participant!
        deleteParticipant(id: ID): Participant!
        deleteAllParticipants: DeleteAllOutput! 
     }

     type Subscription {
        # User
        userCreated: User!
        userUpdated: User!
        userDeleted: User!

        # Event
        eventCreated: Event!
        eventUpdated: Event!
        eventDeleted: Event!

        # Location
        locationCreated: Location!
        locationUpdated: Location!
        locationDeleted: Location!

        participantCreated: Participant!
        participantUpdated: Participant!
        participantDeleted: Participant!
     }
`;



const resolvers = {

    Subscription: {
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
    },

    Mutation : {
        // User

        createUser: (parent, { data }) =>{
            const user = {
                id: uid(),
                ...data,
            }

            users.push(user);
            pubsub.publish("userCreated", { userCreated: user })
            return user;
        },

        updateUser: (parent, { id, data }) => {
            const user_index = users.findIndex((user) => user.id = id);
            if (user_index === -1) {
                throw new Error('User not found!');
            }

            const updated_user = (users[user_index] = {
                ...users[user_index],
                ...data,
              });

              return updated_user;
        },

        deleteUser: (parent, { id }) => {
            const user_index = users.findIndex((user) => user.id == id);

            if (user_index === -1) {
                throw new Error('User not found!');
            }

            const deleted_user = users[user_index] 
            users.splice(user_index, 1)
            return deleted_user;
        },

        deleteAllUsers: () => {
            const length = users.length;
            users.splice(0, length);

            return {
                count: length
            }
        },

        // Event

        createEvent: (parent, { data }) => {
            const event = {
                id: uid(),
                ...data
            }

            events.push(event)
            pubsub.publish("eventCreated", { eventCreated: event })
            return event;
        },

        updateEvent: (parent, { id, data }) => {
            const event_index = events.findIndex((event) => event.id = id);

            if (event_index === -1) {
                throw new Error('Event not found!')
            }

            const updated_event = events[event_index] = {
                ...events[event_index],
                ...data
            }

            return updated_event;

        },

        deleteEvent: (parent, { id }) => {
            const event_index = events.findIndex((event) => event.id == id);

            if (event_index === -1) {
                throw new Error('event not found!');
            }

            const deleted_event = events[event_index] 
            events.splice(event_index, 1)
            return deleted_event;
        },

        deleteAllEvents: () => {
            const length = events.length;
            events.splice(0, length);
            return {
                count: length
            }
        },

        //location
        createLocation: (parent, { data }) => {
            const location = {
                id: uid(),
                ...data,
            }

            locations.push(location);
            return location;
        },

        updateLocation: (parent, { id, data }) => {
            const location_index = locations.findIndex((location) => location.id = id);

            if (location_index === -1) {
                throw new Error('location not found!')
            }

            const updated_location = locations[location_index] = {
                ...locations[location_index],
                ...data
            }

            return updated_location;

        },

        deleteLocation: (parent, { id }) => {
            const location_index = locations.findIndex((location) => location.id == id);

            if (location_index === -1) {
                throw new Error('location not found!');
            }

            const deleted_location = locations[location_index] 
            events.splice(location_index, 1)
            return deleted_location;
        },

        deleteAllLocations: () => {
            const length = locations.length;
            locations.splice(0, length);
            return {
                count: length
            }
        },


        // participant
        createParticipant: (parent, { data }) => {
            const participant = {
                id: uid(),
                ...data,
            }

            participants.push(participant);
            pubsub.publish("participantCreated", { participantCreated: participant })
            return participant;
        },

        updateParticipant: (parent, { id, data }) => {
            const participant_index = participants.findIndex((participant) => participant.id = id);

            if (participant_index === -1) {
                throw new Error('Participant not found!')
            }

            const updated_participant = participants[participant_index] = {
                ...participants[participant_index],
                ...data
            }

            return updated_participant;

        },

        deleteParticipant: (parent, { id }) => {
            const participant_index = participants.findIndex((participant) => participant.id == id);

            if (participant_index === -1) {
                throw new Error('participant not found!');
            }

            const deleted_participant = participants[participant_index] 
            users.splice(participant_index, 1)
            return deleted_participant;
        },

        deleteAllParticipants: () => {
            const length = participants.length;
            participants.splice(0, length);
            return {
                count: length
            }
        },


    },

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

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    pubsub,
  },
});

server.start(() => console.log("Server is running on localhost:4000"));