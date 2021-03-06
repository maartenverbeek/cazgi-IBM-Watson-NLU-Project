const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const url = req.query.url;
    const nlu = getNLUInstance();
    const params = {
        'url': url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false
            },
            'keywords': {
                'emotion': true,
                'sentiment': false
            },
        },
    };

    nlu.analyze(params).then(results => {
        const analysis = results.result.entities[0].emotion;
        return res.send({ emotions: analysis });
    }).catch(err => {
        console.log(err)
    })
});

app.get("/url/sentiment", (req, res) => {
    const url = req.query.url;
    const nlu = getNLUInstance();
    const params = {
        'url': url,
        'features': {
            'entities': {
                'sentiment': true,
                'emotion': false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        }
    }

    nlu.analyze(params).then(results => {
        const response = results.result.entities[0].sentiment.label
        return res.send({ senti: response });
    }).catch(err => {
        console.log(err)
    })
});

app.get("/text/emotion", (req, res) => {
    const text = req.query.text;
    const nlu = getNLUInstance();
    const params = {
        'text': text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false
            }, 'keywords': {
                'emotion': true,
                'sentiment': false

            }
        }
    }

    nlu.analyze(params).then(results => {
        const analysis = results.result.entities[0].emotion
        return res.send({ emotions: analysis });
    }).catch(err => {
        console.log(err)
    })
});

app.get("/text/sentiment", (req, res) => {
    const text = req.query.text;
    const nlu = getNLUInstance();
    const params = {
        'text': text,
        'features': {
            'entities': {
                'sentiment': true,
                'emotion': false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        }
    }

    nlu.analyze(params).then(results => {
        const response = results.result.entities[0].sentiment.label
        return res.send({ senti: response });
    }).catch(err => {
        console.log(err)
    })
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

