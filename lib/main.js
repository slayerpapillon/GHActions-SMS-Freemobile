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
const http_status_codes_1 = require("http-status-codes");
const node_fetch_1 = __importDefault(require("node-fetch"));
async function run() {
    try {
        const freemobile_user = core.getInput('freemobile_user', { required: true });
        const freemobile_password = core.getInput('freemobile_password', { required: true });
        switch (github.context.eventName) {
            // case 'discussion':
            // const discussionPayload = github.context.payload as Discussion
            // break
            // case 'discussion_comment':
            // const discussionCommentEventPayload = github.context.payload as DiscussionCommentEvent
            // break
            // case 'issue_comment':
            // const issueCommentEventPayload = github.context.payload as IssueCommentEvent
            // break
            case 'issues': {
                const issuePayload = github.context.payload;
                const issuesMessage = `GitHub Issues action ${issuePayload.action}.
        \nOn repo --> ${issuePayload.repository.full_name}
        \nBy --> ${issuePayload.sender.login}
        \nIssue #${issuePayload.issue.number} ${issuePayload.issue.title}`;
                //* Send the Message.
                const statusIssues = await sendSMS(issuesMessage, freemobile_user, freemobile_password);
                sendSMSReturnStatus(statusIssues, http_status_codes_1.StatusCodes.OK);
                break;
            }
            // case 'pull_request':
            // break
            // case 'pull_request_review':
            // break
            // case 'pull_request_review_comment':
            // break
            case 'push': {
                const pushPayload = github.context.payload;
                const pushMessage = `GitHub Push event.\nOn repo --> ${pushPayload.repository.full_name}\nBy --> ${pushPayload.sender.login}\nOn ref --> ${pushPayload.ref}`;
                //* Send the Message.
                const statusPush = await sendSMS(pushMessage, freemobile_user, freemobile_password);
                sendSMSReturnStatus(statusPush, http_status_codes_1.StatusCodes.OK);
                break;
            }
            default:
                core.notice(`Not a track event. Event is -> ${github.context.eventName}`);
                break;
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
async function sendSMS(message, user, pass) {
    const response = await (0, node_fetch_1.default)('https://smsapi.free-mobile.fr/sendmsg', {
        method: 'POST',
        body: JSON.stringify({
            user: user,
            pass: pass,
            msg: message
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    const status = response.status;
    return status;
}
function sendSMSReturnStatus(status, expectedStatus) {
    status === expectedStatus ? core.notice(`Send OK for event ${github.context.eventName}`) : core.setFailed('Send error!');
}
run();
