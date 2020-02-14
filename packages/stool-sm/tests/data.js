export const States = {
    CLOSED: 'CLOSED',
    OPENED: 'OPENED',
    LOCKED: 'LOCKED'
};

export const Actions = {
    CLOSE: 'CLOSE',
    OPEN: 'OPEN',
    LOCK: 'LOCK',
    UNLOCK: 'UNLOCK'
};

export const CONFIG = {
    init: States.OPENED,
    states: [{
        name: States.CLOSED,
        transitions: [
            { action: Actions.OPEN, target: States.OPENED },
            { action: Actions.LOCK, target: States.LOCKED }
        ]
    },
    {
        name: States.OPENED,
        transitions: [
            { action: Actions.CLOSE, target: States.CLOSED }
        ]
    },
    {
        name: States.LOCKED,
        transitions: [
            { action: Actions.UNLOCK, target: States.CLOSED }
        ]
    }]
};
// const ConnectionState = {
//     CLOSED: 'CLOSED',
//     ETABLISHING: 'ETABLISHING',
//     ESTABLISHED: 'ETABLISHED',
//     CLOSING: 'CLOSING',
//     ERROR: 'ERROR',
//     AUTHENTICATING: 'AUTHENTICATING',
//     CHALLENGING: 'CHALLENGING',
// };

// const MessageType = {
//     HELLO: 1,
// };

// const Direction = {
//     RECEIVED: 'RECEIVED',
//     SENT: 'SENT',
// };
