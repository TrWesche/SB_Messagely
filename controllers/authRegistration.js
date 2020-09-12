const rootURL = `${window.location.origin}`

async function registerUser(username, password, first_name, last_name, phone) {
    try {
        const res = await axios.post(`${rootURL}/auth/register`, { username, password, first_name, last_name, phone });    
        return res;
    } catch (error) {
        return error.response;
    }
}

async function loginUser(username, password) {
    try {
        console.log("Login started")
        const res = await axios.post(`${rootURL}/auth/login`, { username, password} )
        return res;    
    } catch (error) {
        console.log("Error Encountered", error)
        return error.response;
    }
    
}

async function handleNewUserRegister(evt) {
    evt.preventDefault();

    const res = await registerUser(
        evt.target.form[0].value,
        evt.target.form[1].value,
        evt.target.form[2].value,
        evt.target.form[3].value,
        evt.target.form[4].value)

    if (res.data.error) {
        $("#alert-container").toggle()
        $(".alert").html(`
        ${res.data.error.message}
        `)
    } else {
        window.location.replace(`${rootURL}`);
    }
}

async function handleUserLogin(evt) {
    evt.preventDefault();

    // Login Clicked
    const res = await loginUser(
        evt.target.form[0].value,
        evt.target.form[1].value)

    if (res.data.error) {
        $("#alert-container").toggle()
        $(".alert").html(`
        ${res.data.error.message}
        `)
    } else {
        window.location.replace(`${rootURL}`);
    } 
}

$("#register_user").on("click", handleNewUserRegister)
$("#login_user").on("click", handleUserLogin)