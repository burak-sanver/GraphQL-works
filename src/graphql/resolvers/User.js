const User = {
    events: (parent, __, { db }) => db.events.filter((event) => event.user_id === parent.id),
}

module.exports = User;