var socket;

    $(document).ready(function(){

        socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');
        socket.on('connect', function() {
            socket.emit('joined', {});
        });
        
        socket.on('status', function(data) {     
            let tag  = document.createElement("p");
            let text = document.createTextNode(data.msg);
            let element = document.getElementById("chat");
            tag.appendChild(text);
            tag.style.cssText = data.style;
            element.appendChild(tag);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
        });  

    });   

    // sends message when enter is pressed in message box
    function search(ele){
        if(event.key === 'Enter'){
            msg_box = document.getElementById('msg_box');
            socket.emit('msg_sent', msg_box.value);
            msg_box.value = '';
        }
    }

    // leaves the chatroom and redirects to home
    function leaveChat(){
        socket.emit('leave',{});
        window.location.replace("home");
    }