const socket = io();

let user;
let chatBox = document.getElementById('chatBox');




Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "escribe tu nombre no te hagas el vivo te observo"
    },
    icon: "success",
    allowOutsideClick: false
}).then(result => {
    user = result.value;

    socket.emit('authenticate');

    socket.on('messageLogs', data => {
        let log = document.getElementById("messageLogs");
        let messages = "";
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message}</br>`
        });
        log.innerHTML = messages
    })

});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message}</br>`
    });
    log.innerHTML = messages;
});

socket.on('userConnected', data => {
    Swal.fire({
        text: `${data.user} se ha conectado`,
        toast: true,
        position: 'top-right'
    })
});
