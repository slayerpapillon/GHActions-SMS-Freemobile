const core = require('@actions/core');

let freemobile_user = "";
let freemobile_password = "";

const main = async () => {
	try {
        const repository = core.getInput('repository', { required: true }); // Ex: octocat/Hello-World (from github.event.repository.full_name)
        const sender = core.getInput('sender', { required: true }); // Ex: octocat (from github.event.sender.login)
        const pushRef = core.getInput('pushRef', { required: true }); // Ex: refs/heads/main (from github.event.ref)
		freemobile_user = core.getInput('freemobile_user', { required: true });
		freemobile_password = core.getInput('freemobile_password', { required: true });

        const message = 'GitHub Push event.\nOn repo ' + repository + ' by ' + sender + '\nOn ref ' + pushRef;
        const statusPush = await sendSMS(message);
        
        statusPush == 200 ? core.notice('Send OK') : core.setFailed('Send error!');
    }
	catch (error) {
		core.setFailed(error.message);
  }
}

async function sendSMS(message) {
    const response = await fetch("https://smsapi.free-mobile.fr/sendmsg", {
        method: "POST",
        body: JSON.stringify({
            user: freemobile_user,
            pass: freemobile_password,
            msg: message
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    const status = response.status;
    return status;
}

// Call the main function to run the action
main();