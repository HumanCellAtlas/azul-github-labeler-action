import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        const token = core.getInput('repo-token', {required: true});
        const label = core.getInput('label', {required: true});

        const issueNumber = getIssueNumber();
        if (!issueNumber) {
            console.log('Could not get issue number from context, exiting');
            return;
        }

        const client = new github.GitHub(token);

        await addLabels(client, issueNumber, label);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

function getIssueNumber(): number | undefined {
    const issue = github.context.payload.issue;
    if (!issue) {
        return undefined;
    } else {
        return issue.number;
    }
}

async function addLabels(
    client: github.GitHub,
    issueNumber: number,
    label: string
) {
    await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issueNumber,
        labels: [label]
    });
}

run();
