const simpleGit = require('simple-git');
const axios = require('axios');
const fs = require('fs');

// Global variables for Bitbucket credentials
const BITBUCKET_USERNAME = 'your_bitbucket_username';
const BITBUCKET_PASSWORD = 'your_bitbucket_password';

async function cloneAndPushRepositories(repositories) {
  for (const repo of repositories) {
    const { codecommit_repo_url, bitbucket_repo_url } = repo;

    // Clone from AWS CodeCommit
    console.log(`Cloning from CodeCommit repository: ${codecommit_repo_url}`);
    await simpleGit().clone(codecommit_repo_url);

    const repoName = codecommit_repo_url.split('/').pop().replace('.git', '');

    try {
      // Add Bitbucket remote
      console.log(`Adding Bitbucket remote: ${bitbucket_repo_url}`);
      await simpleGit(repoName).addRemote('bitbucket', bitbucket_repo_url);

      // Push to Bitbucket
      console.log(`Pushing to Bitbucket repository: ${bitbucket_repo_url}`);
      await simpleGit(repoName).push('bitbucket', '--all', '--mirror');
      console.log(`Repository "${repoName}" cloned and pushed successfully.`);

      // Remove local clone
      console.log(`Removing local clone: ${repoName}`);
      fs.rmdirSync(repoName, { recursive: true });
    } catch (error) {
      console.error(`An error occurred while cloning and pushing "${repoName}": ${error.message}`);
    }
  }
}

const repositories = [
  {
    codecommit_repo_url: 'https://git-codecommit.us-west-2.amazonaws.com/v1/repos/repo1',
    bitbucket_repo_url: 'https://bitbucket.your-company.com/scm/repo1.git',
  },
  {
    codecommit_repo_url: 'https://git-codecommit.us-west-2.amazonaws.com/v1/repos/repo2',
    bitbucket_repo_url: 'https://bitbucket.your-company.com/scm/repo2.git',
  },
  // Add more repositories as needed
];

cloneAndPushRepositories(repositories);
