const core = require('@actions/core');

let freemobile_user = "";
let freemobile_password = "";

const main = async () => {
	try {
		const event_name = core.getInput('event_name', { required: true });
		const event = core.getInput('webhook_event', { required: true });
		freemobile_user = core.getInput('freemobile_user', { required: true });
		freemobile_password = core.getInput('freemobile_password', { required: true });

        switch (event_name) {
            case 'discussion':
            break;
            case 'discussion_comment':
            break;
            case 'issue_comment':
            break;
            case 'issues':
                const statusIssues = await onIssues(event);
                statusIssues == 200 ? core.notice('Send OK') : core.setFailed('Send error!');
                return;
            case 'pull_request':
            break;
            case 'pull_request_review':
            break;
            case 'pull_request_review_comment':
            break;
            case 'push':
                const statusPush = await onPush(event);
                statusPush == 200 ? core.notice('Send OK') : core.setFailed('Send error!');
                return;
            default:
                core.notice('Not a track event.');
            return;
        }
        core.notice('Fin!');
    }
	catch (error) {
		core.setFailed(error.message);
  }
}

async function onIssues(event) {
    const action = event.action; // Ex: opened
    const repo = event.repository.full_name; // Ex: octocat/Hello-World
    const sender = event.sender.login; // Ex: octocat
    const number = event.issue.number; // Ex: 1
    const title = event.issue.title; // Ex: My pull title

    const message = 'GitHub Issues event ' + action + '.\nOn repo ' + repo + ' by ' + sender + '\nIssue #' + number + ' ' + title;
    return await sendSMS(message);
}

async function onPush(event) {
    const repo = event.repository.full_name; // Ex: octocat/Hello-World
    const sender = event.sender.login; // Ex: octocat
    const refEvent = event.ref; // Ex: refs/heads/main

    const message = 'GitHub Push event.\nOn repo ' + repo + ' by ' + sender + '\nOn ref ' + refEvent;
    return await sendSMS(message);
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