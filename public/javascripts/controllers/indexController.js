app.controller('indexController', ['$scope', 'indexFactory','configFactory', ($scope, indexFactory,configFactory) => {

    $scope.messages = [];
    $scope.players = [];

    $scope.init = () => {
        const username = prompt('Lütfen kullanıcı adını giriniz');
        if (username) {
            initSocket(username)
        } else {
            return false;
        }
    };

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    function showPopMessage(id, message) {
        $("#" + id).find('.message').html("");
        $("#" + id).find('.message').show().html(message);
        setTimeout(() => {
            $("#" + id).find('.message').hide();
        }, 3000);
    }

    async function initSocket(username) {
        try {
            const config = await configFactory.getConfig();
            const socket = await indexFactory.connectSocket(config.socketUrl, {
                reconnectionAttempts: 3,
                reconnectionDelay: 600
            });
            socket.emit('newUser', {username});

            socket.on('newUser', (data) => {
                const messageData = {type: {code: 0, message: 1,}, username: data.username,};
                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                $scope.$apply();
                scrollTop();
            });

            socket.on('disUser', (data) => {
                const messageData = {type: {code: 0, message: 0,}, username: data.username,};
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                $scope.$apply();
                scrollTop();
            });

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply();
            });
            socket.on('animate', (data) => {
                $("#" + data.socketId).animate({'left': data.x, 'top': data.y});
                $scope.$apply();
            });

            socket.on('newMessage', (messageData) => {
                $scope.messages.push(messageData);
                $scope.$apply();
                showPopMessage(messageData.socketId, messageData.text);
                scrollTop();
            });

            let animate = false;
            $scope.onClickPlayer = ($event) => {
                let x = $event.offsetX;
                let y = $event.offsetY;
                if (!animate) {
                    socket.emit('animate', {x, y});
                    animate = true;
                    $("#" + socket.id).animate({'left': x, 'top': y}, () => {
                        animate = false;
                    });
                }
            };

            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {type: {code: 1}, text: message, username: username, socketId: socket.id};
                $scope.messages.push(messageData);
                $scope.message = "";
                socket.emit('newMessage', messageData);
                showPopMessage(socket.id, message);
                scrollTop();
            };
        } catch (e) {
            console.log(e);
        }
    }
}]);