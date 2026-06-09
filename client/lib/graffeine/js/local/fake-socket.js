
Fake.socket = (function(db) { 

    return { 

        emit: function(command, data) { 
            console.log("fake.socket.emit: %s %s", command, data);
        },

        on: function(command, callback) { 
            console.log("fake.socket.on: %s", command);
        }

    };

}(Fake.db));