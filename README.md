# Bug Tracker
Modern website for recording issues/bugs
## Running Locally
#### Installation and required Dependencies
Node.js and the NPM Package manager are required before installation.

Download or clone the git repository at https://github.com/Alex-Sindledecker/Bug-Tracker. For the current development version, clone the dev branch.

`git clone https://github.com/Alex-Sindledecker/Bug-Tracker`
#### Setup
Run `npm install` or `npm i` to install all the required dependencies.

Create a new file called `.env` at the root of the project that follows this format: 

    MONGO_URL=[url to a mongo database]
    SESSION_KEY=[secret key]
    TEST_DB_URL=[url to a testing database]

**Note**: The test database is completely wiped after running all tests so be sure to not store any important information in the test database. 
#### Running and Testing
Before running, it is reconmended to run all the tests to ensure that everything is setup correctly. 
To run the tests, run `npm test` in the terminal at the project root. To run a specific test file, located in the `unit_tests/` folder, run `npm test -- [test_file]`

After all the tests succesfully pass, you can run the website with `node index.js`
## API Documentaion

## Contribution
This project is not yet open for contribution.