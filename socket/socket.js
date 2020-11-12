require('events').EventEmitter.defaultMaxListeners = 25
let configSocketIo = (io) =>{
    let clients = {};
    io.on("connection", async (socket)=>{
        console.log(socket.request._query['userId'] + " vừa kết nối " + socket.id)
        
        let currentUserId = socket.request._query['userId'];
        if(clients[currentUserId]){
            clients[currentUserId].push(socket.id);
        }
        else{
            clients[currentUserId] = [socket.id];
        }
        if(!currentUserId){
            return false
        }
        io.emit('user-connect',currentUserId)

        // if(clients[currentUserId]){
        //     clients[currentUserId].forEach(socketId =>{
        //         io.sockets.connected[socketId].emit('say-hello', {
        //             msg:"Xin chào "
        //         })    
        //     })
        // }

        socket.on("send-request-order",(userData)=>{
            if(clients[userData.storeId]){
                clients[userData.storeId].forEach(socketId =>{
                    io.sockets.connected[socketId].emit('return-request-order',
                        {
                            avatar:userData.avatar,
                            username:userData.username,
                            msg:"Vừa đặt 1 đơn hàng mới"
                        }
                    )    
                })
            }
        })

        socket.on("cancel-request-order",(userData)=>{
            if(clients[userData.userId]){
                clients[userData.userId].forEach(socketId =>{
                    io.sockets.connected[socketId].emit('return-cancel-request-order',
                        {
                            avatar:userData.avatar,
                            orderId:userData.orderId,
                            username:userData.username,
                            type:0,
                            msg:`${username} đã yêu cầu hủy đơn hàng`
                        }
                    )    
                })
            }
        })

        socket.on("da-dong-goi",(userData)=>{
            if(clients[userData.userId]){
                clients[userData.userId].forEach(socketId =>{
                    io.sockets.connected[socketId].emit('tra-ve-da-dong-goi',
                        {
                            avatar:userData.avatar,
                            orderId:userData.orderId,
                            username:userData.username,
                            type:1,
                            msg:`Đơn hàng ${orderId} đã được đóng gói`
                        }
                    )    
                })
            }
        })

        socket.on("dang-van-chuyen",(userData)=>{
            if(clients[userData.userId]){
                clients[userData.userId].forEach(socketId =>{
                    io.sockets.connected[socketId].emit('tra-ve-dang-van-chuyen',
                        {
                            avatar:userData.avatar,
                            orderId:userData.orderId,
                            username:userData.username,
                            type:1,
                            msg:`Đơn hàng ${orderId} đang vận chuyển bởi ${username}`
                        }
                    )    
                })
            }
        })


        socket.on("disconnect",()=>{
            io.emit('user-disconnect',currentUserId)
            clients[currentUserId] = clients[currentUserId].filter((socketId)=>{
                return socketId != socket.id;
            });
            if(!clients[currentUserId].length){
                delete clients[currentUserId];
            }            
        })
        // console.log(clients)
    });
    
}
module.exports = configSocketIo