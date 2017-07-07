// If you're running on another computer, make sure to put your own server ip address

///////////SERVER CONNECTION////////////////

let SERVER_API_URL = 'http://10.33.178.149:8080/';
// let SERVER_API_URL = 'http://192.168.43.29:8080/';

// AWS Dev server

const restRoutes = {
    addEvent: SERVER_API_URL + 'events',
    getEvent: SERVER_API_URL + 'events/',
    editEvent: SERVER_API_URL + 'events',
    getEvents: SERVER_API_URL + 'events/',
    authenticate: SERVER_API_URL + 'authenticate',
    updatedComment: SERVER_API_URL + 'comments',
    changePassword: SERVER_API_URL + 'changePassword',
    uploadImage: SERVER_API_URL + 'upload',
    deleteEvent: eventId => (SERVER_API_URL + 'events/' + eventId),
    addChildComment: (commentId) => {
        return SERVER_API_URL + 'comments/' + commentId;
    },
    getAllCommentsByEvent: (eventId) => {
        return SERVER_API_URL + 'comments/events/' + eventId + '?filter=all';
    },
    deleteComment: (commentId) => {
        return SERVER_API_URL + 'comments/' + commentId;
    },
};

const settings = {
    api: restRoutes,
};

export default settings;
