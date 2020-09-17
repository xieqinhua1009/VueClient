//用户
function User(userId, userName) {
    this.userId = userId;
    this.userName = userName;
}

function ChatRoom(roomId, currentUser) {
    this.roomId = roomId;
    this.currentUser = currentUser;
}

function ChatRoomService(roomId, user, goEasy) {
    this.room = new ChatRoom(roomId, user);

    this.goEasyAppKey = goEasy.goEasyAppKey;
    this.goEasyUrl = goEasy.goEasyUrl;
    this.encryptKey = goEasy.encryptKey;
    this.chatChannel = goEasy.chatChannel;
}

ChatRoomService.prototype.whenNewMessage = function (message) {
};

//链接聊天服务器
ChatRoomService.prototype.connectGoEasyIM = function () {
    var goEasy = new GoEasy({
        appkey: this.goEasyAppKey,
        onConnected: function () {
            console.log("Connect to GoEasy success.");
        },
        onDisconnected: function () {
            console.log("Disconnect to GoEasy server.");
        },
        onConnectFailed: function (error) {
            console.log("Connect to GoEasy failed, error code: " + error.code + " Error message: " + error.content);
        }
    });

    let that = this;
    goEasy.subscribe({
        channel: this.chatChannel,
        onMessage: function (message) {
            var msgList = JSON.parse(message.content);
            msgList.forEach(function (msg) {
                let content = msg.message;
                let decrypt = Decrypt(content, that.encryptKey);
                msg.message = decrypt.toString();
                console.log(msg);
                that.whenNewMessage(msg);
            })


        },
        onSuccess: function () {
            console.log("Channel订阅成功。");
        },
        onFailed: function (error) {
            console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
        }
    });
}


ChatRoomService.prototype.initialWhenNewMessage = function (whenNewMessage) {
    this.whenNewMessage = whenNewMessage;
};