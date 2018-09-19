var asset = require('assert');
var crypto = require('crypto');
var request = require('request-promise');

exports.sourceNodes = ({ boundActionCreators: { createNode } }, { apiKey }) => {
    asset(apiKey, 'New Relic API Key must be provided in gatsby-config');

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
                id: app.name,
                appId: app.id,
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
