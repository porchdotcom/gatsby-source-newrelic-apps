var assert = require('assert');
var crypto = require('crypto');
var request = require('request-promise');

exports.sourceNodes = ({ boundActionCreators: { createNode }, createNodeId }, { apiKey }) => {
    assert(apiKey, 'New Relic API Key must be provided in gatsby-config');

    return request.get({
        url: 'https://api.newrelic.com/v2/applications.json',
        headers: {
            'X-Api-Key': apiKey
        },
        json: true,
        fullResponse: false
    }).then(({ applications }) => {
        applications.forEach(app => {
            createNode({
                id: createNodeId(`newrelic-app-${app.id}`),
                app,
                internal: {
                    type: 'NewRelicApp',
                    contentDigest: crypto
                        .createHash('md5')
                        .update(`${app.name}${app.id}`)
                        .digest('hex')
                }
            });
        });
    });
};
