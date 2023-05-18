import * as core from '@actions/core'
import * as github from '@actions/github'
import {PushEvent} from '@octokit/webhooks-definitions/schema'

import fetch from 'node-fetch'

let freemobile_user = ''
let freemobile_password = ''

async function run(): Promise<void> {
  try {
    const event_name: string = core.getInput('event_name', {required: true})
    const repository: string = core.getInput('repository', {required: true}) // Ex: octocat/Hello-World (from github.event.repository.full_name)
    const sender: string = core.getInput('sender', {required: true}) // Ex: octocat (from github.event.sender.login)
    freemobile_user = core.getInput('freemobile_user', {required: true})
    freemobile_password = core.getInput('freemobile_password', {required: true})

    if (github.context.eventName === 'push') {
      const pushPayload = github.context.payload as PushEvent
      core.info(`The head commit is: ${pushPayload.head_commit}`)
    }
    else{
      core.info(`Not a push Event, Event is ${github.context.eventName}`)
    }

    switch (event_name) {
      case 'discussion':
        break
      case 'discussion_comment':
        break
      case 'issue_comment':
        break
      case 'issues': {
        const action: string = core.getInput('action', {required: true}) // Ex: opened (from github.event.action)
        const number: string = core.getInput('number', {required: true}) // Ex: 1 (from github.event.issue.number)
        const title: string = core.getInput('title', {required: true}) // Ex: My pull title (from github.event.issue.title)
        const issuesMessage = `GitHub Issues event ${action}.\nOn repo --> ${repository}\nBy --> ${sender}\nIssue #${number} ${title}`
        const statusIssues = await sendSMS(issuesMessage)
        statusIssues === 200
          ? core.notice('Send OK')
          : core.setFailed('Send error!')
        break
      }
      case 'pull_request':
        break
      case 'pull_request_review':
        break
      case 'pull_request_review_comment':
        break
      case 'push': {
        const pushRef = core.getInput('pushRef', {required: true}) // Ex: refs/heads/main (from github.event.ref)
        const pushMessage = `GitHub Push event.\nOn repo --> ${repository}\nBy --> ${sender}\nOn ref --> ${pushRef}`
        const statusPush = await sendSMS(pushMessage)
        statusPush === 200
          ? core.notice(`Send OK for event ${github.context.eventName}`)
          : core.setFailed('Send error!')
        break
      }
      default:
        core.notice('Not a track event.')
        break
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function sendSMS(message: string): Promise<number> {
  const response = await fetch('https://smsapi.free-mobile.fr/sendmsg', {
    method: 'POST',
    body: JSON.stringify({
      user: freemobile_user,
      pass: freemobile_password,
      msg: message
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const status = response.status
  return status
}

run()
