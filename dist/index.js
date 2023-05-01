/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 25:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(25);

let freemobile_user = "";
let freemobile_password = "";

const main = async () => {
	try {
		const event_name = core.getInput('event_name', { required: true });
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
                const statusIssues = await onIssues();
                statusIssues == 200 ? core.notice('Send OK') : core.setFailed('Send error!');
                return;
            case 'pull_request':
            break;
            case 'pull_request_review':
            break;
            case 'pull_request_review_comment':
            break;
            case 'push':
                const statusPush = await onPush();
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

async function onIssues() {
    const action = core.getInput('action', { required: true }); // Ex: opened (from github.event.action)
    const repository = core.getInput('repository', { required: true }); // Ex: octocat/Hello-World (from github.event.repository.full_name)
    const sender = core.getInput('sender', { required: true }); // Ex: octocat (from github.event.sender.login)
    const number = core.getInput('number', { required: true }); // Ex: 1 (from github.event.issue.number)
    const title = core.getInput('title', { required: true }); // Ex: My pull title (from github.event.issue.title)

    const message = 'GitHub Issues event ' + action + '.\nOn repo ' + repository + ' by ' + sender + '\nIssue #' + number + ' ' + title;
    return await sendSMS(message);
}

async function onPush() {
    const repository = core.getInput('repository', { required: true }); // Ex: octocat/Hello-World (from github.event.repository.full_name)
    const sender = core.getInput('sender', { required: true }); // Ex: octocat (from github.event.sender.login)
    const pushRef = core.getInput('pushRef', { required: true }); // Ex: refs/heads/main (from github.event.ref)

    const message = 'GitHub Push event.\nOn repo ' + repository + ' by ' + sender + '\nOn ref ' + pushRef;
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
})();

module.exports = __webpack_exports__;
/******/ })()
;