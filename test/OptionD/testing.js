/* Testing if I can make a quick set of dummy tests to explore the possibility o fadding test profiles.  This is copied and pasted from the non_templating file. */

(function (module, fs, extend, moment, request, requestPromise, chai, liburl, Joi, helper, multipartParser, redirect) {
    // "use strict";

    var expect = chai.expect;

    if(global.OAUTH)
        request = helper.OAuthRequest(request);

describe('New requirements for specification version 1.0.3', function() {


    describe('Stored Statements property is a “Timestamp (Formatted according to ISO 8601) of when this Statement was recorded. Set by LRS.” (Data#2.4.8 Statement Properties)', function () {
        it('Message goes here', function (done) {

            function testTime (ctr) {
                console.log('Attempt #', ctr);
                var templates = [
                    {statement: '{{statements.default}}'}
                ];
                var data = createFromTemplate(templates).statement;
                data.id = helper.generateUUID();
                var query = '?statementId=' + data.id;
                var stmtTime = Date.now();

                request(helper.getEndpointAndAuth())
                .post(helper.getEndpointStatements())
                .headers(helper.addAllHeaders())
                .json(data)
                .expect(200)
                .end()
                .get(helper.getEndpointStatements() + query)
                // .wait(genDelay(stmtTime, query, data.id));
                .headers(helper.addAllHeaders())
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        stmt = parse(res.body);
                        expect(stmt).to.have.property('stored');
                        var stored = moment(stmt.stored, moment.ISO_8601, true);
                        expect(stored.isValid()).to.be.true;
                        //The following will send and recieve multiple times if necessary to determine that an LRS preserves a timestamp to at least milliseconds
                        if (stored._pf.parsedDateParts[6] === 0) {
                            if (ctr < 5) {
                                testTime(++ctr);
                            } else {
                                throw new Error("LRS did not preseve milliseconds");
                                done(err);
                            }
                        } else {
                            done();
                        }
                    }
                });
            } testTime(1);
        });
    });


    describe('Statements returned by an LRS MUST retain the version they are accepted with. (Data#2.4.10)', function () {
        var versions = ['1.0', '1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.9'];
        var notVersions = ['0.1', '0.9', '0.95', '1.1', '1.1.1', '2.0']
        var templates = [
            {statement: '{{statements.default}}'}
        ];
        var statement = createFromTemplate(templates).statement;
        var stmtTime;

        versions.forEach(function(version) {
            it('Version ' + version, function(done) {
                // this.timeout(0);
                statement.version = version;

                request(helper.getEndpointAndAuth())
                .post(helper.getEndpointStatements())
                .headers(helper.addAllHeaders({}))
                .json(statement)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        id = res.body[0];
                        stmtTime = res.headers.date;
                        request(helper.getEndpointAndAuth())
                        .get(helper.getEndpointStatements() + '?statementId=' + id)
                        // .wait(genDelay(stmtTime, '?statementId=' + id, id))
                        .headers(helper.addAllHeaders({}))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            } else {
                                result = parse(res.body);
                                console.log('this is the id and the version:\n', result.id, 'vs', id, '\nVersion', result.version, 'vs', version);
                                expect(result.version).to.be.eql(version);
                                done();
                            }
                        }); //get end
                    }   //if else
                }); //post end
            }); //it
        }); //version forEach

        notVersions.forEach(function(version) {
            it('Not Version ' + version, function(done) {
                statement.version = version;

                request(helper.getEndpointAndAuth())
                .post(helper.getEndpointStatements())
                .headers(helper.addAllHeaders({}))
                .json(statement)
                .expect(400, done);
            }); //it
        }); //notVersions forEach
    }); //Versions describe


    describe('If it (LRS) accepts the attachment, it can match the raw data of an attachment with the attachment header in a Statement by comparing the SHA-2 of the raw data to the SHA-2 declared in the header. It (LRS) MUST not do so any other way. (Data#2.4.11)', function () {
        // done();
    });


    describe('When handling Statement Signature, LRS MUST do the following (Data#2.6)', function () {

        it('Reject requests to store Statements that contain malformed signatures, with HTTP 400.', function (done) {
            done();
        });

        it('Decode the JWS signature, and load the signed serialization of the Statement from the JWS signature payload.', function (done) {
            done();
        });

        it('Validate that the "original" Statement is logically equivalent to the received Statement.', function (done) {
            // When making this equivalence check, differences which could have been caused by allowed or required LRS processing of "id", "authority", "stored", "timestamp", or "version" MUST be ignored.
            done();
        });

        it('If the JWS header includes an X.509 certificate, validate the signature against that certificate as defined in JWS.', function (done) {
            done();
        });
    });


    describe('An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling APIs where PUT may overwrite existing data (State, Agent Profile, and Activity Profile). (Communication#3.1)', function () {


        it('When responding to a GET request, include an ETag HTTP header in the response', function (done) {
            done();
        });

        it('When returning an ETag header, the value should be calculated as a SHA1 hexadecimal value', function (done) {
            done();
        });

        it('When responding to a GET Request the Etag header must be enclosed in quotes', function (done) {
            done();
        });

        it('When responding to a PUT request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag', function (done) {
            done();
        });

        it('When responding to a PUT request, handle the If-None-Match header as described in RFC 2616, HTTP/1.1 if it contains “*”', function (done) {
            done();
        });

        describe('If Header precondition in PUT Requests for RFC2616 fail', function () {

            it('Return HTTP 412 (Precondition Failed)', function (done) {
                done();
            });

            it('Do not modify the resource', function (done) {
                done();
            });
        });

        describe('If put request is received without either header for a resource that already exists', function () {

            it('Return 409 conflict', function (done) {
                done();
            });

            it('Return plaintext body explaining the situation', function (done) {
                done();
            });

            it('Do not modify the resource', function (done) {
                done();
            });
        });

    });

    describe('The LRS MUST support authentication using at least one of the following methods: (6.4)', function () {

        it('OAuth 1.0 (RFC 5849), with signature methods of "HMAC-SHA1", "RSA-SHA1", and "PLAINTEXT"', function (done) {
            done();
        });

        it('HTTP Basic Authentication', function (done) {
            done();
        });

        it('Common Access Cards (implementation details to follow in a later version)', function (done) {
            done();
        });
    });

    // describe('The LRS rejects with Error Code 429 Too Many Requests, if the LRS had received too many requests from the Client or set of credentials in a given amount of time. (Error Codes, Communication#3.2)', function() {
    //     it('test heading here', function(done) {
    //         this.timeout(0);
    //         var templates = [
    //             {statement: '{{statements.default}}'}
    //         ];
    //         var data = createFromTemplate(templates).statement;
    //         var stmts = [];
    //         // for (var i = 0; i < 10000; i++) {
    //             stmts.push(data);
    //         // }
    //         console.log(stmts.length);
    //         var count = 0;
    //         var startTime = Date.now();
    //         function overload () {
    //             request(helper.getEndpointAndAuth())
    //             .post(helper.getEndpointStatements())
    //             .headers(helper.addAllHeaders({}))
    //             .json(stmts)
    //             .end(function(err, res) {
    //                 if (err) {
    //                     console.log('No good', err);
    //                     done(err);
    //                 } else {
    //                     console.log('Good', res.statusCode, res.statusMessage);
    //                     if (res.statusCode === 200) {
    //                         console.log('Again', count++);
    //                         overload();
    //                     } else {
    //                         console.log('It is over!!', Date.now() - startTime);
    //                         done();
    //                     }
    //                 }
    //             })
    //         } overload();
    //     });
    // });

});






    function createFromTemplate(templates) {
        // convert template mapping to JSON objects
        var converted = helper.convertTemplate(templates);
        // this handles if no override
        var mockObject = helper.createTestObject(converted);
        return mockObject;
    }

    function parse(string, done) {
        var parsed;
        try {
            parsed = JSON.parse(string);
        } catch (error) {
            done(error);
        }
        return parsed;
    }

}(module, require('fs'), require('extend'), require('moment'), require('super-request'), require('supertest-as-promised'), require('chai'), require('url'), require('joi'), require('./../helper'), require('./../multipartParser'), require('./../redirect.js')));
