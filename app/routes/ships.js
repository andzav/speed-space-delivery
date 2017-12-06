let express = require('express');
let router = express.Router();
let planetModel = require('../models/planet.js');
let shipModel = require('../models/ship.js');
let containerModel = require('../models/container.js');
let userModel = require('../models/user.js');

router.route('/')
    .get(function (req, res) {
        let SID = req.query.SID;
        let query = req.query;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        userModel.findOne({
            'sessions.SID': SID,
            'sessions.ip': ip,
            'sessions.fingerprint': req.fingerprint.hash
        }, 'permission', function (err, person) {
            if (err) res.status(400).send('Error while querying database');
            else if (person) {
                if (person.permission === 'admin' || person.permission === 'operator') {
                    let params = {};
                    if (query.id !== undefined) params.id = query.id;
                    if (query.location !== undefined) params.location = query.location;
                    if (query.capacity !== undefined) params.capacity = query.capacity;
                    if (query.volume !== undefined) params.volume = query.volume;
                    if (query.ability !== undefined) params.ability = query.ability;
                    if (query.speed !== undefined) params.speed = query.speed;
                    if (query.consumption !== undefined) params.consumption = query.consumption;
                    if (query.available !== undefined) params.available = query.available;

                    shipModel.find(params, '-_id -__v', {
                        sort: {
                            id: 1
                        }
                    }, function (err, data) {
                        if (err) res.status(400).send('Error while querying ship database');
                        else if (data.length > 0) {
                            res.json(data);
                        } else res.status(400).send('Can not find any ships');
                    });
                } else res.status(401).send('Not enough permission');
            } else res.status(401).send('User not found');
        });
    })
    .post(function (req, res) {
        let SID = req.body.SID;
        let newShip = req.body.ship;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        userModel.findOne({
            'sessions.SID': SID,
            'sessions.ip': ip,
            'sessions.fingerprint': req.fingerprint.hash
        }, 'permission', function (err, person) {
            if (err) res.status(400).send('Error while querying database');
            else if (person) {
                if (person.permission === 'admin') {
                    if (newShip !== undefined && newShip.location !== undefined && newShip.capacity !== undefined &&
                        newShip.volume !== undefined && newShip.ability !== undefined && newShip.speed !== undefined && newShip.consumption !== undefined) {
                        planetModel.findOne({
                            name: newShip.location
                        }, function (err, result) {
                            if (err) res.status(400).send('Error while querying planet database');
                            else if (result) {
                                if (result.moonOf) {
                                    newShip.location = result.moonOf;
                                    newShip.ability = 'nearPlanet';
                                }
                                let ship = new shipModel(newShip);
                                ship.save(function (err) {
                                    if (err) res.status(400).send('Error while saving ship to database');
                                    else res.sendStatus(200);
                                })
                            } else res.status(400).send('Can not find given location');
                        });
                    } else res.status(400).send('Please specify all ship parameters');
                } else res.status(401).send('Not enough permission');
            } else res.status(401).send('User not found');
        });
    })
    .put(function (req, res) {
        let SID = req.body.SID;
        let ship = req.body.ship;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        userModel.findOne({
            'sessions.SID': SID,
            'sessions.ip': ip,
            'sessions.fingerprint': req.fingerprint.hash
        }, 'permission', function (err, person) {
            if (err) res.status(400).send('Error while querying database');
            else if (person) {
                if (person.permission === 'admin') {
                    if (ship !== undefined && ship.id !== undefined) {
                        shipModel.findOne({
                            id: ship.id
                        }, function (err, result) {
                            if (err) res.status(400).send('Error while querying ship database');
                            else if (result) {
                                if (ship.capacity !== undefined) result.capacity = ship.capacity;
                                if (ship.volume !== undefined) result.volume = ship.volume;
                                if (ship.ability !== undefined) result.ability = ship.ability;
                                if (ship.speed !== undefined) result.speed = ship.speed;
                                if (ship.consumption !== undefined) result.consumption = ship.consumption;
                                if (ship.available !== undefined) result.available = ship.available;
                                if (ship.location !== undefined) {
                                    planetModel.findOne({
                                        name: ship.location
                                    }, function (err, planet) {
                                        if (err) res.status(400).send('Error while querying planet database');
                                        else if (planet) {
                                            result.location = ship.location;
                                            result.save(function (err) {
                                                if (err) res.status(400).send('Error saving changes');
                                                else res.sendStatus(200);
                                            });
                                        } else res.status(400).send('Can not find given location');
                                    })
                                } else {
                                    result.save(function (err) {
                                        if (err) res.status(400).send('Error saving changes');
                                        else res.sendStatus(200);
                                    });
                                }
                            } else res.status(400).send('Ship not found');
                        });
                    } else res.status(400).send('Please specify ship id');
                } else res.status(401).send('Not enough permission');
            } else res.status(401).send('User not found');
        });
    })
    .delete(function (req, res) {
        let SID = req.body.SID;
        let query = req.body.ship;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        userModel.findOne({
            'sessions.SID': SID,
            'sessions.ip': ip,
            'sessions.fingerprint': req.fingerprint.hash
        }, 'permission', function (err, person) {
            if (err) res.status(400).send('Error while querying database');
            else if (person) {
                if (person.permission === 'admin') {
                    if (query !== undefined) {
                        let params = {};
                        if (query !== undefined && query.id !== undefined) params.id = query.id;
                        if (query !== undefined && query.location !== undefined) params.location = query.location;
                        if (query !== undefined && query.capacity !== undefined) params.capacity = query.capacity;
                        if (query !== undefined && query.volume !== undefined) params.volume = query.volume;
                        if (query !== undefined && query.ability !== undefined) params.ability = query.ability;
                        if (query !== undefined && query.speed !== undefined) params.speed = query.speed;
                        if (query !== undefined && query.consumption !== undefined) params.consumption = query.consumption;
                        params.available = true;

                        shipModel.find(params, function (err, data) {
                            if (err) res.status(400).send('Error while querying ship database');
                            else if (data.length > 0) {
                                let err0r = false;
                                data.forEach(function (el, i) {
                                    containerModel.findOne({
                                        'shipID': el.id
                                    }, function (err, result) {
                                        if (err) res.status(400).send('Error while querying container database');
                                        else if (!result) {
                                            shipModel.remove({
                                                _id: el._id
                                            }, function (err) {
                                                if (err) {
                                                    res.status(400).send('Error while removing ships from database');
                                                    err0r = true;
                                                } else if (i === data.length - 1 && !err0r) res.sendStatus(200);
                                            });
                                        }
                                    });
                                });
                            } else res.status(400).send('No ships found with given parameters');
                        });
                    } else res.status(400).send('Please specify ship parameters');
                } else res.status(401).send('Not enough permission');
            } else res.status(401).send('User not found');
        });
    });

module.exports = router;
