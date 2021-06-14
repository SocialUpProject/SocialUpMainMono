const remotes = {
  people: {
    dev: 'people@http://localhost:8081/remoteEntry.js',
    prod: 'people@https://social-up-people.herokuapp.com/remoteEntry.js',
  },
  auth: {
    dev: 'auth@http://localhost:8082/remoteEntry.js',
    prod: 'auth@https://social-up-auth.herokuapp.com/remoteEntry.js',
  },
  common: {
    dev: 'common@http://localhost:8083/remoteEntry.js',
    prod: 'common@https://social-up-common.herokuapp.com/remoteEntry.js',
  },
};

const devRemotes = {
  people: remotes.people.dev,
  auth: remotes.auth.dev,
  common: remotes.common.dev,
};

const prodRemotes = {
  people: remotes.people.prod,
  auth: remotes.auth.prod,
  common: remotes.common.prod,
};

module.exports = process.env.MODE === 'prod_local' || process.env.NODE_ENV === 'development'
  ? devRemotes
  : prodRemotes;
