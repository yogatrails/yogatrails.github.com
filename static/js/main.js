/* Application */
(function(w, $, _) {
    'use strict';
    var self = null
        , inited = false
        , modules = {};

    /**
     * Returns module
     * @param name
     * @returns {boolean|*}
     */
    var getModule = function(name) {
        if (typeof modules[name] !== 'object') {
            throw 'Module ' + name + ' was not defined!';
        }
        if (!modules[name].factoryResult) {
            modules[name].factoryResult = modules[name].factory(self);
        }

        return modules[name].factoryResult;
    };

    /**
     * Very simple application class
     * Simple module system
     * @constructor
     */
    var Application = function() {
        if (self) {
            throw 'Application has been already initialized!';
        }
        self = this;
        self.eventBus = new EventEmitter();
        $(function() {
            inited = true;
            self.eventBus.emit(self.EVENT_INITIALISED);
        });
    };
    Application.prototype = {
        constructor: Application,

        EVENT_INITIALISED: 'event-initialized',

        /**
         * Use it to define module
         * @param name
         * @param factory
         * @param dependencies
         * @todo: dependencies
         */
        define: function(name, factory, dependencies) {
            if (typeof factory !== 'function') {
                throw 'Factory must be a function';
            }
            if (typeof modules[name] === 'object') {
                throw 'Module with name ' + name + ' has been already defined!';
            }
            dependencies = dependencies || [];
            modules[name] = {
                factory: factory
                , factoryResult: false
                , dependencies: dependencies
            };
        },

        /**
         * Use it to get module
         * @param name
         * @param callback
         */
        module: function(name, callback) {
            callback = callback || false;
            if (inited) {
                setTimeout(function(name) {
                    callback ? callback(getModule(name)) : getModule(name);
                }, 0);
            } else {
                self.eventBus.addListener(self.EVENT_INITIALISED, function() {
                    callback ? callback(getModule(name)) : getModule(name);
                });
            }
        }
    };

    w.app = new Application();
})(window, $, _);

/* Blog post collapsing */
(function(w, $, _) {
    var buttonTmpl = '';

    app.define('blog', function(app) {
        var $posts = $('.js-blog-post');
        _.map($posts, function(p, index) {
            var $p = $(p)
                , $text = $p.find('.js-blog-text')
                , text = $text.text()
                , coverLength = $p.find('.js-blog-text').data('cover-length')
                , id = 'collapse-text-' + index
                , hiddenElement = null;
            if (coverLength) {
                coverLength = parseInt(coverLength);
                text = text.slice(0, coverLength) + '<span id="'+id+'">' + text.slice(coverLength) + '</span>';
                $text.html(text);
                hiddenElement = $('#'+id);
                hiddenElement.hide();
                var $readMoreButton = $p.find('.js-blog-read-more');
                var $readLessButton = $p.find('.js-blog-read-less');
                $readLessButton.hide();
                $readMoreButton.on('click', function() {
                    hiddenElement.show();
                    $readLessButton.show();
                    $readMoreButton.hide();
                });
                $readLessButton.on('click', function() {
                    hiddenElement.hide();
                    $readMoreButton.show();
                    $readLessButton.hide();
                });
            }
        });
    });
    app.module('blog');
})(window, $, _);
