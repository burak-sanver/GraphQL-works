const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

const Mutation = {
    // User

    createUser: (_, { data }, { pubsub, db }) =>{
        const user = {
            id: uid(),
            ...data,
        }

        db.users.push(user);
        pubsub.publish("userCreated", { userCreated: user })
        return user;
    },

    updateUser: (_, { id, data }, { pubsub, db }) => {
        const user_index = db.users.findIndex((user) => user.id = id);
        if (user_index === -1) {
            throw new Error('User not found!');
        }

        const updated_user = (db.users[user_index] = {
            ...db.users[user_index],
            ...data,
          });

          return updated_user;
    },

    deleteUser: (_, { id }, { pubsub, db }) => {
        const user_index = db.users.findIndex((user) => user.id == id);

        if (user_index === -1) {
            throw new Error('User not found!');
        }

        const deleted_user = db.users[user_index] 
        db.users.splice(user_index, 1)
        return deleted_user;
    },

    deleteAllUsers: (_, __, { pubsub, db }) => {
        const length = db.users.length;
        db.users.splice(0, length);

        return {
            count: length
        }
    },

    // Event

    createEvent: (_, { data }, { pubsub, db }) => {
        const event = {
            id: uid(),
            ...data
        }

        db.events.push(event)
        pubsub.publish("eventCreated", { eventCreated: event })
        return event;
    },

    updateEvent: (_, { id, data }, { pubsub, db }) => {
        const event_index = db.events.findIndex((event) => event.id = id);

        if (event_index === -1) {
            throw new Error('Event not found!')
        }

        const updated_event = db.events[event_index] = {
            ...db.events[event_index],
            ...data
        }

        return updated_event;

    },

    deleteEvent: (_, { id }, { pubsub, db }) => {
        const event_index = db.events.findIndex((event) => event.id == id);

        if (event_index === -1) {
            throw new Error('event not found!');
        }

        const deleted_event = db.events[event_index] 
        db.events.splice(event_index, 1)
        return deleted_event;
    },

    deleteAllEvents: (_, __, { pubsub, db }) => {
        const length = db.events.length;
        db.events.splice(0, length);
        return {
            count: length
        }
    },

    //location
    createLocation: (_, { data }, { pubsub, db }) => {
        const location = {
            id: uid(),
            ...data,
        }

        db.locations.push(location);
        return location;
    },

    updateLocation: (_, { id, data }, { pubsub, db }) => {
        const location_index = db.locations.findIndex((location) => location.id = id);

        if (location_index === -1) {
            throw new Error('location not found!')
        }

        const updated_location = db.locations[location_index] = {
            ...db.locations[location_index],
            ...data
        }

        return updated_location;

    },

    deleteLocation: (_, { id }, { pubsub, db }) => {
        const location_index = db.locations.findIndex((location) => location.id == id);

        if (location_index === -1) {
            throw new Error('location not found!');
        }

        const deleted_location = db.locations[location_index] 
        db.locations.splice(location_index, 1)
        return deleted_location;
    },

    deleteAllLocations: (_, __, { pubsub, db }) => {
        const length = db.locations.length;
        db.locations.splice(0, length);
        return {
            count: length
        }
    },


    // participant
    createParticipant: (_, { data }, { pubsub, db }) => {
        const participant = {
            id: uid(),
            ...data,
        }

        db.participants.push(participant);
        pubsub.publish("participantCreated", { participantCreated: participant })
        return participant;
    },

    updateParticipant: (_, { id, data }, { pubsub, db }) => {
        const participant_index = db.participants.findIndex((participant) => participant.id = id);

        if (participant_index === -1) {
            throw new Error('Participant not found!')
        }

        const updated_participant = db.participants[participant_index] = {
            ...db.participants[participant_index],
            ...data
        }

        return updated_participant;

    },

    deleteParticipant: (_, { id }, { pubsub, db }) => {
        const participant_index = db.participants.findIndex((participant) => participant.id == id);

        if (participant_index === -1) {
            throw new Error('participant not found!');
        }

        const deleted_participant = db.participants[participant_index] 
        db.participants.splice(participant_index, 1)
        return deleted_participant;
    },

    deleteAllParticipants: (_, __, { pubsub, db }) => {
        const length = db.participants.length;
        db.participants.splice(0, length);
        return {
            count: length
        }
    },

}

module.exports = Mutation