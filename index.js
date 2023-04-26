const core = require('@actions/core');

const main = async () => {
	try {
		const event_name = core.getInput('event_name', { required: true });
		const event = core.getInput('event', { required: true });
		const freemobile_user = core.getInput('freemobile_user', { required: true });
		const freemobile_password = core.getInput('freemobile_password', { required: true });

        switch (event_name) {
            case 'discussion':
            break;
            case 'discussion_comment':
            break;
            case 'issue_comment':
            break;
            case 'issues':
            break;
            case 'pull_request':
            break;
            case 'pull_request_review':
            break;
            case 'pull_request_review_comment':
            break;
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

// Call the main function to run the action
main();