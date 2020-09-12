const rootURL = `${window.location.origin}`

async function getToMessages(username) {
    try {
        const res = await axios.get(`${rootURL}/users/${username}/to` )    
        return res;
    } catch (error) {
        return error.response;
    }
}

async function getFromMessages(username) {
    try {
        const res = await axios.get(`${rootURL}/users/${username}/from` )
        return res;    
    } catch (error) {
        return error.response;
    }
}

async function handleMessageClick(evt) {
    evt.preventDefault()
}


async function refreshMessages() {
    $("#to_messages_list").empty();
    $("#from_messages_list").empty();
    
    const { uvert } = Cookies.get();
    const payload = JSON.parse(window.atob(uvert.split('.')[1]));

    const toMessages = await getToMessages(payload.username)
    const fromMessages = await getFromMessages(payload.username)

    if (toMessages.data.messages.length) {
        toMessages.data.messages.forEach(message => {
            console.log(message)
            $("#to_messages_list").append(`
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Message From: ${message.from_user.username}</h5>
                </div>
                <p class="mb-1">${message.body}</p>
                <small>${message.sent_at}</small>
            </a>`);
        });
    } else {
        $("#to_messages_list").append(`<li>You Have Received No Messages</li>`);
    }

    if (fromMessages.data.messages.length) {
        fromMessages.data.messages.forEach(message => {
            console.log(message)
            $("#from_messages_list").append(`
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Message To: ${message.to_user.username}</h5>
                </div>
                <p class="mb-1">${message.body}</p>
                <small>${message.sent_at}</small>
            </a>`);
        });
    } else {
        $("#from_messages_list").append(`<li>You Have Sent No Messages</li>`);
    }

    // Promise.all([promise1, promise2])
    //     .then(messages => {
    //         console.log(messages)
    //         messages.forEach(element => {
    //             console.log(element)
    //         });

    //     })
    //     .catch(err => {
    //         $("#alert-container").toggle()
    //         $(".alert").html(`
    //         We encountered an error while retrieving your messages
    //         `)
    //     })

}

$(".message").on("click", handleMessageClick)

refreshMessages()