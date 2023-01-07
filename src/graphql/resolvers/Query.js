const Query = {

users: (_, __, { db }) => db.users,
user: (_, args, { db }) => db.users.find((user) => user.id === args.id),

//events
events: (_, __, { db }) => db.events,
event: (_, args, { db }) => db.events.find((event) => event.id === args.id),

//locations
locations: (_, __, { db }) => db.locations,
location: (_, args, { db }) => db.locations.find((location) => location.id === args.id),

//participants
participants: (_, __, { db }) => db.participants,
participant: (_, args, { db }) => db.participants.find((participant) => participant.id === args.id),
}

module.exports = Query