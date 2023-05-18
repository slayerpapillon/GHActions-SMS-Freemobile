"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const node_fetch_1 = __importDefault(require("node-fetch"));
let freemobile_user = '';
let freemobile_password = '';
async function run() {
    try {
        const event_name = core.getInput('event_name', { required: true });
        const repository = core.getInput('repository', { required: true }); // Ex: octocat/Hello-World (from github.event.repository.full_name)
        const sender = core.getInput('sender', { required: true }); // Ex: octocat (from github.event.sender.login)
        freemobile_user = core.getInput('freemobile_user', { required: true });
        freemobile_password = core.getInput('freemobile_password', { required: true });
        if (github.context.eventName === 'push') {
            const pushPayload = github.context.payload;
            core.info(`The head commit is: ${pushPayload.head_commit}`);
        }
        else {
            core.info(`Not a push Event, Event is ${github.context.eventName}`);
        }
        switch (event_name) {
            case 'discussion':
                break;
            case 'discussion_comment':
                break;
            case 'issue_comment':
                break;
            case 'issues': {
                const action = core.getInput('action', { required: true }); // Ex: opened (from github.event.action)
                const number = core.getInput('number', { required: true }); // Ex: 1 (from github.event.issue.number)
                const title = core.getInput('title', { required: true }); // Ex: My pull title (from github.event.issue.title)
                const issuesMessage = `GitHub Issues event ${action}.\nOn repo --> ${repository}\nBy --> ${sender}\nIssue #${number} ${title}`;
                const statusIssues = await sendSMS(issuesMessage);
                statusIssues === 200
                    ? core.notice('Send OK')
                    : core.setFailed('Send error!');
                break;
            }
            case 'pull_request':
                break;
            case 'pull_request_review':
                break;
            case 'pull_request_review_comment':
                break;
            case 'push': {
                const pushRef = core.getInput('pushRef', { required: true }); // Ex: refs/heads/main (from github.event.ref)
                const pushMessage = `GitHub Push event.\nOn repo --> ${repository}\nBy --> ${sender}\nOn ref --> ${pushRef}`;
                const statusPush = await sendSMS(pushMessage);
                statusPush === 200
                    ? core.notice('Send OK for event ${github.context.eventName}')
                    : core.setFailed('Send error!');
                break;
            }
            default:
                core.notice('Not a track event.');
                break;
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
async function sendSMS(message) {
    const response = await (0, node_fetch_1.default)('https://smsapi.free-mobile.fr/sendmsg', {
        method: 'POST',
        body: JSON.stringify({
            user: freemobile_user,
            pass: freemobile_password,
            msg: message
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    const status = response.status;
    return status;
}
run();
