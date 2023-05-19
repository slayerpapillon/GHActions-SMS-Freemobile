import * as core from '@actions/core'
import * as github from '@actions/github'
import {IssuesEvent, PushEvent} from '@octokit/webhooks-definitions/schema'
import {StatusCodes} from 'http-status-codes';

import fetch from 'node-fetch'

async function run(): Promise<void> {
  try {
    const freemobile_user = core.getInput('freemobile_user', {required: true})
    const freemobile_password = core.getInput('freemobile_password', {required: true})
    
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
        const issuePayload = github.context.payload as IssuesEvent
        const issuesMessage = `GitHub Issues action ${issuePayload.action}.
        \nOn repo --> ${issuePayload.repository.full_name}
        \nBy --> ${issuePayload.sender.login}
        \nIssue #${issuePayload.issue.number} ${issuePayload.issue.title}`
        //* Send the Message.
        const statusIssues = await sendSMS(issuesMessage, freemobile_user, freemobile_password)
        sendSMSReturnStatus(statusIssues, StatusCodes.OK)
        break
      }
      // case 'pull_request':
        // break
      // case 'pull_request_review':
        // break
      // case 'pull_request_review_comment':
        // break
      case 'push': {
        const pushPayload = github.context.payload as PushEvent
        const pushMessage = `GitHub Push event.\nOn repo --> ${pushPayload.repository.full_name}\nBy --> ${pushPayload.sender.login}\nOn ref --> ${pushPayload.ref}`
        //* Send the Message.
        const statusPush = await sendSMS(pushMessage, freemobile_user, freemobile_password)
        sendSMSReturnStatus(statusPush, StatusCodes.OK)
        break
      }
      default:
        core.notice(`Not a track event. Event is -> ${github.context.eventName}`)
        break
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function sendSMS(message: string, user: string, pass: string): Promise<number> {
  const response = await fetch('https://smsapi.free-mobile.fr/sendmsg', {
    method: 'POST',
    body: JSON.stringify({
      user: user,
      pass: pass,
      msg: message
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const status = response.status
  return status
}

function sendSMSReturnStatus(status: number, expectedStatus: StatusCodes) {
  status === expectedStatus ? core.notice(`Send OK for event ${github.context.eventName}`) : core.setFailed('Send error!')
}

run()
