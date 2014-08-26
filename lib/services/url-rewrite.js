'use strict';

var _ = require('lodash');
var di = require('di');

var Logger = require('./logger');

function UrlRewrite(logger) {
  function validateRewrite(rule) {
    if (!rule ||
      typeof rule.from === 'undefined' ||
      typeof rule.to === 'undefined' ||
      typeof rule.from !== 'string' ||
      typeof rule.to !== 'string') {
      return false;
    }
    return true;
  }

  this.processRewrites = function(rewrites) {
    var rules = [];

    Object.keys(rewrites || {}).forEach(function(from) {
      var rule = {
        from: from,
        to: rewrites[from]
      };

      if (validateRewrite(rule)) {
        rule.from = new RegExp(rule.from);
        rules.push(rule);
        logger.log('Rewrite rule created for: [' + rule.from + ' -> ' + rule.to + '].');
      } else {
        logger.error('Invalid rule');
      }
    });

    return rules;
  };

  this.rewriteRequest = function(req) {
    return function(rule) {
      if (rule.from.test(req.url)) {
        logger.log('Request matched rewrite rule.  Rewriting ' + req.url + ' to ' + rule.to);
        req.url = req.url.replace(rule.from, rule.to);
      }
    };
  };
}

di.annotate(UrlRewrite, new di.Inject(Logger));

module.exports = UrlRewrite;