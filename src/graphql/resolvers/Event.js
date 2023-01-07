const Event = {
    users: (parent, __, { db }) => db.users.find((user) => user.id === parent.user_id),
    locations: (parent, __,  { db }) => db.locations.find((location) => location.id === parent.location_id),
    participants: (parent, __,  { db }) => db.participants.filter((participant) => participant.event_id === parent.id && participant.user_id === parent.user_id),
}

module.exports = Event;