(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('@angular/forms'), require('ngx-bootstrap'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-editor', ['exports', '@angular/core', '@angular/common/http', 'rxjs', '@angular/forms', 'ngx-bootstrap', '@angular/common'], factory) :
    (factory((global['ngx-editor'] = {}),global.ng.core,global.ng.common.http,global.rxjs,global.ng.forms,global['ngx-bootstrap'],global.ng.common));
}(this, (function (exports,core,http,rxjs,forms,ngxBootstrap,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * enable or disable toolbar based on configuration
     *
     * @param {?} value toolbar item
     * @param {?} toolbar toolbar configuration object
     * @return {?}
     */
    function canEnableToolbarOptions(value, toolbar) {
        if (value) {
            if (toolbar['length'] === 0) {
                return true;
            }
            else {
                /** @type {?} */
                var found = toolbar.filter(function (array) {
                    return array.indexOf(value) !== -1;
                });
                return found.length ? true : false;
            }
        }
        else {
            return false;
        }
    }
    /**
     * set editor configuration
     *
     * @param {?} value configuration via [config] property
     * @param {?} ngxEditorConfig default editor configuration
     * @param {?} input direct configuration inputs via directives
     * @return {?}
     */
    function getEditorConfiguration(value, ngxEditorConfig, input) {
        for (var i in ngxEditorConfig) {
            if (i) {
                if (input[i] !== undefined) {
                    value[i] = input[i];
                }
                if (!value.hasOwnProperty(i)) {
                    value[i] = ngxEditorConfig[i];
                }
            }
        }
        return value;
    }
    /**
     * return vertical if the element is the resizer property is set to basic
     *
     * @param {?} resizer type of resizer, either basic or stack
     * @return {?}
     */
    function canResize(resizer) {
        if (resizer === 'basic') {
            return 'vertical';
        }
        return false;
    }
    /**
     * save selection when the editor is focussed out
     * @return {?}
     */
    function saveSelection() {
        if (window.getSelection) {
            /** @type {?} */
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        }
        else if (document.getSelection && document.createRange) {
            return document.createRange();
        }
        return null;
    }
    /**
     * restore selection when the editor is focussed in
     *
     * @param {?} range saved selection when the editor is focussed out
     * @return {?}
     */
    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                /** @type {?} */
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                return true;
            }
            else if (document.getSelection && range.select) {
                range.select();
                return true;
            }
        }
        else {
            return false;
        }
    }

    var Utils = /*#__PURE__*/Object.freeze({
        canEnableToolbarOptions: canEnableToolbarOptions,
        getEditorConfiguration: getEditorConfiguration,
        canResize: canResize,
        saveSelection: saveSelection,
        restoreSelection: restoreSelection
    });

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CommandExecutorService = /** @class */ (function () {
        /**
         *
         * @param _http HTTP Client for making http requests
         */
        function CommandExecutorService(_http) {
            this._http = _http;
            /**
             * saves the selection from the editor when focussed out
             */
            this.savedSelection = undefined;
        }
        /**
         * executes command from the toolbar
         *
         * @param command command to be executed
         */
        /**
         * executes command from the toolbar
         *
         * @param {?} command command to be executed
         * @return {?}
         */
        CommandExecutorService.prototype.execute = /**
         * executes command from the toolbar
         *
         * @param {?} command command to be executed
         * @return {?}
         */
            function (command) {
                if (!this.savedSelection && command !== 'enableObjectResizing') {
                    throw new Error('Range out of Editor');
                }
                if (command === 'enableObjectResizing') {
                    document.execCommand('enableObjectResizing', true);
                }
                if (command === 'blockquote') {
                    document.execCommand('formatBlock', false, 'blockquote');
                }
                if (command === 'removeBlockquote') {
                    document.execCommand('formatBlock', false, 'div');
                }
                document.execCommand(command, false, null);
            };
        /**
         * inserts image in the editor
         *
         * @param imageURI url of the image to be inserted
         */
        /**
         * inserts image in the editor
         *
         * @param {?} imageURI url of the image to be inserted
         * @return {?}
         */
        CommandExecutorService.prototype.insertImage = /**
         * inserts image in the editor
         *
         * @param {?} imageURI url of the image to be inserted
         * @return {?}
         */
            function (imageURI) {
                if (this.savedSelection) {
                    if (imageURI) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            /** @type {?} */
                            var inserted = document.execCommand('insertImage', false, imageURI);
                            if (!inserted) {
                                throw new Error('Invalid URL');
                            }
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
       * inserts image in the editor
       *
       * @param videParams url of the image to be inserted
       */
        /**
         * inserts image in the editor
         *
         * @param {?} videParams url of the image to be inserted
         * @return {?}
         */
        CommandExecutorService.prototype.insertVideo = /**
         * inserts image in the editor
         *
         * @param {?} videParams url of the image to be inserted
         * @return {?}
         */
            function (videParams) {
                if (this.savedSelection) {
                    if (videParams) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isYoutubeLink(videParams.videoUrl)) {
                                /** @type {?} */
                                var youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                                    + 'src="' + videParams.videoUrl + '"></iframe>';
                                this.insertHtml(youtubeURL);
                            }
                            else if (this.checkTagSupportInBrowser('video')) {
                                if (this.isValidURL(videParams.videoUrl)) {
                                    /** @type {?} */
                                    var videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
                                        + ' controls="true"><source src="' + videParams.videoUrl + '"></video>';
                                    this.insertHtml(videoSrc);
                                }
                                else {
                                    throw new Error('Invalid video URL');
                                }
                            }
                            else {
                                throw new Error('Unable to insert video');
                            }
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
         * checks the input url is a valid youtube URL or not
         *
         * @param {?} url Youtue URL
         * @return {?}
         */
        CommandExecutorService.prototype.isYoutubeLink = /**
         * checks the input url is a valid youtube URL or not
         *
         * @param {?} url Youtue URL
         * @return {?}
         */
            function (url) {
                /** @type {?} */
                var ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
                return ytRegExp.test(url);
            };
        /**
         * check whether the string is a valid url or not
         * @param {?} url url
         * @return {?}
         */
        CommandExecutorService.prototype.isValidURL = /**
         * check whether the string is a valid url or not
         * @param {?} url url
         * @return {?}
         */
            function (url) {
                /** @type {?} */
                var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                return urlRegExp.test(url);
            };
        /**
         * uploads image to the server
         *
         * @param file file that has to be uploaded
         * @param endPoint enpoint to which the image has to be uploaded
         */
        /**
         * uploads image to the server
         *
         * @param {?} file file that has to be uploaded
         * @param {?} endPoint enpoint to which the image has to be uploaded
         * @return {?}
         */
        CommandExecutorService.prototype.uploadImage = /**
         * uploads image to the server
         *
         * @param {?} file file that has to be uploaded
         * @param {?} endPoint enpoint to which the image has to be uploaded
         * @return {?}
         */
            function (file, endPoint) {
                if (!endPoint) {
                    throw new Error('Image Endpoint isn`t provided or invalid');
                }
                /** @type {?} */
                var formData = new FormData();
                if (file) {
                    formData.append('file', file);
                    /** @type {?} */
                    var req = new http.HttpRequest('POST', endPoint, formData, {
                        reportProgress: true
                    });
                    return this._http.request(req);
                }
                else {
                    throw new Error('Invalid Image');
                }
            };
        /**
         * inserts link in the editor
         *
         * @param params parameters that holds the information for the link
         */
        /**
         * inserts link in the editor
         *
         * @param {?} params parameters that holds the information for the link
         * @return {?}
         */
        CommandExecutorService.prototype.createLink = /**
         * inserts link in the editor
         *
         * @param {?} params parameters that holds the information for the link
         * @return {?}
         */
            function (params) {
                if (this.savedSelection) {
                    /**
                           * check whether the saved selection contains a range or plain selection
                           */
                    if (params.urlNewTab) {
                        /** @type {?} */
                        var newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                        if (document.getSelection().type !== 'Range') {
                            /** @type {?} */
                            var restored = restoreSelection(this.savedSelection);
                            if (restored) {
                                this.insertHtml(newUrl);
                            }
                        }
                        else {
                            throw new Error('Only new links can be inserted. You cannot edit URL`s');
                        }
                    }
                    else {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            document.execCommand('createLink', false, params.urlLink);
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
         * insert color either font or background
         *
         * @param color color to be inserted
         * @param where where the color has to be inserted either text/background
         */
        /**
         * insert color either font or background
         *
         * @param {?} color color to be inserted
         * @param {?} where where the color has to be inserted either text/background
         * @return {?}
         */
        CommandExecutorService.prototype.insertColor = /**
         * insert color either font or background
         *
         * @param {?} color color to be inserted
         * @param {?} where where the color has to be inserted either text/background
         * @return {?}
         */
            function (color, where) {
                if (this.savedSelection) {
                    /** @type {?} */
                    var restored = restoreSelection(this.savedSelection);
                    if (restored && this.checkSelection()) {
                        if (where === 'textColor') {
                            document.execCommand('foreColor', false, color);
                        }
                        else {
                            document.execCommand('hiliteColor', false, color);
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
         * set font size for text
         *
         * @param fontSize font-size to be set
         */
        /**
         * set font size for text
         *
         * @param {?} fontSize font-size to be set
         * @return {?}
         */
        CommandExecutorService.prototype.setFontSize = /**
         * set font size for text
         *
         * @param {?} fontSize font-size to be set
         * @return {?}
         */
            function (fontSize) {
                if (this.savedSelection && this.checkSelection()) {
                    /** @type {?} */
                    var deletedValue = this.deleteAndGetElement();
                    if (deletedValue) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isNumeric(fontSize)) {
                                /** @type {?} */
                                var fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                                this.insertHtml(fontPx);
                            }
                            else {
                                /** @type {?} */
                                var fontPx = '<span style="font-size: ' + fontSize + ';">' + deletedValue + '</span>';
                                this.insertHtml(fontPx);
                            }
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
         * set font name/family for text
         *
         * @param fontName font-family to be set
         */
        /**
         * set font name/family for text
         *
         * @param {?} fontName font-family to be set
         * @return {?}
         */
        CommandExecutorService.prototype.setFontName = /**
         * set font name/family for text
         *
         * @param {?} fontName font-family to be set
         * @return {?}
         */
            function (fontName) {
                if (this.savedSelection && this.checkSelection()) {
                    /** @type {?} */
                    var deletedValue = this.deleteAndGetElement();
                    if (deletedValue) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isNumeric(fontName)) {
                                /** @type {?} */
                                var fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                                this.insertHtml(fontFamily);
                            }
                            else {
                                /** @type {?} */
                                var fontFamily = '<span style="font-family: ' + fontName + ';">' + deletedValue + '</span>';
                                this.insertHtml(fontFamily);
                            }
                        }
                    }
                }
                else {
                    throw new Error('Keine Textstelle ausgewählt');
                }
            };
        /**
         * insert HTML
         * @param {?} html
         * @return {?}
         */
        CommandExecutorService.prototype.insertHtml = /**
         * insert HTML
         * @param {?} html
         * @return {?}
         */
            function (html) {
                /** @type {?} */
                var isHTMLInserted = document.execCommand('insertHTML', false, html);
                if (!isHTMLInserted) {
                    throw new Error('Unable to perform the operation');
                }
            };
        /**
         * check whether the value is a number or string
         * if number return true
         * else return false
         * @param {?} value
         * @return {?}
         */
        CommandExecutorService.prototype.isNumeric = /**
         * check whether the value is a number or string
         * if number return true
         * else return false
         * @param {?} value
         * @return {?}
         */
            function (value) {
                return /^-{0,1}\d+$/.test(value);
            };
        /**
         * delete the text at selected range and return the value
         * @return {?}
         */
        CommandExecutorService.prototype.deleteAndGetElement = /**
         * delete the text at selected range and return the value
         * @return {?}
         */
            function () {
                /** @type {?} */
                var slectedText;
                if (this.savedSelection) {
                    slectedText = this.savedSelection.toString();
                    this.savedSelection.deleteContents();
                    return slectedText;
                }
                return false;
            };
        /**
         * check any slection is made or not
         * @return {?}
         */
        CommandExecutorService.prototype.checkSelection = /**
         * check any slection is made or not
         * @return {?}
         */
            function () {
                /** @type {?} */
                var slectedText = this.savedSelection.toString();
                if (slectedText.length === 0) {
                    throw new Error('No Selection Made');
                }
                return true;
            };
        /**
         * check tag is supported by browser or not
         *
         * @param {?} tag HTML tag
         * @return {?}
         */
        CommandExecutorService.prototype.checkTagSupportInBrowser = /**
         * check tag is supported by browser or not
         *
         * @param {?} tag HTML tag
         * @return {?}
         */
            function (tag) {
                return !(document.createElement(tag) instanceof HTMLUnknownElement);
            };
        CommandExecutorService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CommandExecutorService.ctorParameters = function () {
            return [
                { type: http.HttpClient }
            ];
        };
        return CommandExecutorService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * time in which the message has to be cleared
      @type {?} */
    var DURATION = 7000;
    var MessageService = /** @class */ (function () {
        function MessageService() {
            /**
             * variable to hold the user message
             */
            this.message = new rxjs.Subject();
        }
        /** returns the message sent by the editor */
        /**
         * returns the message sent by the editor
         * @return {?}
         */
        MessageService.prototype.getMessage = /**
         * returns the message sent by the editor
         * @return {?}
         */
            function () {
                return this.message.asObservable();
            };
        /**
         * sends message to the editor
         *
         * @param message message to be sent
         */
        /**
         * sends message to the editor
         *
         * @param {?} message message to be sent
         * @return {?}
         */
        MessageService.prototype.sendMessage = /**
         * sends message to the editor
         *
         * @param {?} message message to be sent
         * @return {?}
         */
            function (message) {
                this.message.next(message);
                this.clearMessageIn(DURATION);
            };
        /**
         * a short interval to clear message
         *
         * @param {?} milliseconds time in seconds in which the message has to be cleared
         * @return {?}
         */
        MessageService.prototype.clearMessageIn = /**
         * a short interval to clear message
         *
         * @param {?} milliseconds time in seconds in which the message has to be cleared
         * @return {?}
         */
            function (milliseconds) {
                var _this = this;
                setTimeout(function () {
                    _this.message.next(undefined);
                }, milliseconds);
            };
        MessageService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        MessageService.ctorParameters = function () { return []; };
        return MessageService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * toolbar default configuration
      @type {?} */
    var ngxEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        imageEndPoint: '',
        toolbar: [
            ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
            ['fontName', 'fontSize', 'color'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
            ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
            ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
            ['link', 'unlink', 'image', 'video']
        ]
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorComponent = /** @class */ (function () {
        /**
         * @param _messageService service to send message to the editor message component
         * @param _commandExecutor executes command from the toolbar
         * @param _renderer access and manipulate the dom element
         */
        function NgxEditorComponent(_messageService, _commandExecutor, _renderer) {
            this._messageService = _messageService;
            this._commandExecutor = _commandExecutor;
            this._renderer = _renderer;
            /**
             * The editor can be resized vertically.
             *
             * `basic` resizer enables the html5 reszier. Check here https://www.w3schools.com/cssref/css3_pr_resize.asp
             *
             * `stack` resizer enable a resizer that looks like as if in https://stackoverflow.com
             */
            this.resizer = 'stack';
            /**
             * The config property is a JSON object
             *
             * All avaibale inputs inputs can be provided in the configuration as JSON
             * inputs provided directly are considered as top priority
             */
            this.config = ngxEditorConfig;
            /**
             * emits `blur` event when focused out from the textarea
             */
            this.blur = new core.EventEmitter();
            /**
             * emits `focus` event when focused in to the textarea
             */
            this.focus = new core.EventEmitter();
            this.Utils = Utils;
        }
        /**
         * events
         */
        /**
         * events
         * @return {?}
         */
        NgxEditorComponent.prototype.onTextAreaFocus = /**
         * events
         * @return {?}
         */
            function () {
                this.focus.emit('focus');
            };
        /** focus the text area when the editor is focussed */
        /**
         * focus the text area when the editor is focussed
         * @return {?}
         */
        NgxEditorComponent.prototype.onEditorFocus = /**
         * focus the text area when the editor is focussed
         * @return {?}
         */
            function () {
                this.textArea.nativeElement.focus();
            };
        /**
         * Executed from the contenteditable section while the input property changes
         * @param html html string from contenteditable
         */
        /**
         * Executed from the contenteditable section while the input property changes
         * @param {?} innerHTML
         * @return {?}
         */
        NgxEditorComponent.prototype.onContentChange = /**
         * Executed from the contenteditable section while the input property changes
         * @param {?} innerHTML
         * @return {?}
         */
            function (innerHTML) {
                if (typeof this.onChange === 'function') {
                    this.onChange(innerHTML);
                    this.togglePlaceholder(innerHTML);
                }
            };
        /**
         * @return {?}
         */
        NgxEditorComponent.prototype.onTextAreaBlur = /**
         * @return {?}
         */
            function () {
                /** save selection if focussed out */
                this._commandExecutor.savedSelection = saveSelection();
                if (typeof this.onTouched === 'function') {
                    this.onTouched();
                }
                this.blur.emit('blur');
            };
        /**
         * resizing text area
         *
         * @param offsetY vertical height of the eidtable portion of the editor
         */
        /**
         * resizing text area
         *
         * @param {?} offsetY vertical height of the eidtable portion of the editor
         * @return {?}
         */
        NgxEditorComponent.prototype.resizeTextArea = /**
         * resizing text area
         *
         * @param {?} offsetY vertical height of the eidtable portion of the editor
         * @return {?}
         */
            function (offsetY) {
                /** @type {?} */
                var newHeight = parseInt(this.height, 10);
                newHeight += offsetY;
                this.height = newHeight + 'px';
                this.textArea.nativeElement.style.height = this.height;
            };
        /**
         * editor actions, i.e., executes command from toolbar
         *
         * @param commandName name of the command to be executed
         */
        /**
         * editor actions, i.e., executes command from toolbar
         *
         * @param {?} commandName name of the command to be executed
         * @return {?}
         */
        NgxEditorComponent.prototype.executeCommand = /**
         * editor actions, i.e., executes command from toolbar
         *
         * @param {?} commandName name of the command to be executed
         * @return {?}
         */
            function (commandName) {
                try {
                    this._commandExecutor.execute(commandName);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
            };
        /**
         * Write a new value to the element.
         *
         * @param value value to be executed when there is a change in contenteditable
         */
        /**
         * Write a new value to the element.
         *
         * @param {?} value value to be executed when there is a change in contenteditable
         * @return {?}
         */
        NgxEditorComponent.prototype.writeValue = /**
         * Write a new value to the element.
         *
         * @param {?} value value to be executed when there is a change in contenteditable
         * @return {?}
         */
            function (value) {
                this.togglePlaceholder(value);
                if (value === null || value === undefined || value === '' || value === '<br>') {
                    value = null;
                }
                this.refreshView(value);
            };
        /**
         * Set the function to be called
         * when the control receives a change event.
         *
         * @param fn a function
         */
        /**
         * Set the function to be called
         * when the control receives a change event.
         *
         * @param {?} fn a function
         * @return {?}
         */
        NgxEditorComponent.prototype.registerOnChange = /**
         * Set the function to be called
         * when the control receives a change event.
         *
         * @param {?} fn a function
         * @return {?}
         */
            function (fn) {
                this.onChange = fn;
            };
        /**
         * Set the function to be called
         * when the control receives a touch event.
         *
         * @param fn a function
         */
        /**
         * Set the function to be called
         * when the control receives a touch event.
         *
         * @param {?} fn a function
         * @return {?}
         */
        NgxEditorComponent.prototype.registerOnTouched = /**
         * Set the function to be called
         * when the control receives a touch event.
         *
         * @param {?} fn a function
         * @return {?}
         */
            function (fn) {
                this.onTouched = fn;
            };
        /**
         * refresh view/HTML of the editor
         *
         * @param value html string from the editor
         */
        /**
         * refresh view/HTML of the editor
         *
         * @param {?} value html string from the editor
         * @return {?}
         */
        NgxEditorComponent.prototype.refreshView = /**
         * refresh view/HTML of the editor
         *
         * @param {?} value html string from the editor
         * @return {?}
         */
            function (value) {
                /** @type {?} */
                var normalizedValue = value === null ? '' : value;
                this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
            };
        /**
         * toggles placeholder based on input string
         *
         * @param value A HTML string from the editor
         */
        /**
         * toggles placeholder based on input string
         *
         * @param {?} value A HTML string from the editor
         * @return {?}
         */
        NgxEditorComponent.prototype.togglePlaceholder = /**
         * toggles placeholder based on input string
         *
         * @param {?} value A HTML string from the editor
         * @return {?}
         */
            function (value) {
                if (!value || value === '<br>' || value === '') {
                    this._renderer.addClass(this.ngxWrapper.nativeElement, 'show-placeholder');
                }
                else {
                    this._renderer.removeClass(this.ngxWrapper.nativeElement, 'show-placeholder');
                }
            };
        /**
         * returns a json containing input params
         */
        /**
         * returns a json containing input params
         * @return {?}
         */
        NgxEditorComponent.prototype.getCollectiveParams = /**
         * returns a json containing input params
         * @return {?}
         */
            function () {
                return {
                    editable: this.editable,
                    spellcheck: this.spellcheck,
                    placeholder: this.placeholder,
                    translate: this.translate,
                    height: this.height,
                    minHeight: this.minHeight,
                    width: this.width,
                    minWidth: this.minWidth,
                    enableToolbar: this.enableToolbar,
                    showToolbar: this.showToolbar,
                    imageEndPoint: this.imageEndPoint,
                    toolbar: this.toolbar
                };
            };
        /**
         * @return {?}
         */
        NgxEditorComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                /**
                     * set configuartion
                     */
                this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
                this.height = this.height || this.textArea.nativeElement.offsetHeight;
                this.executeCommand('enableObjectResizing');
            };
        NgxEditorComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor',
                        template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\"\n      [style.minHeight]=\"config['minHeight']\" [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\"\n      (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                        providers: [{
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: core.forwardRef(function () { return NgxEditorComponent; }),
                                multi: true
                            }],
                        styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorComponent.ctorParameters = function () {
            return [
                { type: MessageService },
                { type: CommandExecutorService },
                { type: core.Renderer2 }
            ];
        };
        NgxEditorComponent.propDecorators = {
            editable: [{ type: core.Input }],
            spellcheck: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            translate: [{ type: core.Input }],
            height: [{ type: core.Input }],
            minHeight: [{ type: core.Input }],
            width: [{ type: core.Input }],
            minWidth: [{ type: core.Input }],
            toolbar: [{ type: core.Input }],
            resizer: [{ type: core.Input }],
            config: [{ type: core.Input }],
            showToolbar: [{ type: core.Input }],
            enableToolbar: [{ type: core.Input }],
            imageEndPoint: [{ type: core.Input }],
            blur: [{ type: core.Output }],
            focus: [{ type: core.Output }],
            textArea: [{ type: core.ViewChild, args: ['ngxTextArea',] }],
            ngxWrapper: [{ type: core.ViewChild, args: ['ngxWrapper',] }]
        };
        return NgxEditorComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxGrippieComponent = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param _editorComponent Editor component
         */
        function NgxGrippieComponent(_editorComponent) {
            this._editorComponent = _editorComponent;
            /**
             * previous value befor resizing the editor
             */
            this.oldY = 0;
            /**
             * set to true on mousedown event
             */
            this.grabber = false;
        }
        /**
         *
         * @param event Mouseevent
         *
         * Update the height of the editor when the grabber is dragged
         */
        /**
         *
         * @param {?} event Mouseevent
         *
         * Update the height of the editor when the grabber is dragged
         * @return {?}
         */
        NgxGrippieComponent.prototype.onMouseMove = /**
         *
         * @param {?} event Mouseevent
         *
         * Update the height of the editor when the grabber is dragged
         * @return {?}
         */
            function (event) {
                if (!this.grabber) {
                    return;
                }
                this._editorComponent.resizeTextArea(event.clientY - this.oldY);
                this.oldY = event.clientY;
            };
        /**
         *
         * @param event Mouseevent
         *
         * set the grabber to false on mouse up action
         */
        /**
         *
         * @param {?} event Mouseevent
         *
         * set the grabber to false on mouse up action
         * @return {?}
         */
        NgxGrippieComponent.prototype.onMouseUp = /**
         *
         * @param {?} event Mouseevent
         *
         * set the grabber to false on mouse up action
         * @return {?}
         */
            function (event) {
                this.grabber = false;
            };
        /**
         * @param {?} event
         * @param {?=} resizer
         * @return {?}
         */
        NgxGrippieComponent.prototype.onResize = /**
         * @param {?} event
         * @param {?=} resizer
         * @return {?}
         */
            function (event, resizer) {
                this.grabber = true;
                this.oldY = event.clientY;
                event.preventDefault();
            };
        NgxGrippieComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-grippie',
                        template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                        styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
                    }] }
        ];
        /** @nocollapse */
        NgxGrippieComponent.ctorParameters = function () {
            return [
                { type: NgxEditorComponent }
            ];
        };
        NgxGrippieComponent.propDecorators = {
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }],
            onMouseUp: [{ type: core.HostListener, args: ['document:mouseup', ['$event'],] }],
            onResize: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }]
        };
        return NgxGrippieComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorMessageComponent = /** @class */ (function () {
        /**
         * @param _messageService service to send message to the editor
         */
        function NgxEditorMessageComponent(_messageService) {
            var _this = this;
            this._messageService = _messageService;
            /**
             * property that holds the message to be displayed on the editor
             */
            this.ngxMessage = undefined;
            this._messageService.getMessage().subscribe(function (message) { return _this.ngxMessage = message; });
        }
        /**
         * clears editor message
         */
        /**
         * clears editor message
         * @return {?}
         */
        NgxEditorMessageComponent.prototype.clearMessage = /**
         * clears editor message
         * @return {?}
         */
            function () {
                this.ngxMessage = undefined;
            };
        NgxEditorMessageComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor-message',
                        template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
                        styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorMessageComponent.ctorParameters = function () {
            return [
                { type: MessageService }
            ];
        };
        return NgxEditorMessageComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorToolbarComponent = /** @class */ (function () {
        function NgxEditorToolbarComponent(_popOverConfig, _formBuilder, _messageService, _commandExecutorService) {
            this._popOverConfig = _popOverConfig;
            this._formBuilder = _formBuilder;
            this._messageService = _messageService;
            this._commandExecutorService = _commandExecutorService;
            /**
             * set to false when image is being uploaded
             */
            this.uploadComplete = true;
            /**
             * upload percentage
             */
            this.updloadPercentage = 0;
            /**
             * set to true when the image is being uploaded
             */
            this.isUploading = false;
            /**
             * which tab to active for color insetion
             */
            this.selectedColorTab = 'textColor';
            /**
             * font family name
             */
            this.fontName = '';
            /**
             * font size
             */
            this.fontSize = '';
            /**
             * hex color code
             */
            this.hexColor = '';
            /**
             * show/hide image uploader
             */
            this.isImageUploader = false;
            /**
             * Emits an event when a toolbar button is clicked
             */
            this.execute = new core.EventEmitter();
            this._popOverConfig.outsideClick = true;
            this._popOverConfig.placement = 'bottom';
            this._popOverConfig.container = 'body';
        }
        /**
         * enable or diable toolbar based on configuration
         *
         * @param value name of the toolbar buttons
         */
        /**
         * enable or diable toolbar based on configuration
         *
         * @param {?} value name of the toolbar buttons
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.canEnableToolbarOptions = /**
         * enable or diable toolbar based on configuration
         *
         * @param {?} value name of the toolbar buttons
         * @return {?}
         */
            function (value) {
                return canEnableToolbarOptions(value, this.config['toolbar']);
            };
        /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param command name of the command to be executed
         */
        /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param {?} command name of the command to be executed
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.triggerCommand = /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param {?} command name of the command to be executed
         * @return {?}
         */
            function (command) {
                this.execute.emit(command);
            };
        /**
         * create URL insert form
         */
        /**
         * create URL insert form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildUrlForm = /**
         * create URL insert form
         * @return {?}
         */
            function () {
                this.urlForm = this._formBuilder.group({
                    urlLink: ['', [forms.Validators.required]],
                    urlText: ['', [forms.Validators.required]],
                    urlNewTab: [true]
                });
            };
        /**
         * inserts link in the editor
         */
        /**
         * inserts link in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertLink = /**
         * inserts link in the editor
         * @return {?}
         */
            function () {
                try {
                    this._commandExecutorService.createLink(this.urlForm.value);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                /** reset form to default */
                this.buildUrlForm();
                /** close inset URL pop up */
                this.urlPopover.hide();
            };
        /**
         * create insert image form
         */
        /**
         * create insert image form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildImageForm = /**
         * create insert image form
         * @return {?}
         */
            function () {
                this.imageForm = this._formBuilder.group({
                    imageUrl: ['', [forms.Validators.required]]
                });
            };
        /**
         * create insert image form
         */
        /**
         * create insert image form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildVideoForm = /**
         * create insert image form
         * @return {?}
         */
            function () {
                this.videoForm = this._formBuilder.group({
                    videoUrl: ['', [forms.Validators.required]],
                    height: [''],
                    width: ['']
                });
            };
        /**
         * Executed when file is selected
         *
         * @param e onChange event
         */
        /**
         * Executed when file is selected
         *
         * @param {?} e onChange event
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.onFileChange = /**
         * Executed when file is selected
         *
         * @param {?} e onChange event
         * @return {?}
         */
            function (e) {
                var _this = this;
                this.uploadComplete = false;
                this.isUploading = true;
                if (e.target.files.length > 0) {
                    /** @type {?} */
                    var file = e.target.files[0];
                    try {
                        this._commandExecutorService.uploadImage(file, this.config.imageEndPoint).subscribe(function (event) {
                            if (event.type) {
                                _this.updloadPercentage = Math.round(100 * event.loaded / event.total);
                            }
                            if (event instanceof http.HttpResponse) {
                                try {
                                    _this._commandExecutorService.insertImage(event.body.url);
                                }
                                catch (error) {
                                    _this._messageService.sendMessage(error.message);
                                }
                                _this.uploadComplete = true;
                                _this.isUploading = false;
                            }
                        });
                    }
                    catch (error) {
                        this._messageService.sendMessage(error.message);
                        this.uploadComplete = true;
                        this.isUploading = false;
                    }
                }
            };
        /** insert image in the editor */
        /**
         * insert image in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertImage = /**
         * insert image in the editor
         * @return {?}
         */
            function () {
                try {
                    this._commandExecutorService.insertImage(this.imageForm.value.imageUrl);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                /** reset form to default */
                this.buildImageForm();
                /** close inset URL pop up */
                this.imagePopover.hide();
            };
        /** insert image in the editor */
        /**
         * insert image in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertVideo = /**
         * insert image in the editor
         * @return {?}
         */
            function () {
                try {
                    this._commandExecutorService.insertVideo(this.videoForm.value);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                /** reset form to default */
                this.buildVideoForm();
                /** close inset URL pop up */
                this.videoPopover.hide();
            };
        /** inser text/background color */
        /**
         * inser text/background color
         * @param {?} color
         * @param {?} where
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertColor = /**
         * inser text/background color
         * @param {?} color
         * @param {?} where
         * @return {?}
         */
            function (color, where) {
                try {
                    /** @type {?} */
                    var hex = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                    hex = "#" +
                        ("0" + parseInt(hex[1], 10).toString(16)).slice(-2) +
                        ("0" + parseInt(hex[2], 10).toString(16)).slice(-2) +
                        ("0" + parseInt(hex[3], 10).toString(16)).slice(-2);
                    this._commandExecutorService.insertColor(hex, where);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                this.colorPopover.hide();
            };
        /** set font size */
        /**
         * set font size
         * @param {?} fontSize
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.setFontSize = /**
         * set font size
         * @param {?} fontSize
         * @return {?}
         */
            function (fontSize) {
                try {
                    this._commandExecutorService.setFontSize(fontSize);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                this.fontSizePopover.hide();
            };
        /** set font Name/family */
        /**
         * set font Name/family
         * @param {?} fontName
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.setFontName = /**
         * set font Name/family
         * @param {?} fontName
         * @return {?}
         */
            function (fontName) {
                try {
                    this._commandExecutorService.setFontName(fontName);
                }
                catch (error) {
                    this._messageService.sendMessage(error.message);
                }
                this.fontSizePopover.hide();
            };
        /**
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.buildUrlForm();
                this.buildImageForm();
                this.buildVideoForm();
            };
        NgxEditorToolbarComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor-toolbar',
                        template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\" (click)=\"triggerCommand('bold')\"\n      title=\"Fett\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\" (click)=\"triggerCommand('italic')\"\n      title=\"Kursiv\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\" (click)=\"triggerCommand('underline')\"\n      title=\"Unterstrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\" (click)=\"triggerCommand('strikeThrough')\"\n      title=\"Durchgestrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\" (click)=\"triggerCommand('superscript')\"\n      title=\"Superskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\" (click)=\"triggerCommand('subscript')\"\n      title=\"Subskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n      title=\"Schriftart\" [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n      title=\"Schriftgr\u00F6\u00DFe\" [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n      title=\"Farbe\" [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\" (click)=\"triggerCommand('justifyLeft')\"\n      title=\"Linksb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\" (click)=\"triggerCommand('justifyCenter')\"\n      title=\"Zentriert\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\" (click)=\"triggerCommand('justifyRight')\"\n      title=\"Rechtsb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\" (click)=\"triggerCommand('justifyFull')\"\n      title=\"Blocksatz\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\" (click)=\"triggerCommand('indent')\"\n      title=\"Einr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\" (click)=\"triggerCommand('outdent')\"\n      title=\"Ausr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\" (click)=\"triggerCommand('cut')\"\n      title=\"Ausschneiden\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\" (click)=\"triggerCommand('copy')\"\n      title=\"Kopieren\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-files-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\" (click)=\"triggerCommand('delete')\"\n      title=\"L\u00F6schen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\" (click)=\"triggerCommand('removeFormat')\"\n      title=\"Formatierung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\" (click)=\"triggerCommand('undo')\"\n      title=\"R\u00FCckg\u00E4ngig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\" (click)=\"triggerCommand('redo')\"\n      title=\"Wiederholen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\" (click)=\"triggerCommand('insertParagraph')\"\n      title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\" (click)=\"triggerCommand('blockquote')\"\n      title=\"Blockzitat\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\" (click)=\"triggerCommand('removeBlockquote')\"\n      title=\"Blockzitat entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\" (click)=\"triggerCommand('insertHorizontalRule')\"\n      title=\"Horizontale Linie\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\" (click)=\"triggerCommand('insertUnorderedList')\"\n      title=\"Ungeordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\" (click)=\"triggerCommand('insertOrderedList')\"\n      title=\"Geordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n      [popover]=\"insertLinkTemplate\" title=\"Verlinkung einf\u00FCgen\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\" (click)=\"triggerCommand('unlink')\"\n      title=\"Verlinkung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n      title=\"Bild\" [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n      title=\"Video\" [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n          required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">In neuem Tab \u00F6ffnen</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fa fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"> </div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"> </div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Bild w\u00E4hlen</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Wird hochgeladen</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\" [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n              required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\" [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n          [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n            required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"H\u00F6he (px)\" pattern=\"[0-9]\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"Breite (px)\" pattern=\"[0-9]\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Textfarbe</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Hintergrundfarbe</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <app-color-picker #cpicker></app-color-picker>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(cpicker.color, selectedColorTab)\">OK</button>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Schriftgr\u00F6\u00DFe</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Schriftgr\u00F6\u00DFe in px/rem\"\n          [(ngModel)]=\"fontSize\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Schriftart</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\" placeholder=\"Zum Beispiel: 'Times New Roman', Times, serif\"\n          [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n",
                        providers: [ngxBootstrap.PopoverConfig],
                        styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{display:flex;flex-wrap:wrap;background-color:#f5f5f5;font-size:.8rem;padding:.2rem .2rem 0;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:flex;border-radius:5px;background-color:#fff;margin-right:.2rem;margin-bottom:.2rem}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;display:inline-flex;justify-content:center;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorToolbarComponent.ctorParameters = function () {
            return [
                { type: ngxBootstrap.PopoverConfig },
                { type: forms.FormBuilder },
                { type: MessageService },
                { type: CommandExecutorService }
            ];
        };
        NgxEditorToolbarComponent.propDecorators = {
            config: [{ type: core.Input }],
            urlPopover: [{ type: core.ViewChild, args: ['urlPopover',] }],
            imagePopover: [{ type: core.ViewChild, args: ['imagePopover',] }],
            videoPopover: [{ type: core.ViewChild, args: ['videoPopover',] }],
            fontSizePopover: [{ type: core.ViewChild, args: ['fontSizePopover',] }],
            colorPopover: [{ type: core.ViewChild, args: ['colorPopover',] }],
            execute: [{ type: core.Output }]
        };
        return NgxEditorToolbarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ColorPickerComponent = /** @class */ (function () {
        function ColorPickerComponent() {
        }
        ColorPickerComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-color-picker',
                        template: "<div class=color-wrapper>\n  <app-color-palette [hue]=\"hue\" (color)=\"color = $event\"></app-color-palette>\n  <app-color-slider (color)=\"hue=$event\" style=\"margin-left:16px\"></app-color-slider>\n</div>\n<div class=\"input-wrapper\">\n  <span class=\"text\">{{color}}</span>\n  <div class=\"color-div\" [ngStyle]=\"{'background-color': color || 'white'}\"></div>\n</div>\n",
                        styles: [":host{display:block;width:316px;padding:16px}.color-wrapper{display:flex;height:250px}.input-wrapper{margin-top:16px;display:flex;border-radius:1px;border:1px solid #dcdcdc;padding:8px;height:32px;justify-content:center}.color-div{width:32px;height:32px;border-radius:50%;border:1px solid #dcdcdc}.text{flex:1;font-family:Helvetica;line-height:32px}"]
                    }] }
        ];
        return ColorPickerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ColorPaletteComponent = /** @class */ (function () {
        function ColorPaletteComponent() {
            this.color = new core.EventEmitter(true);
            this.mousedown = false;
        }
        /**
         * @return {?}
         */
        ColorPaletteComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                this.draw();
            };
        /**
         * @return {?}
         */
        ColorPaletteComponent.prototype.draw = /**
         * @return {?}
         */
            function () {
                if (!this.ctx) {
                    this.ctx = this.canvas.nativeElement.getContext('2d');
                }
                /** @type {?} */
                var width = this.canvas.nativeElement.width;
                /** @type {?} */
                var height = this.canvas.nativeElement.height;
                this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
                this.ctx.fillRect(0, 0, width, height);
                /** @type {?} */
                var whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
                whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
                whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
                this.ctx.fillStyle = whiteGrad;
                this.ctx.fillRect(0, 0, width, height);
                /** @type {?} */
                var blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
                blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
                blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
                this.ctx.fillStyle = blackGrad;
                this.ctx.fillRect(0, 0, width, height);
                if (this.selectedPosition) {
                    this.ctx.strokeStyle = 'white';
                    this.ctx.fillStyle = 'white';
                    this.ctx.beginPath();
                    this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
                    this.ctx.lineWidth = 5;
                    this.ctx.stroke();
                }
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        ColorPaletteComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes['hue']) {
                    this.draw();
                    /** @type {?} */
                    var pos = this.selectedPosition;
                    if (pos) {
                        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
                    }
                }
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorPaletteComponent.prototype.onMouseUp = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                this.mousedown = false;
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorPaletteComponent.prototype.onMouseDown = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                this.mousedown = true;
                this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
                this.draw();
                this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorPaletteComponent.prototype.onMouseMove = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                if (this.mousedown) {
                    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
                    this.draw();
                    this.emitColor(evt.offsetX, evt.offsetY);
                }
            };
        /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        ColorPaletteComponent.prototype.emitColor = /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
            function (x, y) {
                /** @type {?} */
                var rgbaColor = this.getColorAtPosition(x, y);
                this.color.emit(rgbaColor);
            };
        /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        ColorPaletteComponent.prototype.getColorAtPosition = /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
            function (x, y) {
                /** @type {?} */
                var imageData = this.ctx.getImageData(x, y, 1, 1).data;
                return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            };
        ColorPaletteComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-color-palette',
                        template: "<canvas #canvas class=\"color-palette\" width=\"250\" height=\"250\" (mousedown)=\"onMouseDown($event)\" (mousemove)=\"onMouseMove($event)\">\n</canvas>\n",
                        styles: [".color-palette:hover{cursor:pointer}:host{width:250px;height:250px;display:block}"]
                    }] }
        ];
        ColorPaletteComponent.propDecorators = {
            hue: [{ type: core.Input }],
            color: [{ type: core.Output }],
            canvas: [{ type: core.ViewChild, args: ['canvas',] }],
            onMouseUp: [{ type: core.HostListener, args: ['window:mouseup', ['$event'],] }]
        };
        return ColorPaletteComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ColorSliderComponent = /** @class */ (function () {
        function ColorSliderComponent() {
            this.color = new core.EventEmitter();
            this.mousedown = false;
        }
        /**
         * @return {?}
         */
        ColorSliderComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                this.draw();
            };
        /**
         * @return {?}
         */
        ColorSliderComponent.prototype.draw = /**
         * @return {?}
         */
            function () {
                if (!this.ctx) {
                    this.ctx = this.canvas.nativeElement.getContext('2d');
                }
                /** @type {?} */
                var width = this.canvas.nativeElement.width;
                /** @type {?} */
                var height = this.canvas.nativeElement.height;
                this.ctx.clearRect(0, 0, width, height);
                /** @type {?} */
                var gradient = this.ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
                gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
                gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
                gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
                gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
                gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
                this.ctx.beginPath();
                this.ctx.rect(0, 0, width, height);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                this.ctx.closePath();
                if (this.selectedHeight) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'white';
                    this.ctx.lineWidth = 5;
                    this.ctx.rect(0, this.selectedHeight - 5, width, 10);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorSliderComponent.prototype.onMouseUp = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                this.mousedown = false;
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorSliderComponent.prototype.onMouseDown = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                this.mousedown = true;
                this.selectedHeight = evt.offsetY;
                this.draw();
                this.emitColor(evt.offsetX, evt.offsetY);
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        ColorSliderComponent.prototype.onMouseMove = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                if (this.mousedown) {
                    this.selectedHeight = evt.offsetY;
                    this.draw();
                    this.emitColor(evt.offsetX, evt.offsetY);
                }
            };
        /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        ColorSliderComponent.prototype.emitColor = /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
            function (x, y) {
                /** @type {?} */
                var rgbaColor = this.getColorAtPosition(x, y);
                this.color.emit(rgbaColor);
            };
        /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        ColorSliderComponent.prototype.getColorAtPosition = /**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
            function (x, y) {
                /** @type {?} */
                var imageData = this.ctx.getImageData(x, y, 1, 1).data;
                return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            };
        ColorSliderComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-color-slider',
                        template: "<canvas #canvas class=\"color-slider\" width=\"50\" height=\"250\" (mousedown)=\"onMouseDown($event)\" (mousemove)=\"onMouseMove($event)\">\n</canvas>\n",
                        styles: [".color-slider:hover{cursor:pointer}"]
                    }] }
        ];
        ColorSliderComponent.propDecorators = {
            canvas: [{ type: core.ViewChild, args: ['canvas',] }],
            color: [{ type: core.Output }],
            onMouseUp: [{ type: core.HostListener, args: ['window:mouseup', ['$event'],] }]
        };
        return ColorSliderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ColorPickerModule = /** @class */ (function () {
        function ColorPickerModule() {
        }
        ColorPickerModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        exports: [ColorPickerComponent],
                        declarations: [ColorPickerComponent, ColorPaletteComponent, ColorSliderComponent]
                    },] }
        ];
        return ColorPickerModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorModule = /** @class */ (function () {
        function NgxEditorModule() {
        }
        NgxEditorModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule, ngxBootstrap.PopoverModule.forRoot(), ColorPickerModule],
                        declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                        exports: [NgxEditorComponent],
                        providers: [CommandExecutorService, MessageService]
                    },] }
        ];
        return NgxEditorModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @param {?} maxlength
     * @param {?=} options
     * @return {?}
     */
    function MaxLengthValidator(maxlength, options) {
        return function (control) {
            /** @type {?} */
            var parsedDocument = new DOMParser().parseFromString(control.value, 'text/html');
            /** @type {?} */
            var innerText = parsedDocument.body.innerText || '';
            // replace all linebreaks
            if (options.excludeLineBreaks) {
                innerText = innerText.replace(/(\r\n\t|\n|\r\t)/gm, '');
            }
            // concat multiple whitespaces into a single whitespace
            if (options.concatWhiteSpaces) {
                innerText = innerText.replace(/(\s\s+)/gm, ' ');
            }
            // remove all whitespaces
            if (options.excludeWhiteSpaces) {
                innerText = innerText.replace(/(\s)/gm, '');
            }
            if (innerText.length > maxlength) {
                return {
                    ngxEditor: {
                        allowedLength: maxlength,
                        textLength: innerText.length
                    }
                };
            }
            return null;
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgxEditorModule = NgxEditorModule;
    exports.MaxLengthValidator = MaxLengthValidator;
    exports.ɵc = ColorPaletteComponent;
    exports.ɵb = ColorPickerComponent;
    exports.ɵa = ColorPickerModule;
    exports.ɵd = ColorSliderComponent;
    exports.ɵg = CommandExecutorService;
    exports.ɵf = MessageService;
    exports.ɵi = NgxEditorMessageComponent;
    exports.ɵj = NgxEditorToolbarComponent;
    exports.ɵe = NgxEditorComponent;
    exports.ɵh = NgxGrippieComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZS50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9uZ3gtZWRpdG9yLmRlZmF1bHRzLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL2NvbG9yLXBpY2tlci9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9jb2xvci1waWNrZXIvY29sb3Itc2xpZGVyL2NvbG9yLXNsaWRlci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IubW9kdWxlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL3ZhbGlkYXRvcnMvbWF4bGVuZ3RoLXZhbGlkYXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGVuYWJsZSBvciBkaXNhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0b29sYmFyIGl0ZW1cbiAqIEBwYXJhbSB0b29sYmFyIHRvb2xiYXIgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlOiBzdHJpbmcsIHRvb2xiYXI6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAodG9vbGJhclsnbGVuZ3RoJ10gPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHRvb2xiYXIuZmlsdGVyKGFycmF5ID0+IHtcbiAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBzZXQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgY29uZmlndXJhdGlvbiB2aWEgW2NvbmZpZ10gcHJvcGVydHlcbiAqIEBwYXJhbSBuZ3hFZGl0b3JDb25maWcgZGVmYXVsdCBlZGl0b3IgY29uZmlndXJhdGlvblxuICogQHBhcmFtIGlucHV0IGRpcmVjdCBjb25maWd1cmF0aW9uIGlucHV0cyB2aWEgZGlyZWN0aXZlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih2YWx1ZTogYW55LCBuZ3hFZGl0b3JDb25maWc6IGFueSwgaW5wdXQ6IGFueSk6IGFueSB7XG4gIGZvciAoY29uc3QgaSBpbiBuZ3hFZGl0b3JDb25maWcpIHtcbiAgICBpZiAoaSkge1xuICAgICAgaWYgKGlucHV0W2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVbaV0gPSBpbnB1dFtpXTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsdWUuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgdmFsdWVbaV0gPSBuZ3hFZGl0b3JDb25maWdbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIHJldHVybiB2ZXJ0aWNhbCBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcmVzaXplciBwcm9wZXJ0eSBpcyBzZXQgdG8gYmFzaWNcbiAqXG4gKiBAcGFyYW0gcmVzaXplciB0eXBlIG9mIHJlc2l6ZXIsIGVpdGhlciBiYXNpYyBvciBzdGFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVzaXplKHJlc2l6ZXI6IHN0cmluZyk6IGFueSB7XG4gIGlmIChyZXNpemVyID09PSAnYmFzaWMnKSB7XG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNhdmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZWxlY3Rpb24oKTogYW55IHtcbiAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICByZXR1cm4gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiBkb2N1bWVudC5jcmVhdGVSYW5nZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIHJlc3RvcmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBpblxuICpcbiAqIEBwYXJhbSByYW5nZSBzYXZlZCBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZVNlbGVjdGlvbihyYW5nZSk6IGJvb2xlYW4ge1xuICBpZiAocmFuZ2UpIHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIHJhbmdlLnNlbGVjdCkge1xuICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB7XG4gIC8qKiBzYXZlcyB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGVkaXRvciB3aGVuIGZvY3Vzc2VkIG91dCAqL1xuICBzYXZlZFNlbGVjdGlvbjogYW55ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gX2h0dHAgSFRUUCBDbGllbnQgZm9yIG1ha2luZyBodHRwIHJlcXVlc3RzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICAvKipcbiAgICogZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNhdmVkU2VsZWN0aW9uICYmIGNvbW1hbmQgIT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIEVkaXRvcicpO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2Jsb2NrcXVvdGUnKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ3JlbW92ZUJsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQsIGZhbHNlLCBudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIGltYWdlVVJJIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAgICovXG4gIGluc2VydEltYWdlKGltYWdlVVJJOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKGltYWdlVVJJKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgY29uc3QgaW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SW1hZ2UnLCBmYWxzZSwgaW1hZ2VVUkkpO1xuICAgICAgICAgIGlmICghaW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBVUkwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICpcbiAqIEBwYXJhbSB2aWRlUGFyYW1zIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAqL1xuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKHZpZGVQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1lvdXR1YmVMaW5rKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICsgJ3NyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoeW91dHViZVVSTCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkVVJMKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgICArICcgY29udHJvbHM9XCJ0cnVlXCI+PHNvdXJjZSBzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L3ZpZGVvPic7XG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh2aWRlb1NyYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmlkZW8gVVJMJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gaW5zZXJ0IHZpZGVvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyB0aGUgaW5wdXQgdXJsIGlzIGEgdmFsaWQgeW91dHViZSBVUkwgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBpc1lvdXR1YmVMaW5rKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcbiAgICByZXR1cm4geXRSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBpcyBhIHZhbGlkIHVybCBvciBub3RcbiAgICogQHBhcmFtIHVybCB1cmxcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZFVSTCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcbiAgICByZXR1cm4gdXJsUmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGxvYWRzIGltYWdlIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHBhcmFtIGZpbGUgZmlsZSB0aGF0IGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKiBAcGFyYW0gZW5kUG9pbnQgZW5wb2ludCB0byB3aGljaCB0aGUgaW1hZ2UgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqL1xuICB1cGxvYWRJbWFnZShmaWxlOiBGaWxlLCBlbmRQb2ludDogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIWVuZFBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltYWdlIEVuZHBvaW50IGlzbmB0IHByb3ZpZGVkIG9yIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGlmIChmaWxlKSB7XG5cbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG4gICAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBlbmRQb2ludCwgZm9ybURhdGEsIHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgcGFyYW1ldGVycyB0aGF0IGhvbGRzIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpbmtcbiAgICovXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgLyoqXG4gICAgICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzYXZlZCBzZWxlY3Rpb24gY29udGFpbnMgYSByYW5nZSBvciBwbGFpbiBzZWxlY3Rpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHBhcmFtcy51cmxOZXdUYWIpIHtcbiAgICAgICAgY29uc3QgbmV3VXJsID0gJzxhIGhyZWY9XCInICsgcGFyYW1zLnVybExpbmsgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIHBhcmFtcy51cmxUZXh0ICsgJzwvYT4nO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS50eXBlICE9PSAnUmFuZ2UnKSB7XG4gICAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKG5ld1VybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBuZXcgbGlua3MgY2FuIGJlIGluc2VydGVkLiBZb3UgY2Fubm90IGVkaXQgVVJMYHMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCBwYXJhbXMudXJsTGluayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0IGNvbG9yIGVpdGhlciBmb250IG9yIGJhY2tncm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNvbG9yIGNvbG9yIHRvIGJlIGluc2VydGVkXG4gICAqIEBwYXJhbSB3aGVyZSB3aGVyZSB0aGUgY29sb3IgaGFzIHRvIGJlIGluc2VydGVkIGVpdGhlciB0ZXh0L2JhY2tncm91bmRcbiAgICovXG4gIGluc2VydENvbG9yKGNvbG9yOiBzdHJpbmcsIHdoZXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgaWYgKHJlc3RvcmVkICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgICBpZiAod2hlcmUgPT09ICd0ZXh0Q29sb3InKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2hpbGl0ZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tlaW5lIFRleHRzdGVsbGUgYXVzZ2V3w4PCpGhsdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBzaXplIGZvciB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSBmb250U2l6ZSBmb250LXNpemUgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250U2l6ZShmb250U2l6ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnRTaXplKSkge1xuICAgICAgICAgICAgY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250UHgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250UHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tlaW5lIFRleHRzdGVsbGUgYXVzZ2V3w4PCpGhsdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBuYW1lL2ZhbWlseSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udE5hbWUgZm9udC1mYW1pbHkgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnROYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9ICc8c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnICsgZm9udE5hbWUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250RmFtaWx5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9ICc8c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnICsgZm9udE5hbWUgKyAnO1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIGluc2VydCBIVE1MICovXG4gIHByaXZhdGUgaW5zZXJ0SHRtbChodG1sOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpc0hUTUxJbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRIVE1MJywgZmFsc2UsIGh0bWwpO1xuXG4gICAgaWYgKCFpc0hUTUxJbnNlcnRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcGVyZm9ybSB0aGUgb3BlcmF0aW9uJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHZhbHVlIGlzIGEgbnVtYmVyIG9yIHN0cmluZ1xuICAgKiBpZiBudW1iZXIgcmV0dXJuIHRydWVcbiAgICogZWxzZSByZXR1cm4gZmFsc2VcbiAgICovXG4gIHByaXZhdGUgaXNOdW1lcmljKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gL14tezAsMX1cXGQrJC8udGVzdCh2YWx1ZSk7XG4gIH1cblxuICAvKiogZGVsZXRlIHRoZSB0ZXh0IGF0IHNlbGVjdGVkIHJhbmdlIGFuZCByZXR1cm4gdGhlIHZhbHVlICovXG4gIHByaXZhdGUgZGVsZXRlQW5kR2V0RWxlbWVudCgpOiBhbnkge1xuICAgIGxldCBzbGVjdGVkVGV4dDtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuc2F2ZWRTZWxlY3Rpb24uZGVsZXRlQ29udGVudHMoKTtcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogY2hlY2sgYW55IHNsZWN0aW9uIGlzIG1hZGUgb3Igbm90ICovXG4gIHByaXZhdGUgY2hlY2tTZWxlY3Rpb24oKTogYW55IHtcbiAgICBjb25zdCBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcblxuICAgIGlmIChzbGVjdGVkVGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gU2VsZWN0aW9uIE1hZGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB0YWcgaXMgc3VwcG9ydGVkIGJ5IGJyb3dzZXIgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB0YWcgSFRNTCB0YWdcbiAgICovXG4gIHByaXZhdGUgY2hlY2tUYWdTdXBwb3J0SW5Ccm93c2VyKHRhZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cblxuLyoqIHRpbWUgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWQgKi9cbmNvbnN0IERVUkFUSU9OID0gNzAwMDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgLyoqIHZhcmlhYmxlIHRvIGhvbGQgdGhlIHVzZXIgbWVzc2FnZSAqL1xuICBwcml2YXRlIG1lc3NhZ2U6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKiogcmV0dXJucyB0aGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBlZGl0b3IgKi9cbiAgZ2V0TWVzc2FnZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZHMgbWVzc2FnZSB0byB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIG1lc3NhZ2UgdG8gYmUgc2VudFxuICAgKi9cbiAgc2VuZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlLm5leHQobWVzc2FnZSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VJbihEVVJBVElPTik7XG4gIH1cblxuICAvKipcbiAgICogYSBzaG9ydCBpbnRlcnZhbCB0byBjbGVhciBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHMgdGltZSBpbiBzZWNvbmRzIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkXG4gICAqL1xuICBwcml2YXRlIGNsZWFyTWVzc2FnZUluKG1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2UubmV4dCh1bmRlZmluZWQpO1xuICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gIH1cbn1cbiIsIi8qKlxuICogdG9vbGJhciBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IG5neEVkaXRvckNvbmZpZyA9IHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIHNwZWxsY2hlY2s6IHRydWUsXG4gIGhlaWdodDogJ2F1dG8nLFxuICBtaW5IZWlnaHQ6ICcwJyxcbiAgd2lkdGg6ICdhdXRvJyxcbiAgbWluV2lkdGg6ICcwJyxcbiAgdHJhbnNsYXRlOiAneWVzJyxcbiAgZW5hYmxlVG9vbGJhcjogdHJ1ZSxcbiAgc2hvd1Rvb2xiYXI6IHRydWUsXG4gIHBsYWNlaG9sZGVyOiAnRW50ZXIgdGV4dCBoZXJlLi4uJyxcbiAgaW1hZ2VFbmRQb2ludDogJycsXG4gIHRvb2xiYXI6IFtcbiAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1cGVyc2NyaXB0JywgJ3N1YnNjcmlwdCddLFxuICAgIFsnZm9udE5hbWUnLCAnZm9udFNpemUnLCAnY29sb3InXSxcbiAgICBbJ2p1c3RpZnlMZWZ0JywgJ2p1c3RpZnlDZW50ZXInLCAnanVzdGlmeVJpZ2h0JywgJ2p1c3RpZnlGdWxsJywgJ2luZGVudCcsICdvdXRkZW50J10sXG4gICAgWydjdXQnLCAnY29weScsICdkZWxldGUnLCAncmVtb3ZlRm9ybWF0JywgJ3VuZG8nLCAncmVkbyddLFxuICAgIFsncGFyYWdyYXBoJywgJ2Jsb2NrcXVvdGUnLCAncmVtb3ZlQmxvY2txdW90ZScsICdob3Jpem9udGFsTGluZScsICdvcmRlcmVkTGlzdCcsICd1bm9yZGVyZWRMaXN0J10sXG4gICAgWydsaW5rJywgJ3VubGluaycsICdpbWFnZScsICd2aWRlbyddXG4gIF1cbn07XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgVmlld0NoaWxkLFxuICBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgZm9yd2FyZFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5cbmltcG9ydCB7IG5neEVkaXRvckNvbmZpZyB9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hFZGl0b3JDb21wb25lbnQpLFxuICAgIG11bHRpOiB0cnVlXG4gIH1dXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKiBTcGVjaWZpZXMgd2VhdGhlciB0aGUgdGV4dGFyZWEgdG8gYmUgZWRpdGFibGUgb3Igbm90ICovXG4gIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xuICAvKiogVGhlIHNwZWxsY2hlY2sgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgdG8gaGF2ZSBpdHMgc3BlbGxpbmcgYW5kIGdyYW1tYXIgY2hlY2tlZCBvciBub3QuICovXG4gIEBJbnB1dCgpIHNwZWxsY2hlY2s6IGJvb2xlYW47XG4gIC8qKiBQbGFjZWhvbGRlciBmb3IgdGhlIHRleHRBcmVhICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgdHJhbnNsYXRlIHByb3BlcnR5IHNwZWNpZmllcyB3aGV0aGVyIHRoZSBjb250ZW50IG9mIGFuIGVsZW1lbnQgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgb3Igbm90LlxuICAgKlxuICAgKiBDaGVjayBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvYXR0X2dsb2JhbF90cmFuc2xhdGUuYXNwIGZvciBtb3JlIGluZm9ybWF0aW9uIGFuZCBicm93c2VyIHN1cHBvcnRcbiAgICovXG4gIEBJbnB1dCgpIHRyYW5zbGF0ZTogc3RyaW5nO1xuICAvKiogU2V0cyBoZWlnaHQgb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgbWluaW11bSBoZWlnaHQgZm9yIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluSGVpZ2h0OiBzdHJpbmc7XG4gIC8qKiBTZXRzIFdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcbiAgLyoqIFNldHMgbWluaW11bSB3aWR0aCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIG1pbldpZHRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUb29sYmFyIGFjY2VwdHMgYW4gYXJyYXkgd2hpY2ggc3BlY2lmaWVzIHRoZSBvcHRpb25zIHRvIGJlIGVuYWJsZWQgZm9yIHRoZSB0b29sYmFyXG4gICAqXG4gICAqIENoZWNrIG5neEVkaXRvckNvbmZpZyBmb3IgdG9vbGJhciBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIFBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgd2lsbCBlbmFibGUgYWxsIHRvb2xiYXJcbiAgICovXG4gIEBJbnB1dCgpIHRvb2xiYXI6IE9iamVjdDtcbiAgLyoqXG4gICAqIFRoZSBlZGl0b3IgY2FuIGJlIHJlc2l6ZWQgdmVydGljYWxseS5cbiAgICpcbiAgICogYGJhc2ljYCByZXNpemVyIGVuYWJsZXMgdGhlIGh0bWw1IHJlc3ppZXIuIENoZWNrIGhlcmUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS9jc3NyZWYvY3NzM19wcl9yZXNpemUuYXNwXG4gICAqXG4gICAqIGBzdGFja2AgcmVzaXplciBlbmFibGUgYSByZXNpemVyIHRoYXQgbG9va3MgbGlrZSBhcyBpZiBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tXG4gICAqL1xuICBASW5wdXQoKSByZXNpemVyID0gJ3N0YWNrJztcbiAgLyoqXG4gICAqIFRoZSBjb25maWcgcHJvcGVydHkgaXMgYSBKU09OIG9iamVjdFxuICAgKlxuICAgKiBBbGwgYXZhaWJhbGUgaW5wdXRzIGlucHV0cyBjYW4gYmUgcHJvdmlkZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gYXMgSlNPTlxuICAgKiBpbnB1dHMgcHJvdmlkZWQgZGlyZWN0bHkgYXJlIGNvbnNpZGVyZWQgYXMgdG9wIHByaW9yaXR5XG4gICAqL1xuICBASW5wdXQoKSBjb25maWcgPSBuZ3hFZGl0b3JDb25maWc7XG4gIC8qKiBXZWF0aGVyIHRvIHNob3cgb3IgaGlkZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuO1xuICAvKiogV2VhdGhlciB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgdG9vbGJhciAqL1xuICBASW5wdXQoKSBlbmFibGVUb29sYmFyOiBib29sZWFuO1xuICAvKiogRW5kcG9pbnQgZm9yIHdoaWNoIHRoZSBpbWFnZSB0byBiZSB1cGxvYWRlZCAqL1xuICBASW5wdXQoKSBpbWFnZUVuZFBvaW50OiBzdHJpbmc7XG5cbiAgLyoqIGVtaXRzIGBibHVyYCBldmVudCB3aGVuIGZvY3VzZWQgb3V0IGZyb20gdGhlIHRleHRhcmVhICovXG4gIEBPdXRwdXQoKSBibHVyOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICAvKiogZW1pdHMgYGZvY3VzYCBldmVudCB3aGVuIGZvY3VzZWQgaW4gdG8gdGhlIHRleHRhcmVhICovXG4gIEBPdXRwdXQoKSBmb2N1czogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBAVmlld0NoaWxkKCduZ3hUZXh0QXJlYScpIHRleHRBcmVhOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ25neFdyYXBwZXInKSBuZ3hXcmFwcGVyOiBhbnk7XG5cbiAgVXRpbHM6IGFueSA9IFV0aWxzO1xuXG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQHBhcmFtIF9tZXNzYWdlU2VydmljZSBzZXJ2aWNlIHRvIHNlbmQgbWVzc2FnZSB0byB0aGUgZWRpdG9yIG1lc3NhZ2UgY29tcG9uZW50XG4gICAqIEBwYXJhbSBfY29tbWFuZEV4ZWN1dG9yIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxuICAgKiBAcGFyYW0gX3JlbmRlcmVyIGFjY2VzcyBhbmQgbWFuaXB1bGF0ZSB0aGUgZG9tIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcbiAgICBwcml2YXRlIF9jb21tYW5kRXhlY3V0b3I6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikgeyB9XG5cbiAgLyoqXG4gICAqIGV2ZW50c1xuICAgKi9cbiAgb25UZXh0QXJlYUZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuZm9jdXMuZW1pdCgnZm9jdXMnKTtcbiAgfVxuXG4gIC8qKiBmb2N1cyB0aGUgdGV4dCBhcmVhIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCAqL1xuICBvbkVkaXRvckZvY3VzKCkge1xuICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIGZyb20gdGhlIGNvbnRlbnRlZGl0YWJsZSBzZWN0aW9uIHdoaWxlIHRoZSBpbnB1dCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAqIEBwYXJhbSBodG1sIGh0bWwgc3RyaW5nIGZyb20gY29udGVudGVkaXRhYmxlXG4gICAqL1xuICBvbkNvbnRlbnRDaGFuZ2UoaW5uZXJIVE1MOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UoaW5uZXJIVE1MKTtcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoaW5uZXJIVE1MKTtcbiAgICB9XG4gIH1cblxuICBvblRleHRBcmVhQmx1cigpOiB2b2lkIHtcbiAgICAvKiogc2F2ZSBzZWxlY3Rpb24gaWYgZm9jdXNzZWQgb3V0ICovXG4gICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLnNhdmVkU2VsZWN0aW9uID0gVXRpbHMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uVG91Y2hlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gICAgdGhpcy5ibHVyLmVtaXQoJ2JsdXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXNpemluZyB0ZXh0IGFyZWFcbiAgICpcbiAgICogQHBhcmFtIG9mZnNldFkgdmVydGljYWwgaGVpZ2h0IG9mIHRoZSBlaWR0YWJsZSBwb3J0aW9uIG9mIHRoZSBlZGl0b3JcbiAgICovXG4gIHJlc2l6ZVRleHRBcmVhKG9mZnNldFk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBuZXdIZWlnaHQgPSBwYXJzZUludCh0aGlzLmhlaWdodCwgMTApO1xuICAgIG5ld0hlaWdodCArPSBvZmZzZXRZO1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogZWRpdG9yIGFjdGlvbnMsIGkuZS4sIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0b29sYmFyXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kTmFtZSBuYW1lIG9mIHRoZSBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXG4gICAqL1xuICBleGVjdXRlQ29tbWFuZChjb21tYW5kTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvci5leGVjdXRlKGNvbW1hbmROYW1lKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgdmFsdWUgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGVyZSBpcyBhIGNoYW5nZSBpbiBjb250ZW50ZWRpdGFibGVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIodmFsdWUpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnPGJyPicpIHtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlZnJlc2hWaWV3KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICAgKiB3aGVuIHRoZSBjb250cm9sIHJlY2VpdmVzIGEgY2hhbmdlIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSB0b3VjaCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIGZuIGEgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlZnJlc2ggdmlldy9IVE1MIG9mIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIGh0bWwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxuICAgKi9cbiAgcmVmcmVzaFZpZXcodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlID09PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCBub3JtYWxpemVkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvZ2dsZXMgcGxhY2Vob2xkZXIgYmFzZWQgb24gaW5wdXQgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBIEhUTUwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxuICAgKi9cbiAgdG9nZ2xlUGxhY2Vob2xkZXIodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09ICc8YnI+JyB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMubmd4V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2hvdy1wbGFjZWhvbGRlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIGpzb24gY29udGFpbmluZyBpbnB1dCBwYXJhbXNcbiAgICovXG4gIGdldENvbGxlY3RpdmVQYXJhbXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGFibGU6IHRoaXMuZWRpdGFibGUsXG4gICAgICBzcGVsbGNoZWNrOiB0aGlzLnNwZWxsY2hlY2ssXG4gICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlcixcbiAgICAgIHRyYW5zbGF0ZTogdGhpcy50cmFuc2xhdGUsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWluSGVpZ2h0OiB0aGlzLm1pbkhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgbWluV2lkdGg6IHRoaXMubWluV2lkdGgsXG4gICAgICBlbmFibGVUb29sYmFyOiB0aGlzLmVuYWJsZVRvb2xiYXIsXG4gICAgICBzaG93VG9vbGJhcjogdGhpcy5zaG93VG9vbGJhcixcbiAgICAgIGltYWdlRW5kUG9pbnQ6IHRoaXMuaW1hZ2VFbmRQb2ludCxcbiAgICAgIHRvb2xiYXI6IHRoaXMudG9vbGJhclxuICAgIH07XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBzZXQgY29uZmlndWFydGlvblxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnID0gdGhpcy5VdGlscy5nZXRFZGl0b3JDb25maWd1cmF0aW9uKHRoaXMuY29uZmlnLCBuZ3hFZGl0b3JDb25maWcsIHRoaXMuZ2V0Q29sbGVjdGl2ZVBhcmFtcygpKTtcblxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZ3JpcHBpZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcbiAgLyoqIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIGhlaWdodDogbnVtYmVyO1xuICAvKiogcHJldmlvdXMgdmFsdWUgYmVmb3IgcmVzaXppbmcgdGhlIGVkaXRvciAqL1xuICBvbGRZID0gMDtcbiAgLyoqIHNldCB0byB0cnVlIG9uIG1vdXNlZG93biBldmVudCAqL1xuICBncmFiYmVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBfZWRpdG9yQ29tcG9uZW50IEVkaXRvciBjb21wb25lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VkaXRvckNvbXBvbmVudDogTmd4RWRpdG9yQ29tcG9uZW50KSB7IH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IE1vdXNlZXZlbnRcbiAgICpcbiAgICogVXBkYXRlIHRoZSBoZWlnaHQgb2YgdGhlIGVkaXRvciB3aGVuIHRoZSBncmFiYmVyIGlzIGRyYWdnZWRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmdyYWJiZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9lZGl0b3JDb21wb25lbnQucmVzaXplVGV4dEFyZWEoZXZlbnQuY2xpZW50WSAtIHRoaXMub2xkWSk7XG4gICAgdGhpcy5vbGRZID0gZXZlbnQuY2xpZW50WTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBzZXQgdGhlIGdyYWJiZXIgdG8gZmFsc2Ugb24gbW91c2UgdXAgYWN0aW9uXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJywgWyckZXZlbnQnXSkgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5ncmFiYmVyID0gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKSBvblJlc2l6ZShldmVudDogTW91c2VFdmVudCwgcmVzaXplcj86IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5ncmFiYmVyID0gdHJ1ZTtcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yLW1lc3NhZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IHtcbiAgLyoqIHByb3BlcnR5IHRoYXQgaG9sZHMgdGhlIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3IgKi9cbiAgbmd4TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHBhcmFtIF9tZXNzYWdlU2VydmljZSBzZXJ2aWNlIHRvIHNlbmQgbWVzc2FnZSB0byB0aGUgZWRpdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcbiAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5nZXRNZXNzYWdlKCkuc3Vic2NyaWJlKChtZXNzYWdlOiBzdHJpbmcpID0+IHRoaXMubmd4TWVzc2FnZSA9IG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNsZWFycyBlZGl0b3IgbWVzc2FnZVxuICAgKi9cbiAgY2xlYXJNZXNzYWdlKCk6IHZvaWQge1xuICAgIHRoaXMubmd4TWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgUG9wb3ZlckNvbmZpZyB9IGZyb20gJ25neC1ib290c3RyYXAnO1xuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcbmltcG9ydCB7Q29sb3JQaWNrZXJDb21wb25lbnR9IGZyb20gJy4uLy4uL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItdG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbUG9wb3ZlckNvbmZpZ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IGxpbmsgZm9ybSAqL1xuICB1cmxGb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBpbWFnZSBmb3JtICovXG4gIGltYWdlRm9ybTogRm9ybUdyb3VwO1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgdmlkZW8gZm9ybSAqL1xuICB2aWRlb0Zvcm06IEZvcm1Hcm91cDtcbiAgLyoqIHNldCB0byBmYWxzZSB3aGVuIGltYWdlIGlzIGJlaW5nIHVwbG9hZGVkICovXG4gIHVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcbiAgLyoqIHVwbG9hZCBwZXJjZW50YWdlICovXG4gIHVwZGxvYWRQZXJjZW50YWdlID0gMDtcbiAgLyoqIHNldCB0byB0cnVlIHdoZW4gdGhlIGltYWdlIGlzIGJlaW5nIHVwbG9hZGVkICovXG4gIGlzVXBsb2FkaW5nID0gZmFsc2U7XG4gIC8qKiB3aGljaCB0YWIgdG8gYWN0aXZlIGZvciBjb2xvciBpbnNldGlvbiAqL1xuICBzZWxlY3RlZENvbG9yVGFiID0gJ3RleHRDb2xvcic7XG4gIC8qKiBmb250IGZhbWlseSBuYW1lICovXG4gIGZvbnROYW1lID0gJyc7XG4gIC8qKiBmb250IHNpemUgKi9cbiAgZm9udFNpemUgPSAnJztcbiAgLyoqIGhleCBjb2xvciBjb2RlICovXG4gIGhleENvbG9yID0gJyc7XG4gIC8qKiBzaG93L2hpZGUgaW1hZ2UgdXBsb2FkZXIgKi9cbiAgaXNJbWFnZVVwbG9hZGVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVkaXRvciBjb25maWd1cmF0aW9uXG4gICAqL1xuICBASW5wdXQoKSBjb25maWc6IGFueTtcbiAgQFZpZXdDaGlsZCgndXJsUG9wb3ZlcicpIHVybFBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2ltYWdlUG9wb3ZlcicpIGltYWdlUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgndmlkZW9Qb3BvdmVyJykgdmlkZW9Qb3BvdmVyO1xuICBAVmlld0NoaWxkKCdmb250U2l6ZVBvcG92ZXInKSBmb250U2l6ZVBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2NvbG9yUG9wb3ZlcicpIGNvbG9yUG9wb3ZlcjtcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gYSB0b29sYmFyIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAqL1xuICBAT3V0cHV0KCkgZXhlY3V0ZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wb3BPdmVyQ29uZmlnOiBQb3BvdmVyQ29uZmlnLFxuICAgIHByaXZhdGUgX2Zvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfY29tbWFuZEV4ZWN1dG9yU2VydmljZTogQ29tbWFuZEV4ZWN1dG9yU2VydmljZSkge1xuICAgIHRoaXMuX3BvcE92ZXJDb25maWcub3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLnBsYWNlbWVudCA9ICdib3R0b20nO1xuICAgIHRoaXMuX3BvcE92ZXJDb25maWcuY29udGFpbmVyID0gJ2JvZHknO1xuICB9XG5cbiAgLyoqXG4gICAqIGVuYWJsZSBvciBkaWFibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBuYW1lIG9mIHRoZSB0b29sYmFyIGJ1dHRvbnNcbiAgICovXG4gIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWxzLmNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlLCB0aGlzLmNvbmZpZ1sndG9vbGJhciddKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmlnZ2VycyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXIgdG8gYmUgZXhlY3V0ZWQgYW5kIGVtaXRzIGFuIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIHRyaWdnZXJDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZXhlY3V0ZS5lbWl0KGNvbW1hbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBVUkwgaW5zZXJ0IGZvcm1cbiAgICovXG4gIGJ1aWxkVXJsRm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLnVybEZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1cmxMaW5rOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxUZXh0OiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxOZXdUYWI6IFt0cnVlXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqL1xuICBpbnNlcnRMaW5rKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmNyZWF0ZUxpbmsodGhpcy51cmxGb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cbiAgICB0aGlzLnVybFBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBpbnNlcnQgaW1hZ2UgZm9ybVxuICAgKi9cbiAgYnVpbGRJbWFnZUZvcm0oKTogdm9pZCB7XG4gICAgdGhpcy5pbWFnZUZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBpbWFnZVVybDogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF1dXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZFZpZGVvRm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZGVvRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHZpZGVvVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICBoZWlnaHQ6IFsnJ10sXG4gICAgICB3aWR0aDogWycnXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxuICAgKlxuICAgKiBAcGFyYW0gZSBvbkNoYW5nZSBldmVudFxuICAgKi9cbiAgb25GaWxlQ2hhbmdlKGUpOiB2b2lkIHtcbiAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy5pc1VwbG9hZGluZyA9IHRydWU7XG5cbiAgICBpZiAoZS50YXJnZXQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnVwbG9hZEltYWdlKGZpbGUsIHRoaXMuY29uZmlnLmltYWdlRW5kUG9pbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG5cbiAgICAgICAgICBpZiAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgdGhpcy51cGRsb2FkUGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZShldmVudC5ib2R5LnVybCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0SW1hZ2UoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5pbWFnZUZvcm0udmFsdWUuaW1hZ2VVcmwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy5pbWFnZVBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXG4gIGluc2VydFZpZGVvKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydFZpZGVvKHRoaXMudmlkZW9Gb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudmlkZW9Qb3BvdmVyLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBpbnNlciB0ZXh0L2JhY2tncm91bmQgY29sb3IgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBsZXQgaGV4OiBhbnkgPSBjb2xvci5tYXRjaCgvXnJnYmE/W1xccytdP1xcKFtcXHMrXT8oXFxkKylbXFxzK10/LFtcXHMrXT8oXFxkKylbXFxzK10/LFtcXHMrXT8oXFxkKylbXFxzK10/L2kpO1xuICAgICAgaGV4ID0gIFwiI1wiICtcbiAgICAgICAgKFwiMFwiICsgcGFyc2VJbnQoaGV4WzFdLDEwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKSArXG4gICAgICAgIChcIjBcIiArIHBhcnNlSW50KGhleFsyXSwxMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMikgK1xuICAgICAgICAoXCIwXCIgKyBwYXJzZUludChoZXhbM10sMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRDb2xvcihoZXgsIHdoZXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIHNldCBmb250IHNpemUgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnRTaXplKGZvbnRTaXplKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIHNldCBmb250IE5hbWUvZmFtaWx5ICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5zZXRGb250TmFtZShmb250TmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1jb2xvci1waWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vY29sb3ItcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY29sb3ItcGlja2VyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlckNvbXBvbmVudCB7XG4gIHB1YmxpYyBodWU6IHN0cmluZztcbiAgcHVibGljIGNvbG9yOiBzdHJpbmc7XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtY29sb3ItcGFsZXR0ZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JQYWxldHRlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KClcbiAgaHVlOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpXG4gIGNvbG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG5cbiAgQFZpZXdDaGlsZCgnY2FudmFzJylcbiAgY2FudmFzOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHByaXZhdGUgbW91c2Vkb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHNlbGVjdGVkUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmh1ZSB8fCAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XG4gICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCB3aGl0ZUdyYWQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCB3aWR0aCwgMCk7XG4gICAgd2hpdGVHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwxKScpO1xuICAgIHdoaXRlR3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHdoaXRlR3JhZDtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IGJsYWNrR3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGhlaWdodCk7XG4gICAgYmxhY2tHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLDAsMCwwKScpO1xuICAgIGJsYWNrR3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMSknKTtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJsYWNrR3JhZDtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9zaXRpb24pIHtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgIHRoaXMuY3R4LmFyYyh0aGlzLnNlbGVjdGVkUG9zaXRpb24ueCwgdGhpcy5zZWxlY3RlZFBvc2l0aW9uLnksIDEwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydodWUnXSkge1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICBjb25zdCBwb3MgPSB0aGlzLnNlbGVjdGVkUG9zaXRpb247XG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHRoaXMuY29sb3IuZW1pdCh0aGlzLmdldENvbG9yQXRQb3NpdGlvbihwb3MueCwgcG9zLnkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6bW91c2V1cCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VVcChldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IGZhbHNlO1xuICB9XG5cbiAgb25Nb3VzZURvd24oZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZWRvd24gPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0ZWRQb3NpdGlvbiA9IHsgeDogZXZ0Lm9mZnNldFgsIHk6IGV2dC5vZmZzZXRZIH07XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgdGhpcy5jb2xvci5lbWl0KHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSkpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW91c2Vkb3duKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkUG9zaXRpb24gPSB7IHg6IGV2dC5vZmZzZXRYLCB5OiBldnQub2Zmc2V0WSB9O1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB0aGlzLmVtaXRDb2xvcihldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXRDb2xvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IHJnYmFDb2xvciA9IHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHgsIHkpO1xuICAgIHRoaXMuY29sb3IuZW1pdChyZ2JhQ29sb3IpO1xuICB9XG5cbiAgZ2V0Q29sb3JBdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpLmRhdGE7XG4gICAgcmV0dXJuICdyZ2JhKCcgKyBpbWFnZURhdGFbMF0gKyAnLCcgKyBpbWFnZURhdGFbMV0gKyAnLCcgKyBpbWFnZURhdGFbMl0gKyAnLDEpJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWNvbG9yLXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2xvci1zbGlkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1zbGlkZXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ2NhbnZhcycpXG4gIGNhbnZhczogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XG5cbiAgQE91dHB1dCgpXG4gIGNvbG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIG1vdXNlZG93bjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHNlbGVjdGVkSGVpZ2h0OiBudW1iZXI7XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJhdygpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAoIXRoaXMuY3R4KSB7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0O1xuXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBoZWlnaHQpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsIDAsIDAsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMTcsICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjM0LCAncmdiYSgwLCAyNTUsIDAsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTEsICdyZ2JhKDAsIDI1NSwgMjU1LCAxKScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjY4LCAncmdiYSgwLCAwLCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuODUsICdyZ2JhKDI1NSwgMCwgMjU1LCAxKScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsIDAsIDAsIDEpJyk7XG5cbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5yZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRIZWlnaHQpIHtcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgIHRoaXMuY3R4LnJlY3QoMCwgdGhpcy5zZWxlY3RlZEhlaWdodCAtIDUsIHdpZHRoLCAxMCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVVwKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gZmFsc2U7XG4gIH1cblxuICBvbk1vdXNlRG93bihldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZEhlaWdodCA9IGV2dC5vZmZzZXRZO1xuICAgIHRoaXMuZHJhdygpO1xuICAgIHRoaXMuZW1pdENvbG9yKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3VzZWRvd24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRIZWlnaHQgPSBldnQub2Zmc2V0WTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgdGhpcy5lbWl0Q29sb3IoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcbiAgICB9XG4gIH1cblxuICBlbWl0Q29sb3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBjb25zdCByZ2JhQ29sb3IgPSB0aGlzLmdldENvbG9yQXRQb3NpdGlvbih4LCB5KTtcbiAgICB0aGlzLmNvbG9yLmVtaXQocmdiYUNvbG9yKTtcbiAgfVxuXG4gIGdldENvbG9yQXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSh4LCB5LCAxLCAxKS5kYXRhO1xuICAgIHJldHVybiAncmdiYSgnICsgaW1hZ2VEYXRhWzBdICsgJywnICsgaW1hZ2VEYXRhWzFdICsgJywnICsgaW1hZ2VEYXRhWzJdICsgJywxKSc7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29sb3JQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29sb3JQYWxldHRlQ29tcG9uZW50IH0gZnJvbSAnLi9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50JztcbmltcG9ydCB7IENvbG9yU2xpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb2xvci1zbGlkZXIvY29sb3Itc2xpZGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW0NvbG9yUGlja2VyQ29tcG9uZW50IF0sXG4gIGRlY2xhcmF0aW9uczogW0NvbG9yUGlja2VyQ29tcG9uZW50LCBDb2xvclBhbGV0dGVDb21wb25lbnQsIENvbG9yU2xpZGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlck1vZHVsZSB7IH1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUG9wb3Zlck1vZHVsZSB9IGZyb20gJ25neC1ib290c3RyYXAnO1xuaW1wb3J0IHsgTmd4RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHcmlwcGllQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ3JpcHBpZS9uZ3gtZ3JpcHBpZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci1tZXNzYWdlL25neC1lZGl0b3ItbWVzc2FnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci10b29sYmFyL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQge0NvbG9yUGlja2VyTW9kdWxlfSBmcm9tICcuLi9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLm1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBQb3BvdmVyTW9kdWxlLmZvclJvb3QoKSwgQ29sb3JQaWNrZXJNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hFZGl0b3JDb21wb25lbnQsIE5neEdyaXBwaWVDb21wb25lbnQsIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQsIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmd4RWRpdG9yQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbQ29tbWFuZEV4ZWN1dG9yU2VydmljZSwgTWVzc2FnZVNlcnZpY2VdXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yTW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbnRlcmZhY2UgSU1heExlbmd0aFZhbGlkYXRvck9wdGlvbnMge1xuICBleGNsdWRlTGluZUJyZWFrcz86IGJvb2xlYW47XG4gIGNvbmNhdFdoaXRlU3BhY2VzPzogYm9vbGVhbjtcbiAgZXhjbHVkZVdoaXRlU3BhY2VzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE1heExlbmd0aFZhbGlkYXRvcihtYXhsZW5ndGg6IG51bWJlciwgb3B0aW9ucz86IElNYXhMZW5ndGhWYWxpZGF0b3JPcHRpb25zKSB7XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHBhcnNlZERvY3VtZW50ID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhjb250cm9sLnZhbHVlLCAndGV4dC9odG1sJyk7XG4gICAgbGV0IGlubmVyVGV4dCA9IHBhcnNlZERvY3VtZW50LmJvZHkuaW5uZXJUZXh0IHx8ICcnO1xuXG4gICAgLy8gcmVwbGFjZSBhbGwgbGluZWJyZWFrc1xuICAgIGlmIChvcHRpb25zLmV4Y2x1ZGVMaW5lQnJlYWtzKSB7XG4gICAgICBpbm5lclRleHQgPSBpbm5lclRleHQucmVwbGFjZSgvKFxcclxcblxcdHxcXG58XFxyXFx0KS9nbSwgJycpO1xuICAgIH1cblxuICAgIC8vIGNvbmNhdCBtdWx0aXBsZSB3aGl0ZXNwYWNlcyBpbnRvIGEgc2luZ2xlIHdoaXRlc3BhY2VcbiAgICBpZiAob3B0aW9ucy5jb25jYXRXaGl0ZVNwYWNlcykge1xuICAgICAgaW5uZXJUZXh0ID0gaW5uZXJUZXh0LnJlcGxhY2UoLyhcXHNcXHMrKS9nbSwgJyAnKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYWxsIHdoaXRlc3BhY2VzXG4gICAgaWYgKG9wdGlvbnMuZXhjbHVkZVdoaXRlU3BhY2VzKSB7XG4gICAgICBpbm5lclRleHQgPSBpbm5lclRleHQucmVwbGFjZSgvKFxccykvZ20sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJUZXh0Lmxlbmd0aCA+IG1heGxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmd4RWRpdG9yOiB7XG4gICAgICAgICAgYWxsb3dlZExlbmd0aDogbWF4bGVuZ3RoLFxuICAgICAgICAgIHRleHRMZW5ndGg6IGlubmVyVGV4dC5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVXRpbHMucmVzdG9yZVNlbGVjdGlvbiIsIkh0dHBSZXF1ZXN0IiwiSW5qZWN0YWJsZSIsIkh0dHBDbGllbnQiLCJTdWJqZWN0IiwiRXZlbnRFbWl0dGVyIiwiVXRpbHMuc2F2ZVNlbGVjdGlvbiIsIkNvbXBvbmVudCIsIk5HX1ZBTFVFX0FDQ0VTU09SIiwiZm9yd2FyZFJlZiIsIlJlbmRlcmVyMiIsIklucHV0IiwiT3V0cHV0IiwiVmlld0NoaWxkIiwiSG9zdExpc3RlbmVyIiwiVXRpbHMuY2FuRW5hYmxlVG9vbGJhck9wdGlvbnMiLCJWYWxpZGF0b3JzIiwiSHR0cFJlc3BvbnNlIiwiUG9wb3ZlckNvbmZpZyIsIkZvcm1CdWlsZGVyIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJGb3Jtc01vZHVsZSIsIlJlYWN0aXZlRm9ybXNNb2R1bGUiLCJQb3BvdmVyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLHFDQUF3QyxLQUFhLEVBQUUsT0FBWTtRQUNqRSxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTTs7Z0JBQ0wsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEtBQUs7b0JBQ2hD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