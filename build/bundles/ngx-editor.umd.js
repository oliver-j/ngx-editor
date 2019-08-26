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
         * @param {?} size
         * @return {?}
         */
        CommandExecutorService.prototype.setFontSize2 = /**
         * @param {?} size
         * @return {?}
         */
            function (size) {
                if (this.savedSelection) {
                    /** @type {?} */
                    var restored = restoreSelection(this.savedSelection);
                    if (restored && this.checkSelection()) {
                        document.execCommand('fontSize', false, size);
                    }
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
                                var fontPx = "<span class=font-" + fontSize + "> " + deletedValue + " </span>";
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
                    throw new Error('Keine Textstelle ausgewählt');
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
        placeholder: 'Text hier einfügen...',
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
                        styles: [".font-small{font-size:.5em}.font-normal{font-size:1em}.font-big{font-size:2em}.ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}"]
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
            this.fontSizes = [
                { name: "Normal", val: "normal" },
                { name: "Klein", val: "small" },
                { name: "Groß", val: "big" }
            ];
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
            this.fontSize = this.fontSizes[0].val;
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
            this.fontSize = this.fontSizes[0].val;
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
                this.fontSize = this.fontSizes[0].val;
            };
        NgxEditorToolbarComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor-toolbar',
                        template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\" (click)=\"triggerCommand('bold')\"\n      title=\"Fett\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\" (click)=\"triggerCommand('italic')\"\n      title=\"Kursiv\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\" (click)=\"triggerCommand('underline')\"\n      title=\"Unterstrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\" (click)=\"triggerCommand('strikeThrough')\"\n      title=\"Durchgestrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\" (click)=\"triggerCommand('superscript')\"\n      title=\"Superskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\" (click)=\"triggerCommand('subscript')\"\n      title=\"Subskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n      title=\"Schriftart\" [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n      title=\"Schriftgr\u00F6\u00DFe\" [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n      title=\"Farbe\" [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\" (click)=\"triggerCommand('justifyLeft')\"\n      title=\"Linksb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\" (click)=\"triggerCommand('justifyCenter')\"\n      title=\"Zentriert\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\" (click)=\"triggerCommand('justifyRight')\"\n      title=\"Rechtsb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\" (click)=\"triggerCommand('justifyFull')\"\n      title=\"Blocksatz\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\" (click)=\"triggerCommand('indent')\"\n      title=\"Einr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\" (click)=\"triggerCommand('outdent')\"\n      title=\"Ausr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\" (click)=\"triggerCommand('cut')\"\n      title=\"Ausschneiden\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\" (click)=\"triggerCommand('copy')\"\n      title=\"Kopieren\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-files-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\" (click)=\"triggerCommand('delete')\"\n      title=\"L\u00F6schen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\" (click)=\"triggerCommand('removeFormat')\"\n      title=\"Formatierung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\" (click)=\"triggerCommand('undo')\"\n      title=\"R\u00FCckg\u00E4ngig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\" (click)=\"triggerCommand('redo')\"\n      title=\"Wiederholen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\" (click)=\"triggerCommand('insertParagraph')\"\n      title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\" (click)=\"triggerCommand('blockquote')\"\n      title=\"Blockzitat\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\" (click)=\"triggerCommand('removeBlockquote')\"\n      title=\"Blockzitat entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\" (click)=\"triggerCommand('insertHorizontalRule')\"\n      title=\"Horizontale Linie\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\" (click)=\"triggerCommand('insertUnorderedList')\"\n      title=\"Ungeordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\" (click)=\"triggerCommand('insertOrderedList')\"\n      title=\"Geordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n      [popover]=\"insertLinkTemplate\" title=\"Verlinkung einf\u00FCgen\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\" (click)=\"triggerCommand('unlink')\"\n      title=\"Verlinkung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n      title=\"Bild\" [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n      title=\"Video\" [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n          required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">In neuem Tab \u00F6ffnen</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fa fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"> </div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"> </div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Bild w\u00E4hlen</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Wird hochgeladen</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\" [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n              required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\" [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n          [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n            required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"H\u00F6he (px)\" pattern=\"[0-9]\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"Breite (px)\" pattern=\"[0-9]\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Textfarbe</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Hintergrundfarbe</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <app-color-picker #cpicker></app-color-picker>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(cpicker.color, selectedColorTab)\">OK</button>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n\n        <label for=\"fontSize\" class=\"small\">Schriftgr\u00F6\u00DFe</label>\n        <select [(ngModel)]=\"fontSize\" name=\"fontsize\">\n          <option *ngFor=\"let size of fontSizes\" [value]=\"size.val\">{{size.name}}</option>\n        </select>\n        <!--<input type=\"number\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Schriftgr\u00F6\u00DFe in Pixel\"\n          [(ngModel)]=\"fontSize\" required>-->\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Schriftart</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\" placeholder=\"Zum Beispiel: 'Times New Roman', Times, serif\"\n          [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n",
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZS50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9uZ3gtZWRpdG9yLmRlZmF1bHRzLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL2NvbG9yLXBpY2tlci9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9jb2xvci1waWNrZXIvY29sb3Itc2xpZGVyL2NvbG9yLXNsaWRlci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IubW9kdWxlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL3ZhbGlkYXRvcnMvbWF4bGVuZ3RoLXZhbGlkYXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGVuYWJsZSBvciBkaXNhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0b29sYmFyIGl0ZW1cbiAqIEBwYXJhbSB0b29sYmFyIHRvb2xiYXIgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlOiBzdHJpbmcsIHRvb2xiYXI6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAodG9vbGJhclsnbGVuZ3RoJ10gPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHRvb2xiYXIuZmlsdGVyKGFycmF5ID0+IHtcbiAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBzZXQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgY29uZmlndXJhdGlvbiB2aWEgW2NvbmZpZ10gcHJvcGVydHlcbiAqIEBwYXJhbSBuZ3hFZGl0b3JDb25maWcgZGVmYXVsdCBlZGl0b3IgY29uZmlndXJhdGlvblxuICogQHBhcmFtIGlucHV0IGRpcmVjdCBjb25maWd1cmF0aW9uIGlucHV0cyB2aWEgZGlyZWN0aXZlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih2YWx1ZTogYW55LCBuZ3hFZGl0b3JDb25maWc6IGFueSwgaW5wdXQ6IGFueSk6IGFueSB7XG4gIGZvciAoY29uc3QgaSBpbiBuZ3hFZGl0b3JDb25maWcpIHtcbiAgICBpZiAoaSkge1xuICAgICAgaWYgKGlucHV0W2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVbaV0gPSBpbnB1dFtpXTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsdWUuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgdmFsdWVbaV0gPSBuZ3hFZGl0b3JDb25maWdbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIHJldHVybiB2ZXJ0aWNhbCBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcmVzaXplciBwcm9wZXJ0eSBpcyBzZXQgdG8gYmFzaWNcbiAqXG4gKiBAcGFyYW0gcmVzaXplciB0eXBlIG9mIHJlc2l6ZXIsIGVpdGhlciBiYXNpYyBvciBzdGFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVzaXplKHJlc2l6ZXI6IHN0cmluZyk6IGFueSB7XG4gIGlmIChyZXNpemVyID09PSAnYmFzaWMnKSB7XG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNhdmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZWxlY3Rpb24oKTogYW55IHtcbiAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICByZXR1cm4gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiBkb2N1bWVudC5jcmVhdGVSYW5nZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIHJlc3RvcmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBpblxuICpcbiAqIEBwYXJhbSByYW5nZSBzYXZlZCBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZVNlbGVjdGlvbihyYW5nZSk6IGJvb2xlYW4ge1xuICBpZiAocmFuZ2UpIHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIHJhbmdlLnNlbGVjdCkge1xuICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB7XG4gIC8qKiBzYXZlcyB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGVkaXRvciB3aGVuIGZvY3Vzc2VkIG91dCAqL1xuICBzYXZlZFNlbGVjdGlvbjogYW55ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gX2h0dHAgSFRUUCBDbGllbnQgZm9yIG1ha2luZyBodHRwIHJlcXVlc3RzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICAvKipcbiAgICogZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNhdmVkU2VsZWN0aW9uICYmIGNvbW1hbmQgIT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIEVkaXRvcicpO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2Jsb2NrcXVvdGUnKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ3JlbW92ZUJsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQsIGZhbHNlLCBudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIGltYWdlVVJJIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAgICovXG4gIGluc2VydEltYWdlKGltYWdlVVJJOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKGltYWdlVVJJKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgY29uc3QgaW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SW1hZ2UnLCBmYWxzZSwgaW1hZ2VVUkkpO1xuICAgICAgICAgIGlmICghaW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBVUkwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICpcbiAqIEBwYXJhbSB2aWRlUGFyYW1zIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAqL1xuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKHZpZGVQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1lvdXR1YmVMaW5rKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICsgJ3NyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoeW91dHViZVVSTCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkVVJMKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgICArICcgY29udHJvbHM9XCJ0cnVlXCI+PHNvdXJjZSBzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L3ZpZGVvPic7XG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh2aWRlb1NyYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmlkZW8gVVJMJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gaW5zZXJ0IHZpZGVvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyB0aGUgaW5wdXQgdXJsIGlzIGEgdmFsaWQgeW91dHViZSBVUkwgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBpc1lvdXR1YmVMaW5rKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcbiAgICByZXR1cm4geXRSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBpcyBhIHZhbGlkIHVybCBvciBub3RcbiAgICogQHBhcmFtIHVybCB1cmxcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZFVSTCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcbiAgICByZXR1cm4gdXJsUmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGxvYWRzIGltYWdlIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHBhcmFtIGZpbGUgZmlsZSB0aGF0IGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKiBAcGFyYW0gZW5kUG9pbnQgZW5wb2ludCB0byB3aGljaCB0aGUgaW1hZ2UgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqL1xuICB1cGxvYWRJbWFnZShmaWxlOiBGaWxlLCBlbmRQb2ludDogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIWVuZFBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltYWdlIEVuZHBvaW50IGlzbmB0IHByb3ZpZGVkIG9yIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGlmIChmaWxlKSB7XG5cbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG4gICAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBlbmRQb2ludCwgZm9ybURhdGEsIHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgcGFyYW1ldGVycyB0aGF0IGhvbGRzIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpbmtcbiAgICovXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgLyoqXG4gICAgICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzYXZlZCBzZWxlY3Rpb24gY29udGFpbnMgYSByYW5nZSBvciBwbGFpbiBzZWxlY3Rpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHBhcmFtcy51cmxOZXdUYWIpIHtcbiAgICAgICAgY29uc3QgbmV3VXJsID0gJzxhIGhyZWY9XCInICsgcGFyYW1zLnVybExpbmsgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIHBhcmFtcy51cmxUZXh0ICsgJzwvYT4nO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS50eXBlICE9PSAnUmFuZ2UnKSB7XG4gICAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKG5ld1VybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBuZXcgbGlua3MgY2FuIGJlIGluc2VydGVkLiBZb3UgY2Fubm90IGVkaXQgVVJMYHMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCBwYXJhbXMudXJsTGluayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0IGNvbG9yIGVpdGhlciBmb250IG9yIGJhY2tncm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNvbG9yIGNvbG9yIHRvIGJlIGluc2VydGVkXG4gICAqIEBwYXJhbSB3aGVyZSB3aGVyZSB0aGUgY29sb3IgaGFzIHRvIGJlIGluc2VydGVkIGVpdGhlciB0ZXh0L2JhY2tncm91bmRcbiAgICovXG4gIGluc2VydENvbG9yKGNvbG9yOiBzdHJpbmcsIHdoZXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgaWYgKHJlc3RvcmVkICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgICBpZiAod2hlcmUgPT09ICd0ZXh0Q29sb3InKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2hpbGl0ZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tlaW5lIFRleHRzdGVsbGUgYXVzZ2V3w4PCpGhsdCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgc2V0Rm9udFNpemUyKHNpemU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICBpZiAocmVzdG9yZWQgJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb250U2l6ZScsIGZhbHNlLCBzaXplKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc2V0IGZvbnQgc2l6ZSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udFNpemUgZm9udC1zaXplIHRvIGJlIHNldFxuICAgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgZGVsZXRlZFZhbHVlID0gdGhpcy5kZWxldGVBbmRHZXRFbGVtZW50KCk7XG5cbiAgICAgIGlmIChkZWxldGVkVmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250U2l6ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJ3B4O1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udFB4KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAnO1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSBgPHNwYW4gY2xhc3M9Zm9udC0ke2ZvbnRTaXplfT4gJHtkZWxldGVkVmFsdWV9IDwvc3Bhbj5gO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCBmb250IG5hbWUvZmFtaWx5IGZvciB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSBmb250TmFtZSBmb250LWZhbWlseSB0byBiZSBzZXRcbiAgICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udE5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250RmFtaWx5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IEhUTUwgKi9cbiAgcHJpdmF0ZSBpbnNlcnRIdG1sKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGlzSFRNTEluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgaHRtbCk7XG5cbiAgICBpZiAoIWlzSFRNTEluc2VydGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb24nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgYSBudW1iZXIgb3Igc3RyaW5nXG4gICAqIGlmIG51bWJlciByZXR1cm4gdHJ1ZVxuICAgKiBlbHNlIHJldHVybiBmYWxzZVxuICAgKi9cbiAgcHJpdmF0ZSBpc051bWVyaWModmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXi17MCwxfVxcZCskLy50ZXN0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBkZWxldGUgdGhlIHRleHQgYXQgc2VsZWN0ZWQgcmFuZ2UgYW5kIHJldHVybiB0aGUgdmFsdWUgKi9cbiAgcHJpdmF0ZSBkZWxldGVBbmRHZXRFbGVtZW50KCk6IGFueSB7XG4gICAgbGV0IHNsZWN0ZWRUZXh0O1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuICAgICAgdGhpcy5zYXZlZFNlbGVjdGlvbi5kZWxldGVDb250ZW50cygpO1xuICAgICAgcmV0dXJuIHNsZWN0ZWRUZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBjaGVjayBhbnkgc2xlY3Rpb24gaXMgbWFkZSBvciBub3QgKi9cbiAgcHJpdmF0ZSBjaGVja1NlbGVjdGlvbigpOiBhbnkge1xuICAgIGNvbnN0IHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuXG4gICAgaWYgKHNsZWN0ZWRUZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB0YWcgaXMgc3VwcG9ydGVkIGJ5IGJyb3dzZXIgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB0YWcgSFRNTCB0YWdcbiAgICovXG4gIHByaXZhdGUgY2hlY2tUYWdTdXBwb3J0SW5Ccm93c2VyKHRhZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cblxuLyoqIHRpbWUgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWQgKi9cbmNvbnN0IERVUkFUSU9OID0gNzAwMDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgLyoqIHZhcmlhYmxlIHRvIGhvbGQgdGhlIHVzZXIgbWVzc2FnZSAqL1xuICBwcml2YXRlIG1lc3NhZ2U6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKiogcmV0dXJucyB0aGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBlZGl0b3IgKi9cbiAgZ2V0TWVzc2FnZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZHMgbWVzc2FnZSB0byB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIG1lc3NhZ2UgdG8gYmUgc2VudFxuICAgKi9cbiAgc2VuZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlLm5leHQobWVzc2FnZSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VJbihEVVJBVElPTik7XG4gIH1cblxuICAvKipcbiAgICogYSBzaG9ydCBpbnRlcnZhbCB0byBjbGVhciBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHMgdGltZSBpbiBzZWNvbmRzIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkXG4gICAqL1xuICBwcml2YXRlIGNsZWFyTWVzc2FnZUluKG1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2UubmV4dCh1bmRlZmluZWQpO1xuICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gIH1cbn1cbiIsIi8qKlxuICogdG9vbGJhciBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IG5neEVkaXRvckNvbmZpZyA9IHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIHNwZWxsY2hlY2s6IHRydWUsXG4gIGhlaWdodDogJ2F1dG8nLFxuICBtaW5IZWlnaHQ6ICcwJyxcbiAgd2lkdGg6ICdhdXRvJyxcbiAgbWluV2lkdGg6ICcwJyxcbiAgdHJhbnNsYXRlOiAneWVzJyxcbiAgZW5hYmxlVG9vbGJhcjogdHJ1ZSxcbiAgc2hvd1Rvb2xiYXI6IHRydWUsXG4gIHBsYWNlaG9sZGVyOiAnVGV4dCBoaWVyIGVpbmbDg8K8Z2VuLi4uJyxcbiAgaW1hZ2VFbmRQb2ludDogJycsXG4gIHRvb2xiYXI6IFtcbiAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2VUaHJvdWdoJywgJ3N1cGVyc2NyaXB0JywgJ3N1YnNjcmlwdCddLFxuICAgIFsnZm9udE5hbWUnLCAnZm9udFNpemUnLCAnY29sb3InXSxcbiAgICBbJ2p1c3RpZnlMZWZ0JywgJ2p1c3RpZnlDZW50ZXInLCAnanVzdGlmeVJpZ2h0JywgJ2p1c3RpZnlGdWxsJywgJ2luZGVudCcsICdvdXRkZW50J10sXG4gICAgWydjdXQnLCAnY29weScsICdkZWxldGUnLCAncmVtb3ZlRm9ybWF0JywgJ3VuZG8nLCAncmVkbyddLFxuICAgIFsncGFyYWdyYXBoJywgJ2Jsb2NrcXVvdGUnLCAncmVtb3ZlQmxvY2txdW90ZScsICdob3Jpem9udGFsTGluZScsICdvcmRlcmVkTGlzdCcsICd1bm9yZGVyZWRMaXN0J10sXG4gICAgWydsaW5rJywgJ3VubGluaycsICdpbWFnZScsICd2aWRlbyddXG4gIF1cbn07XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgVmlld0NoaWxkLFxuICBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgZm9yd2FyZFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5cbmltcG9ydCB7IG5neEVkaXRvckNvbmZpZyB9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3InLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3IuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neEVkaXRvckNvbXBvbmVudCksXG4gICAgbXVsdGk6IHRydWVcbiAgfV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cbiAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XG4gIC8qKiBUaGUgc3BlbGxjaGVjayBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgZWxlbWVudCBpcyB0byBoYXZlIGl0cyBzcGVsbGluZyBhbmQgZ3JhbW1hciBjaGVja2VkIG9yIG5vdC4gKi9cbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcbiAgLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgdGV4dEFyZWEgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0cmFuc2xhdGUgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudCBzaG91bGQgYmUgdHJhbnNsYXRlZCBvciBub3QuXG4gICAqXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxuICAgKi9cbiAgQElucHV0KCkgdHJhbnNsYXRlOiBzdHJpbmc7XG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIGhlaWdodCBmb3IgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgV2lkdGggb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluV2lkdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQ2hlY2sgbmd4RWRpdG9yQ29uZmlnIGZvciB0b29sYmFyIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIGVuYWJsZSBhbGwgdG9vbGJhclxuICAgKi9cbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xuICAvKipcbiAgICogVGhlIGVkaXRvciBjYW4gYmUgcmVzaXplZCB2ZXJ0aWNhbGx5LlxuICAgKlxuICAgKiBgYmFzaWNgIHJlc2l6ZXIgZW5hYmxlcyB0aGUgaHRtbDUgcmVzemllci4gQ2hlY2sgaGVyZSBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2Nzc3JlZi9jc3MzX3ByX3Jlc2l6ZS5hc3BcbiAgICpcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cbiAgICovXG4gIEBJbnB1dCgpIHJlc2l6ZXIgPSAnc3RhY2snO1xuICAvKipcbiAgICogVGhlIGNvbmZpZyBwcm9wZXJ0eSBpcyBhIEpTT04gb2JqZWN0XG4gICAqXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXG4gICAqIGlucHV0cyBwcm92aWRlZCBkaXJlY3RseSBhcmUgY29uc2lkZXJlZCBhcyB0b3AgcHJpb3JpdHlcbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcbiAgLyoqIFdlYXRoZXIgdG8gc2hvdyBvciBoaWRlIHRvb2xiYXIgKi9cbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIGVuYWJsZVRvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBFbmRwb2ludCBmb3Igd2hpY2ggdGhlIGltYWdlIHRvIGJlIHVwbG9hZGVkICovXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcblxuICAvKiogZW1pdHMgYGJsdXJgIGV2ZW50IHdoZW4gZm9jdXNlZCBvdXQgZnJvbSB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIC8qKiBlbWl0cyBgZm9jdXNgIGV2ZW50IHdoZW4gZm9jdXNlZCBpbiB0byB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGZvY3VzOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ25neFRleHRBcmVhJykgdGV4dEFyZWE6IGFueTtcbiAgQFZpZXdDaGlsZCgnbmd4V3JhcHBlcicpIG5neFdyYXBwZXI6IGFueTtcblxuICBVdGlsczogYW55ID0gVXRpbHM7XG5cbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25Ub3VjaGVkOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3IgbWVzc2FnZSBjb21wb25lbnRcbiAgICogQHBhcmFtIF9jb21tYW5kRXhlY3V0b3IgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqIEBwYXJhbSBfcmVuZGVyZXIgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIHRoZSBkb20gZWxlbWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvcjogQ29tbWFuZEV4ZWN1dG9yU2VydmljZSxcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7IH1cblxuICAvKipcbiAgICogZXZlbnRzXG4gICAqL1xuICBvblRleHRBcmVhRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1cy5lbWl0KCdmb2N1cycpO1xuICB9XG5cbiAgLyoqIGZvY3VzIHRoZSB0ZXh0IGFyZWEgd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkICovXG4gIG9uRWRpdG9yRm9jdXMoKSB7XG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZWQgZnJvbSB0aGUgY29udGVudGVkaXRhYmxlIHNlY3Rpb24gd2hpbGUgdGhlIGlucHV0IHByb3BlcnR5IGNoYW5nZXNcbiAgICogQHBhcmFtIGh0bWwgaHRtbCBzdHJpbmcgZnJvbSBjb250ZW50ZWRpdGFibGVcbiAgICovXG4gIG9uQ29udGVudENoYW5nZShpbm5lckhUTUw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkNoYW5nZShpbm5lckhUTUwpO1xuICAgICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcihpbm5lckhUTUwpO1xuICAgIH1cbiAgfVxuXG4gIG9uVGV4dEFyZWFCbHVyKCk6IHZvaWQge1xuICAgIC8qKiBzYXZlIHNlbGVjdGlvbiBpZiBmb2N1c3NlZCBvdXQgKi9cbiAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3Iuc2F2ZWRTZWxlY3Rpb24gPSBVdGlscy5zYXZlU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub25Ub3VjaGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICB0aGlzLmJsdXIuZW1pdCgnYmx1cicpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlc2l6aW5nIHRleHQgYXJlYVxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0WSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIGVpZHRhYmxlIHBvcnRpb24gb2YgdGhlIGVkaXRvclxuICAgKi9cbiAgcmVzaXplVGV4dEFyZWEob2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IG5ld0hlaWdodCA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0LCAxMCk7XG4gICAgbmV3SGVpZ2h0ICs9IG9mZnNldFk7XG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBlZGl0b3IgYWN0aW9ucywgaS5lLiwgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmROYW1lIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLmV4ZWN1dGUoY29tbWFuZE5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcih2YWx1ZSk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICc8YnI+Jykge1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMucmVmcmVzaFZpZXcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSBjaGFuZ2UgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIHRvdWNoIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogcmVmcmVzaCB2aWV3L0hUTUwgb2YgdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgaHRtbCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICByZWZyZXNoVmlldyh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2lubmVySFRNTCcsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIEEgSFRNTCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICB0b2dnbGVQbGFjZWhvbGRlcih2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gJzxicj4nIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMubmd4V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2hvdy1wbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEganNvbiBjb250YWluaW5nIGlucHV0IHBhcmFtc1xuICAgKi9cbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgIGVuYWJsZVRvb2xiYXI6IHRoaXMuZW5hYmxlVG9vbGJhcixcbiAgICAgIHNob3dUb29sYmFyOiB0aGlzLnNob3dUb29sYmFyLFxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxuICAgICAgdG9vbGJhcjogdGhpcy50b29sYmFyXG4gICAgfTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8qKlxuICAgICAqIHNldCBjb25maWd1YXJ0aW9uXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy5leGVjdXRlQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uL25neC1lZGl0b3IuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1ncmlwcGllJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1ncmlwcGllLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEdyaXBwaWVDb21wb25lbnQge1xuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKiBwcmV2aW91cyB2YWx1ZSBiZWZvciByZXNpemluZyB0aGUgZWRpdG9yICovXG4gIG9sZFkgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXG4gIGdyYWJiZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSkgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZ3JhYmJlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VkaXRvckNvbXBvbmVudC5yZXNpemVUZXh0QXJlYShldmVudC5jbGllbnRZIC0gdGhpcy5vbGRZKTtcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBNb3VzZWV2ZW50XG4gICAqXG4gICAqIHNldCB0aGUgZ3JhYmJlciB0byBmYWxzZSBvbiBtb3VzZSB1cCBhY3Rpb25cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmdyYWJiZXIgPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIG9uUmVzaXplKGV2ZW50OiBNb3VzZUV2ZW50LCByZXNpemVyPzogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmdyYWJiZXIgPSB0cnVlO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItbWVzc2FnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQge1xuICAvKiogcHJvcGVydHkgdGhhdCBob2xkcyB0aGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciAqL1xuICBuZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xuICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmdldE1lc3NhZ2UoKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IHN0cmluZykgPT4gdGhpcy5uZ3hNZXNzYWdlID0gbWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXJzIGVkaXRvciBtZXNzYWdlXG4gICAqL1xuICBjbGVhck1lc3NhZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5uZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBQb3BvdmVyQ29uZmlnIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuaW1wb3J0IHtDb2xvclBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi4vLi4vY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci10b29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtQb3BvdmVyQ29uZmlnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHB1YmxpYyBmb250U2l6ZXMgPSBbXG4gICAge25hbWU6IFwiTm9ybWFsXCIsIHZhbDogXCJub3JtYWxcIn0sXG4gICAge25hbWU6IFwiS2xlaW5cIiwgdmFsOiBcInNtYWxsXCJ9LFxuICAgIHtuYW1lOiBcIkdyb8ODwp9cIiwgdmFsOiBcImJpZ1wifVxuICBdO1xuXG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBsaW5rIGZvcm0gKi9cbiAgdXJsRm9ybTogRm9ybUdyb3VwO1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgaW1hZ2UgZm9ybSAqL1xuICBpbWFnZUZvcm06IEZvcm1Hcm91cDtcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IHZpZGVvIGZvcm0gKi9cbiAgdmlkZW9Gb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBzZXQgdG8gZmFsc2Ugd2hlbiBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICB1cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gIC8qKiB1cGxvYWQgcGVyY2VudGFnZSAqL1xuICB1cGRsb2FkUGVyY2VudGFnZSA9IDA7XG4gIC8qKiBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICBpc1VwbG9hZGluZyA9IGZhbHNlO1xuICAvKiogd2hpY2ggdGFiIHRvIGFjdGl2ZSBmb3IgY29sb3IgaW5zZXRpb24gKi9cbiAgc2VsZWN0ZWRDb2xvclRhYiA9ICd0ZXh0Q29sb3InO1xuICAvKiogZm9udCBmYW1pbHkgbmFtZSAqL1xuICBmb250TmFtZSA9ICcnO1xuICAvKiogZm9udCBzaXplICovXG4gIGZvbnRTaXplID0gdGhpcy5mb250U2l6ZXNbMF0udmFsO1xuICAvKiogaGV4IGNvbG9yIGNvZGUgKi9cbiAgaGV4Q29sb3IgPSAnJztcbiAgLyoqIHNob3cvaGlkZSBpbWFnZSB1cGxvYWRlciAqL1xuICBpc0ltYWdlVXBsb2FkZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogRWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZzogYW55O1xuICBAVmlld0NoaWxkKCd1cmxQb3BvdmVyJykgdXJsUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnaW1hZ2VQb3BvdmVyJykgaW1hZ2VQb3BvdmVyO1xuICBAVmlld0NoaWxkKCd2aWRlb1BvcG92ZXInKSB2aWRlb1BvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2ZvbnRTaXplUG9wb3ZlcicpIGZvbnRTaXplUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnY29sb3JQb3BvdmVyJykgY29sb3JQb3BvdmVyO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiBhIHRvb2xiYXIgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBleGVjdXRlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9wT3ZlckNvbmZpZzogUG9wb3ZlckNvbmZpZyxcbiAgICBwcml2YXRlIF9mb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvclNlcnZpY2U6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UpIHtcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLm91dHNpZGVDbGljayA9IHRydWU7XG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5wbGFjZW1lbnQgPSAnYm90dG9tJztcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLmNvbnRhaW5lciA9ICdib2R5JztcbiAgICB0aGlzLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZXNbMF0udmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGVuYWJsZSBvciBkaWFibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBuYW1lIG9mIHRoZSB0b29sYmFyIGJ1dHRvbnNcbiAgICovXG4gIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWxzLmNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlLCB0aGlzLmNvbmZpZ1sndG9vbGJhciddKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmlnZ2VycyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXIgdG8gYmUgZXhlY3V0ZWQgYW5kIGVtaXRzIGFuIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIHRyaWdnZXJDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZXhlY3V0ZS5lbWl0KGNvbW1hbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBVUkwgaW5zZXJ0IGZvcm1cbiAgICovXG4gIGJ1aWxkVXJsRm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLnVybEZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1cmxMaW5rOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxUZXh0OiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxOZXdUYWI6IFt0cnVlXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqL1xuICBpbnNlcnRMaW5rKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmNyZWF0ZUxpbmsodGhpcy51cmxGb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cbiAgICB0aGlzLnVybFBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBpbnNlcnQgaW1hZ2UgZm9ybVxuICAgKi9cbiAgYnVpbGRJbWFnZUZvcm0oKTogdm9pZCB7XG4gICAgdGhpcy5pbWFnZUZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBpbWFnZVVybDogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF1dXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZFZpZGVvRm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZGVvRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHZpZGVvVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICBoZWlnaHQ6IFsnJ10sXG4gICAgICB3aWR0aDogWycnXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxuICAgKlxuICAgKiBAcGFyYW0gZSBvbkNoYW5nZSBldmVudFxuICAgKi9cbiAgb25GaWxlQ2hhbmdlKGUpOiB2b2lkIHtcbiAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy5pc1VwbG9hZGluZyA9IHRydWU7XG5cbiAgICBpZiAoZS50YXJnZXQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnVwbG9hZEltYWdlKGZpbGUsIHRoaXMuY29uZmlnLmltYWdlRW5kUG9pbnQpLnN1YnNjcmliZShldmVudCA9PiB7XG5cbiAgICAgICAgICBpZiAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgdGhpcy51cGRsb2FkUGVyY2VudGFnZSA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZShldmVudC5ib2R5LnVybCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0SW1hZ2UoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5pbWFnZUZvcm0udmFsdWUuaW1hZ2VVcmwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy5pbWFnZVBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXG4gIGluc2VydFZpZGVvKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydFZpZGVvKHRoaXMudmlkZW9Gb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudmlkZW9Qb3BvdmVyLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBpbnNlciB0ZXh0L2JhY2tncm91bmQgY29sb3IgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBsZXQgaGV4OiBhbnkgPSBjb2xvci5tYXRjaCgvXnJnYmE/W1xccytdP1xcKFtcXHMrXT8oXFxkKylbXFxzK10/LFtcXHMrXT8oXFxkKylbXFxzK10/LFtcXHMrXT8oXFxkKylbXFxzK10/L2kpO1xuICAgICAgaGV4ID0gIFwiI1wiICtcbiAgICAgICAgKFwiMFwiICsgcGFyc2VJbnQoaGV4WzFdLDEwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKSArXG4gICAgICAgIChcIjBcIiArIHBhcnNlSW50KGhleFsyXSwxMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMikgK1xuICAgICAgICAoXCIwXCIgKyBwYXJzZUludChoZXhbM10sMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRDb2xvcihoZXgsIHdoZXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIHNldCBmb250IHNpemUgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnRTaXplKGZvbnRTaXplKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIHNldCBmb250IE5hbWUvZmFtaWx5ICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5zZXRGb250TmFtZShmb250TmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgICB0aGlzLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZXNbMF0udmFsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWNvbG9yLXBpY2tlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2xvci1waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1waWNrZXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyQ29tcG9uZW50IHtcbiAgcHVibGljIGh1ZTogc3RyaW5nO1xuICBwdWJsaWMgY29sb3I6IHN0cmluZztcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1jb2xvci1wYWxldHRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBhbGV0dGVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBodWU6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcblxuICBAVmlld0NoaWxkKCdjYW52YXMnKVxuICBjYW52YXM6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcHJpdmF0ZSBtb3VzZWRvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgc2VsZWN0ZWRQb3NpdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodDtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuaHVlIHx8ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJztcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHdoaXRlR3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHdpZHRoLCAwKTtcbiAgICB3aGl0ZUdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG4gICAgd2hpdGVHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gd2hpdGVHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgYmxhY2tHcmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgaGVpZ2h0KTtcbiAgICBibGFja0dyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgYmxhY2tHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwxKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmxhY2tHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbikge1xuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHguYXJjKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbi54LCB0aGlzLnNlbGVjdGVkUG9zaXRpb24ueSwgMTAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ2h1ZSddKSB7XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMuc2VsZWN0ZWRQb3NpdGlvbjtcbiAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgdGhpcy5jb2xvci5lbWl0KHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHBvcy54LCBwb3MueSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVVwKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gZmFsc2U7XG4gIH1cblxuICBvbk1vdXNlRG93bihldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFBvc2l0aW9uID0geyB4OiBldnQub2Zmc2V0WCwgeTogZXZ0Lm9mZnNldFkgfTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgICB0aGlzLmNvbG9yLmVtaXQodGhpcy5nZXRDb2xvckF0UG9zaXRpb24oZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3VzZWRvd24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRQb3NpdGlvbiA9IHsgeDogZXZ0Lm9mZnNldFgsIHk6IGV2dC5vZmZzZXRZIH07XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIHRoaXMuZW1pdENvbG9yKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XG4gICAgfVxuICB9XG5cbiAgZW1pdENvbG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmdiYUNvbG9yID0gdGhpcy5nZXRDb2xvckF0UG9zaXRpb24oeCwgeSk7XG4gICAgdGhpcy5jb2xvci5lbWl0KHJnYmFDb2xvcik7XG4gIH1cblxuICBnZXRDb2xvckF0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBjb25zdCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoeCwgeSwgMSwgMSkuZGF0YTtcbiAgICByZXR1cm4gJ3JnYmEoJyArIGltYWdlRGF0YVswXSArICcsJyArIGltYWdlRGF0YVsxXSArICcsJyArIGltYWdlRGF0YVsyXSArICcsMSknO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtY29sb3Itc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JTbGlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnY2FudmFzJylcbiAgY2FudmFzOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgbW91c2Vkb3duOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc2VsZWN0ZWRIZWlnaHQ6IG51bWJlcjtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGhlaWdodCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4xNywgJ3JnYmEoMjU1LCAyNTUsIDAsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMzQsICdyZ2JhKDAsIDI1NSwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MSwgJ3JnYmEoMCwgMjU1LCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNjgsICdyZ2JhKDAsIDAsIDI1NSwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44NSwgJ3JnYmEoMjU1LCAwLCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcblxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LnJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RlZEhlaWdodCkge1xuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHgucmVjdCgwLCB0aGlzLnNlbGVjdGVkSGVpZ2h0IC0gNSwgd2lkdGgsIDEwKTtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93Om1vdXNldXAnLCBbJyRldmVudCddKVxuICBvbk1vdXNlVXAoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZWRvd24gPSBmYWxzZTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gdHJ1ZTtcbiAgICB0aGlzLnNlbGVjdGVkSGVpZ2h0ID0gZXZ0Lm9mZnNldFk7XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgdGhpcy5lbWl0Q29sb3IoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGV2dDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLm1vdXNlZG93bikge1xuICAgICAgdGhpcy5zZWxlY3RlZEhlaWdodCA9IGV2dC5vZmZzZXRZO1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB0aGlzLmVtaXRDb2xvcihldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXRDb2xvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IHJnYmFDb2xvciA9IHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHgsIHkpO1xuICAgIHRoaXMuY29sb3IuZW1pdChyZ2JhQ29sb3IpO1xuICB9XG5cbiAgZ2V0Q29sb3JBdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpLmRhdGE7XG4gICAgcmV0dXJuICdyZ2JhKCcgKyBpbWFnZURhdGFbMF0gKyAnLCcgKyBpbWFnZURhdGFbMV0gKyAnLCcgKyBpbWFnZURhdGFbMl0gKyAnLDEpJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb2xvclBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29sb3ItcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb2xvclBhbGV0dGVDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXBhbGV0dGUvY29sb3ItcGFsZXR0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29sb3JTbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXNsaWRlci9jb2xvci1zbGlkZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbQ29sb3JQaWNrZXJDb21wb25lbnQgXSxcbiAgZGVjbGFyYXRpb25zOiBbQ29sb3JQaWNrZXJDb21wb25lbnQsIENvbG9yUGFsZXR0ZUNvbXBvbmVudCwgQ29sb3JTbGlkZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyTW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBQb3BvdmVyTW9kdWxlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdyaXBwaWVDb21wb25lbnQgfSBmcm9tICcuL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7Q29sb3JQaWNrZXJNb2R1bGV9IGZyb20gJy4uL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFBvcG92ZXJNb2R1bGUuZm9yUm9vdCgpLCBDb2xvclBpY2tlck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW05neEVkaXRvckNvbXBvbmVudCwgTmd4R3JpcHBpZUNvbXBvbmVudCwgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCwgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hFZGl0b3JDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLCBNZXNzYWdlU2VydmljZV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JNb2R1bGUgeyB9XG4iLCJpbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmludGVyZmFjZSBJTWF4TGVuZ3RoVmFsaWRhdG9yT3B0aW9ucyB7XG4gIGV4Y2x1ZGVMaW5lQnJlYWtzPzogYm9vbGVhbjtcbiAgY29uY2F0V2hpdGVTcGFjZXM/OiBib29sZWFuO1xuICBleGNsdWRlV2hpdGVTcGFjZXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTWF4TGVuZ3RoVmFsaWRhdG9yKG1heGxlbmd0aDogbnVtYmVyLCBvcHRpb25zPzogSU1heExlbmd0aFZhbGlkYXRvck9wdGlvbnMpIHtcbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbCA9PiB7XG4gICAgY29uc3QgcGFyc2VkRG9jdW1lbnQgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGNvbnRyb2wudmFsdWUsICd0ZXh0L2h0bWwnKTtcbiAgICBsZXQgaW5uZXJUZXh0ID0gcGFyc2VkRG9jdW1lbnQuYm9keS5pbm5lclRleHQgfHwgJyc7XG5cbiAgICAvLyByZXBsYWNlIGFsbCBsaW5lYnJlYWtzXG4gICAgaWYgKG9wdGlvbnMuZXhjbHVkZUxpbmVCcmVha3MpIHtcbiAgICAgIGlubmVyVGV4dCA9IGlubmVyVGV4dC5yZXBsYWNlKC8oXFxyXFxuXFx0fFxcbnxcXHJcXHQpL2dtLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gY29uY2F0IG11bHRpcGxlIHdoaXRlc3BhY2VzIGludG8gYSBzaW5nbGUgd2hpdGVzcGFjZVxuICAgIGlmIChvcHRpb25zLmNvbmNhdFdoaXRlU3BhY2VzKSB7XG4gICAgICBpbm5lclRleHQgPSBpbm5lclRleHQucmVwbGFjZSgvKFxcc1xccyspL2dtLCAnICcpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBhbGwgd2hpdGVzcGFjZXNcbiAgICBpZiAob3B0aW9ucy5leGNsdWRlV2hpdGVTcGFjZXMpIHtcbiAgICAgIGlubmVyVGV4dCA9IGlubmVyVGV4dC5yZXBsYWNlKC8oXFxzKS9nbSwgJycpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclRleHQubGVuZ3RoID4gbWF4bGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZ3hFZGl0b3I6IHtcbiAgICAgICAgICBhbGxvd2VkTGVuZ3RoOiBtYXhsZW5ndGgsXG4gICAgICAgICAgdGV4dExlbmd0aDogaW5uZXJUZXh0Lmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJVdGlscy5yZXN0b3JlU2VsZWN0aW9uIiwiSHR0cFJlcXVlc3QiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsIlN1YmplY3QiLCJFdmVudEVtaXR0ZXIiLCJVdGlscy5zYXZlU2VsZWN0aW9uIiwiQ29tcG9uZW50IiwiTkdfVkFMVUVfQUNDRVNTT1IiLCJmb3J3YXJkUmVmIiwiUmVuZGVyZXIyIiwiSW5wdXQiLCJPdXRwdXQiLCJWaWV3Q2hpbGQiLCJIb3N0TGlzdGVuZXIiLCJVdGlscy5jYW5FbmFibGVUb29sYmFyT3B0aW9ucyIsIlZhbGlkYXRvcnMiLCJIdHRwUmVzcG9uc2UiLCJQb3BvdmVyQ29uZmlnIiwiRm9ybUJ1aWxkZXIiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIlBvcG92ZXJNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEscUNBQXdDLEtBQWEsRUFBRSxPQUFZO1FBQ2pFLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMzQixPQUFPLElBQUksQ0FBQzthQUNiO2lCQUFNOztnQkFDTCxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSztvQkFDaEMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNwQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7YUFDcEM7U0FDRjthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUM7U0FDZDtLQUNGOzs7Ozs7Ozs7QUFTRCxvQ0FBdUMsS0FBVSxFQUFFLGVBQW9CLEVBQUUsS0FBVTtRQUNqRixLQUFLLElBQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtZQUMvQixJQUFJLENBQUMsRUFBRTtnQkFDTCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQzFCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JCO2dCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjthQUNGO1NBQ0Y7UUFFRCxPQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7O0FBT0QsdUJBQTBCLE9BQWU7UUFDdkMsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQ3ZCLE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxLQUFLLENBQUM7S0FDZDs7Ozs7QUFLRDtRQUNFLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTs7WUFDdkIsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xDLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO2dCQUNwQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUI7U0FDRjthQUFNLElBQUksUUFBUSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3hELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7OztBQU9ELDhCQUFpQyxLQUFLO1FBQ3BDLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFOztnQkFDdkIsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNsQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7aUJBQU0sSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZixPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7S0FDRjs7Ozs7Ozs7Ozs7Ozs7QUMxRkQ7Ozs7O1FBYUUsZ0NBQW9CLEtBQWlCO1lBQWpCLFVBQUssR0FBTCxLQUFLLENBQVk7Ozs7a0NBTmYsU0FBUztTQU1XOzs7Ozs7Ozs7Ozs7UUFPMUMsd0NBQU87Ozs7OztZQUFQLFVBQVEsT0FBZTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO29CQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7aUJBQ3hDO2dCQUVELElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO29CQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNwRDtnQkFFRCxJQUFJLE9BQU8sS0FBSyxZQUFZLEVBQUU7b0JBQzVCLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztpQkFDMUQ7Z0JBRUQsSUFBSSxPQUFPLEtBQUssa0JBQWtCLEVBQUU7b0JBQ2xDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDbkQ7Z0JBRUQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzVDOzs7Ozs7Ozs7Ozs7UUFPRCw0Q0FBVzs7Ozs7O1lBQVgsVUFBWSxRQUFnQjtnQkFDMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN2QixJQUFJLFFBQVEsRUFBRTs7d0JBQ1osSUFBTSxRQUFRLEdBQUdBLGdCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxRQUFRLEVBQUU7OzRCQUNaLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDdEUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQ0FDYixNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzZCQUNoQzt5QkFDRjtxQkFDRjtpQkFDRjtxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7aUJBQ2hEO2FBQ0Y7Ozs7Ozs7Ozs7OztRQU9ELDRDQUFXOzs7Ozs7WUFBWCxVQUFZLFVBQWU7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsSUFBSSxVQUFVLEVBQUU7O3dCQUNkLElBQU0sUUFBUSxHQUFHQSxnQkFBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQzdELElBQUksUUFBUSxFQUFFOzRCQUNaLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7O2dDQUMzQyxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUc7c0NBQzVGLE9BQU8sR0FBRyxVQUFVLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQztnQ0FDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQzs2QkFDN0I7aUNBQU0sSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0NBRWpELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7O29DQUN4QyxJQUFNLFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUc7MENBQ3pGLGdDQUFnQyxHQUFHLFVBQVUsQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO29DQUMxRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lDQUMzQjtxQ0FBTTtvQ0FDTCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7aUNBQ3RDOzZCQUVGO2lDQUFNO2dDQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs2QkFDM0M7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2lCQUNoRDthQUNGOzs7Ozs7O1FBT08sOENBQWE7Ozs7OztzQkFBQyxHQUFXOztnQkFDL0IsSUFBTSxRQUFRLEdBQUcsdURBQXVELENBQUM7Z0JBQ3pFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7OztRQU9wQiwyQ0FBVTs7Ozs7c0JBQUMsR0FBVzs7Z0JBQzVCLElBQU0sU0FBUyxHQUFHLDZFQUE2RSxDQUFDO2dCQUNoRyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztRQVM3Qiw0Q0FBVzs7Ozs7OztZQUFYLFVBQVksSUFBVSxFQUFFLFFBQWdCO2dCQUN0QyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztpQkFDN0Q7O2dCQUVELElBQU0sUUFBUSxHQUFhLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBRTFDLElBQUksSUFBSSxFQUFFO29CQUVSLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDOztvQkFFOUIsSUFBTSxHQUFHLEdBQUcsSUFBSUMsZ0JBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTt3QkFDdEQsY0FBYyxFQUFFLElBQUk7cUJBQ3JCLENBQUMsQ0FBQztvQkFFSCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUVoQztxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUNsQzthQUNGOzs7Ozs7Ozs7Ozs7UUFPRCwyQ0FBVTs7Ozs7O1lBQVYsVUFBVyxNQUFXO2dCQUNwQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Ozs7b0JBSXZCLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTs7d0JBQ3BCLElBQU0sTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO3dCQUU3RixJQUFJLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFOzs0QkFDNUMsSUFBTSxRQUFRLEdBQUdELGdCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs0QkFDN0QsSUFBSSxRQUFRLEVBQUU7Z0NBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDekI7eUJBQ0Y7NkJBQU07NEJBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO3lCQUMxRTtxQkFDRjt5QkFBTTs7d0JBQ0wsSUFBTSxRQUFRLEdBQUdBLGdCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxRQUFRLEVBQUU7NEJBQ1osUUFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDM0Q7cUJBQ0Y7aUJBQ0Y7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2lCQUNoRDthQUNGOzs7Ozs7Ozs7Ozs7OztRQVFELDRDQUFXOzs7Ozs7O1lBQVgsVUFBWSxLQUFhLEVBQUUsS0FBYTtnQkFDdEMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFOztvQkFDdkIsSUFBTSxRQUFRLEdBQUdBLGdCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDN0QsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO3dCQUNyQyxJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7NEJBQ3pCLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDakQ7NkJBQU07NEJBQ0wsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUNuRDtxQkFDRjtpQkFDRjtxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7aUJBQ2hEO2FBQ0Y7Ozs7O1FBR0QsNkNBQVk7Ozs7WUFBWixVQUFhLElBQVk7Z0JBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTs7b0JBQ3ZCLElBQU0sUUFBUSxHQUFHQSxnQkFBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzdELElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTt3QkFDckMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUMvQztpQkFDRjthQUNGOzs7Ozs7Ozs7Ozs7UUFPRCw0Q0FBVzs7Ozs7O1lBQVgsVUFBWSxRQUFnQjtnQkFDMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTs7b0JBQ2hELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO29CQUVoRCxJQUFJLFlBQVksRUFBRTs7d0JBQ2hCLElBQU0sUUFBUSxHQUFHQSxnQkFBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBRTdELElBQUksUUFBUSxFQUFFOzRCQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTs7Z0NBQzVCLElBQU0sTUFBTSxHQUFHLDBCQUEwQixHQUFHLFFBQVEsR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztnQ0FDMUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDekI7aUNBQU07O2dDQUVMLElBQU0sTUFBTSxHQUFHLHNCQUFvQixRQUFRLFVBQUssWUFBWSxhQUFVLENBQUM7Z0NBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7NkJBQ3pCO3lCQUNGO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztpQkFDaEQ7YUFDRjs7Ozs7Ozs7Ozs7O1FBT0QsNENBQVc7Ozs7OztZQUFYLFVBQVksUUFBZ0I7Z0JBQzFCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7O29CQUNoRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztvQkFFaEQsSUFBSSxZQUFZLEVBQUU7O3dCQUNoQixJQUFNLFFBQVEsR0FBR0EsZ0JBQXNCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUU3RCxJQUFJLFFBQVEsRUFBRTs0QkFDWixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7O2dDQUM1QixJQUFNLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxRQUFRLEdBQUcsT0FBTyxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0NBQ2hHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQzdCO2lDQUFNOztnQ0FDTCxJQUFNLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0NBQzlGLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQzdCO3lCQUNGO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztpQkFDaEQ7YUFDRjs7Ozs7O1FBR08sMkNBQVU7Ozs7O3NCQUFDLElBQVk7O2dCQUM3QixJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXZFLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztpQkFDcEQ7Ozs7Ozs7OztRQVFLLDBDQUFTOzs7Ozs7O3NCQUFDLEtBQVU7Z0JBQzFCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7O1FBSTNCLG9EQUFtQjs7Ozs7O2dCQUN6QixJQUFJLFdBQVcsQ0FBQztnQkFFaEIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN2QixXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDckMsT0FBTyxXQUFXLENBQUM7aUJBQ3BCO2dCQUVELE9BQU8sS0FBSyxDQUFDOzs7Ozs7UUFJUCwrQ0FBYzs7Ozs7O2dCQUNwQixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUVuRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7aUJBQ2hEO2dCQUVELE9BQU8sSUFBSSxDQUFDOzs7Ozs7OztRQVFOLHlEQUF3Qjs7Ozs7O3NCQUFDLEdBQVc7Z0JBQzFDLE9BQU8sRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLGtCQUFrQixDQUFDLENBQUM7OztvQkFoVHZFRSxlQUFVOzs7Ozt3QkFIRkMsZUFBVTs7O3FDQURuQjs7Ozs7OztBQ0FBOzs7SUFLQSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7O1FBT3BCOzs7OzJCQUZtQyxJQUFJQyxZQUFPLEVBQUU7U0FFL0I7Ozs7OztRQUdqQixtQ0FBVTs7OztZQUFWO2dCQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUNwQzs7Ozs7Ozs7Ozs7O1FBT0Qsb0NBQVc7Ozs7OztZQUFYLFVBQVksT0FBZTtnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDL0I7Ozs7Ozs7UUFPTyx1Q0FBYzs7Ozs7O3NCQUFDLFlBQW9COztnQkFDekMsVUFBVSxDQUFDO29CQUNULEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM5QixFQUFFLFlBQVksQ0FBQyxDQUFDOzs7b0JBOUJwQkYsZUFBVTs7Ozs2QkFQWDs7Ozs7Ozs7OztBQ0dBLFFBQWEsZUFBZSxHQUFHO1FBQzdCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsVUFBVSxFQUFFLElBQUk7UUFDaEIsTUFBTSxFQUFFLE1BQU07UUFDZCxTQUFTLEVBQUUsR0FBRztRQUNkLEtBQUssRUFBRSxNQUFNO1FBQ2IsUUFBUSxFQUFFLEdBQUc7UUFDYixTQUFTLEVBQUUsS0FBSztRQUNoQixhQUFhLEVBQUUsSUFBSTtRQUNuQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLE9BQU8sRUFBRTtZQUNQLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUM7WUFDNUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztZQUNqQyxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO1lBQ3BGLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDekQsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUM7WUFDakcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FDckM7S0FDRixDQUFDOzs7Ozs7QUN2QkY7Ozs7OztRQTZGRSw0QkFDVSxpQkFDQSxrQkFDQTtZQUZBLG9CQUFlLEdBQWYsZUFBZTtZQUNmLHFCQUFnQixHQUFoQixnQkFBZ0I7WUFDaEIsY0FBUyxHQUFULFNBQVM7Ozs7Ozs7OzJCQXBDQSxPQUFPOzs7Ozs7OzBCQU9SLGVBQWU7Ozs7d0JBU00sSUFBSUcsaUJBQVksRUFBVTs7Ozt5QkFFekIsSUFBSUEsaUJBQVksRUFBVTt5QkFLckQsS0FBSztTQWFpQjs7Ozs7Ozs7UUFLbkMsNENBQWU7Ozs7WUFBZjtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMxQjs7Ozs7O1FBR0QsMENBQWE7Ozs7WUFBYjtnQkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNyQzs7Ozs7Ozs7OztRQU1ELDRDQUFlOzs7OztZQUFmLFVBQWdCLFNBQWlCO2dCQUMvQixJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbkM7YUFDRjs7OztRQUVELDJDQUFjOzs7WUFBZDs7Z0JBRUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsR0FBR0MsYUFBbUIsRUFBRSxDQUFDO2dCQUU3RCxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7b0JBQ3hDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDbEI7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEI7Ozs7Ozs7Ozs7OztRQU9ELDJDQUFjOzs7Ozs7WUFBZCxVQUFlLE9BQWU7O2dCQUM1QixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDMUMsU0FBUyxJQUFJLE9BQU8sQ0FBQztnQkFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDeEQ7Ozs7Ozs7Ozs7OztRQU9ELDJDQUFjOzs7Ozs7WUFBZCxVQUFlLFdBQW1CO2dCQUNoQyxJQUFJO29CQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzVDO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDakQ7YUFDRjs7Ozs7Ozs7Ozs7O1FBT0QsdUNBQVU7Ozs7OztZQUFWLFVBQVcsS0FBVTtnQkFDbkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUU5QixJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7b0JBQzdFLEtBQUssR0FBRyxJQUFJLENBQUM7aUJBQ2Q7Z0JBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN6Qjs7Ozs7Ozs7Ozs7Ozs7UUFRRCw2Q0FBZ0I7Ozs7Ozs7WUFBaEIsVUFBaUIsRUFBTztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEI7Ozs7Ozs7Ozs7Ozs7O1FBUUQsOENBQWlCOzs7Ozs7O1lBQWpCLFVBQWtCLEVBQU87Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2FBQ3JCOzs7Ozs7Ozs7Ozs7UUFPRCx3Q0FBVzs7Ozs7O1lBQVgsVUFBWSxLQUFhOztnQkFDdkIsSUFBTSxlQUFlLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7YUFDdkY7Ozs7Ozs7Ozs7OztRQU9ELDhDQUFpQjs7Ozs7O1lBQWpCLFVBQWtCLEtBQVU7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO29CQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM1RTtxQkFBTTtvQkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2lCQUMvRTthQUNGOzs7Ozs7OztRQUtELGdEQUFtQjs7OztZQUFuQjtnQkFDRSxPQUFPO29CQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUMzQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQzdCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNuQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7b0JBQ2pDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztvQkFDN0IsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO29CQUNqQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87aUJBQ3RCLENBQUM7YUFDSDs7OztRQUVELHFDQUFROzs7WUFBUjs7OztnQkFJRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztnQkFFMUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztnQkFFdEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2FBQzdDOztvQkF0T0ZDLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsZ0JBQWdCO3dCQUMxQixpaENBQTBDO3dCQUUxQyxTQUFTLEVBQUUsQ0FBQztnQ0FDVixPQUFPLEVBQUVDLHVCQUFpQjtnQ0FDMUIsV0FBVyxFQUFFQyxlQUFVLENBQUMsY0FBTSxPQUFBLGtCQUFrQixHQUFBLENBQUM7Z0NBQ2pELEtBQUssRUFBRSxJQUFJOzZCQUNaLENBQUM7O3FCQUNIOzs7Ozt3QkFmUSxjQUFjO3dCQURkLHNCQUFzQjt3QkFKZkMsY0FBUzs7OzsrQkF3QnRCQyxVQUFLO2lDQUVMQSxVQUFLO2tDQUVMQSxVQUFLO2dDQU1MQSxVQUFLOzZCQUVMQSxVQUFLO2dDQUVMQSxVQUFLOzRCQUVMQSxVQUFLOytCQUVMQSxVQUFLOzhCQVFMQSxVQUFLOzhCQVFMQSxVQUFLOzZCQU9MQSxVQUFLO2tDQUVMQSxVQUFLO29DQUVMQSxVQUFLO29DQUVMQSxVQUFLOzJCQUdMQyxXQUFNOzRCQUVOQSxXQUFNOytCQUVOQyxjQUFTLFNBQUMsYUFBYTtpQ0FDdkJBLGNBQVMsU0FBQyxZQUFZOztpQ0FqRnpCOzs7Ozs7O0FDQUE7Ozs7OztRQXNCRSw2QkFBb0IsZ0JBQW9DO1lBQXBDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBb0I7Ozs7d0JBVGpELENBQUM7Ozs7MkJBRUUsS0FBSztTQU84Qzs7Ozs7Ozs7Ozs7Ozs7UUFRYix5Q0FBVzs7Ozs7OztZQUEzRCxVQUE0RCxLQUFpQjtnQkFDM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2pCLE9BQU87aUJBQ1I7Z0JBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO2FBQzNCOzs7Ozs7Ozs7Ozs7OztRQVE2Qyx1Q0FBUzs7Ozs7OztZQUF2RCxVQUF3RCxLQUFpQjtnQkFDdkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDdEI7Ozs7OztRQUVzQyxzQ0FBUTs7Ozs7WUFBL0MsVUFBZ0QsS0FBaUIsRUFBRSxPQUFrQjtnQkFDbkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDMUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCOztvQkFsREZOLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsaUJBQWlCO3dCQUMzQiwrdkJBQTJDOztxQkFFNUM7Ozs7O3dCQU5RLGtCQUFrQjs7OztrQ0E2QnhCTyxpQkFBWSxTQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDO2dDQWU3Q0EsaUJBQVksU0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzsrQkFJM0NBLGlCQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDOztrQ0FqRHZDOzs7Ozs7O0FDQUE7Ozs7UUFpQkUsbUNBQW9CLGVBQStCO1lBQW5ELGlCQUVDO1lBRm1CLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjs7Ozs4QkFMdEMsU0FBUztZQU1wQixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFDLE9BQWUsSUFBSyxPQUFBLEtBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxHQUFBLENBQUMsQ0FBQztTQUM3Rjs7Ozs7Ozs7UUFLRCxnREFBWTs7OztZQUFaO2dCQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO2FBQzdCOztvQkF0QkZQLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsd0JBQXdCO3dCQUNsQywrSEFBa0Q7O3FCQUVuRDs7Ozs7d0JBTlEsY0FBYzs7O3dDQUZ2Qjs7Ozs7OztBQ0FBO1FBOERFLG1DQUFvQixjQUE2QixFQUN2QyxjQUNBLGlCQUNBO1lBSFUsbUJBQWMsR0FBZCxjQUFjLENBQWU7WUFDdkMsaUJBQVksR0FBWixZQUFZO1lBQ1osb0JBQWUsR0FBZixlQUFlO1lBQ2YsNEJBQXVCLEdBQXZCLHVCQUF1Qjs2QkEvQ2Q7Z0JBQ2pCLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFDO2dCQUMvQixFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQztnQkFDN0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUM7YUFDM0I7Ozs7a0NBU2dCLElBQUk7Ozs7cUNBRUQsQ0FBQzs7OzsrQkFFUCxLQUFLOzs7O29DQUVBLFdBQVc7Ozs7NEJBRW5CLEVBQUU7Ozs7NEJBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHOzs7OzRCQUVyQixFQUFFOzs7O21DQUVLLEtBQUs7Ozs7MkJBY21CLElBQUlGLGlCQUFZLEVBQVU7WUFPbEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUN6QyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUN2Qzs7Ozs7Ozs7Ozs7O1FBT0QsMkRBQXVCOzs7Ozs7WUFBdkIsVUFBd0IsS0FBSztnQkFDM0IsT0FBT1UsdUJBQTZCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUNyRTs7Ozs7Ozs7Ozs7O1FBT0Qsa0RBQWM7Ozs7OztZQUFkLFVBQWUsT0FBZTtnQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUI7Ozs7Ozs7O1FBS0QsZ0RBQVk7Ozs7WUFBWjtnQkFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQ0MsZ0JBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUNBLGdCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ0o7Ozs7Ozs7O1FBS0QsOENBQVU7Ozs7WUFBVjtnQkFDRSxJQUFJO29CQUNGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDN0Q7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNqRDs7Z0JBR0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOztnQkFFcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN4Qjs7Ozs7Ozs7UUFLRCxrREFBYzs7OztZQUFkO2dCQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7b0JBQ3ZDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDQSxnQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN0QyxDQUFDLENBQUM7YUFDSjs7Ozs7Ozs7UUFLRCxrREFBYzs7OztZQUFkO2dCQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7b0JBQ3ZDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDQSxnQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNyQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNaLENBQUMsQ0FBQzthQUNKOzs7Ozs7Ozs7Ozs7UUFPRCxnREFBWTs7Ozs7O1lBQVosVUFBYSxDQUFDO2dCQUFkLGlCQThCQztnQkE3QkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUV4QixJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O29CQUM3QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFL0IsSUFBSTt3QkFDRixJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7NEJBRXZGLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtnQ0FDZCxLQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NkJBQ3ZFOzRCQUVELElBQUksS0FBSyxZQUFZQyxpQkFBWSxFQUFFO2dDQUNqQyxJQUFJO29DQUNGLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQ0FDMUQ7Z0NBQUMsT0FBTyxLQUFLLEVBQUU7b0NBQ2QsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lDQUNqRDtnQ0FDRCxLQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQ0FDM0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7NkJBQzFCO3lCQUNGLENBQUMsQ0FBQztxQkFDSjtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ2hELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO3dCQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztxQkFDMUI7aUJBQ0Y7YUFDRjs7Ozs7O1FBR0QsK0NBQVc7Ozs7WUFBWDtnQkFDRSxJQUFJO29CQUNGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3pFO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDakQ7O2dCQUdELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7Z0JBRXRCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7Ozs7OztRQUdELCtDQUFXOzs7O1lBQVg7Z0JBQ0UsSUFBSTtvQkFDRixJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hFO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDakQ7O2dCQUdELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7Z0JBRXRCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7Ozs7Ozs7O1FBR0QsK0NBQVc7Ozs7OztZQUFYLFVBQVksS0FBYSxFQUFFLEtBQWE7Z0JBQ3RDLElBQUk7O29CQUNGLElBQUksR0FBRyxHQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztvQkFDbkcsR0FBRyxHQUFJLEdBQUc7d0JBQ1IsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsRCxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xELENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEQ7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNqRDtnQkFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzFCOzs7Ozs7O1FBR0QsK0NBQVc7Ozs7O1lBQVgsVUFBWSxRQUFnQjtnQkFDMUIsSUFBSTtvQkFDRixJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNwRDtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2pEO2dCQUVELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDN0I7Ozs7Ozs7UUFHRCwrQ0FBVzs7Ozs7WUFBWCxVQUFZLFFBQWdCO2dCQUMxQixJQUFJO29CQUNGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3BEO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDakQ7Z0JBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUM3Qjs7OztRQUVELDRDQUFROzs7WUFBUjtnQkFDRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2FBQ3ZDOztvQkE1T0ZWLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsd0JBQXdCO3dCQUNsQyx3emdCQUFrRDt3QkFFbEQsU0FBUyxFQUFFLENBQUNXLDBCQUFhLENBQUM7O3FCQUMzQjs7Ozs7d0JBWFFBLDBCQUFhO3dCQUZiQyxpQkFBVzt3QkFJWCxjQUFjO3dCQURkLHNCQUFzQjs7Ozs2QkE4QzVCUixVQUFLO2lDQUNMRSxjQUFTLFNBQUMsWUFBWTttQ0FDdEJBLGNBQVMsU0FBQyxjQUFjO21DQUN4QkEsY0FBUyxTQUFDLGNBQWM7c0NBQ3hCQSxjQUFTLFNBQUMsaUJBQWlCO21DQUMzQkEsY0FBUyxTQUFDLGNBQWM7OEJBSXhCRCxXQUFNOzt3Q0EzRFQ7Ozs7Ozs7QUNBQTs7OztvQkFFQ0wsY0FBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxrQkFBa0I7d0JBQzVCLHNZQUE0Qzs7cUJBRTdDOzttQ0FORDs7Ozs7OztBQ0FBOzt5QkFZZ0MsSUFBSUYsaUJBQVksQ0FBQyxJQUFJLENBQUM7NkJBT3ZCLEtBQUs7Ozs7O1FBSWxDLCtDQUFlOzs7WUFBZjtnQkFDRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDYjs7OztRQUVELG9DQUFJOzs7WUFBSjtnQkFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDYixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdkQ7O2dCQUNELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQzs7Z0JBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztnQkFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O2dCQUV2QyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNqRCxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUVqRCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztnQkFFdkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDakUsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQzNDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUUzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUV2QyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO29CQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7b0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25GLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDbkI7YUFDRjs7Ozs7UUFFRCwyQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O29CQUNaLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDbEMsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3hEO2lCQUNGO2FBQ0Y7Ozs7O1FBR0QseUNBQVM7Ozs7WUFEVCxVQUNVLEdBQWU7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3hCOzs7OztRQUVELDJDQUFXOzs7O1lBQVgsVUFBWSxHQUFlO2dCQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ3BFOzs7OztRQUVELDJDQUFXOzs7O1lBQVgsVUFBWSxHQUFlO2dCQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQzthQUNGOzs7Ozs7UUFFRCx5Q0FBUzs7Ozs7WUFBVCxVQUFVLENBQVMsRUFBRSxDQUFTOztnQkFDNUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDNUI7Ozs7OztRQUVELGtEQUFrQjs7Ozs7WUFBbEIsVUFBbUIsQ0FBUyxFQUFFLENBQVM7O2dCQUNyQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3pELE9BQU8sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQ2pGOztvQkFqR0ZFLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsbUJBQW1CO3dCQUM3QixzS0FBNkM7O3FCQUU5Qzs7OzBCQUVFSSxVQUFLOzRCQUdMQyxXQUFNOzZCQUdOQyxjQUFTLFNBQUMsUUFBUTtnQ0F5RGxCQyxpQkFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDOztvQ0F2RTVDOzs7Ozs7O0FDQUE7O3lCQVlnQyxJQUFJVCxpQkFBWSxFQUFFOzZCQUduQixLQUFLOzs7OztRQUdsQyw4Q0FBZTs7O1lBQWY7Z0JBQ0UsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2I7Ozs7UUFFRCxtQ0FBSTs7O1lBQUo7Z0JBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZEOztnQkFDRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7O2dCQUM5QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBRWhELElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztnQkFFeEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDaEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDL0MsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRW5DLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFFckIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7b0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDdEI7YUFDRjs7Ozs7UUFHRCx3Q0FBUzs7OztZQURULFVBQ1UsR0FBZTtnQkFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDeEI7Ozs7O1FBRUQsMENBQVc7Ozs7WUFBWCxVQUFZLEdBQWU7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzFDOzs7OztRQUVELDBDQUFXOzs7O1lBQVgsVUFBWSxHQUFlO2dCQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztvQkFDbEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzFDO2FBQ0Y7Ozs7OztRQUVELHdDQUFTOzs7OztZQUFULFVBQVUsQ0FBUyxFQUFFLENBQVM7O2dCQUM1QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1Qjs7Ozs7O1FBRUQsaURBQWtCOzs7OztZQUFsQixVQUFtQixDQUFTLEVBQUUsQ0FBUzs7Z0JBQ3JDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDekQsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDakY7O29CQW5GRkUsY0FBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxrQkFBa0I7d0JBQzVCLG9LQUE0Qzs7cUJBRTdDOzs7NkJBRUVNLGNBQVMsU0FBQyxRQUFROzRCQUdsQkQsV0FBTTtnQ0E4Q05FLGlCQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7O21DQXpENUM7Ozs7Ozs7QUNBQTs7OztvQkFNQ00sYUFBUSxTQUFDO3dCQUNSLE9BQU8sRUFBRTs0QkFDUEMsbUJBQVk7eUJBQ2I7d0JBQ0QsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUU7d0JBQ2hDLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLG9CQUFvQixDQUFDO3FCQUNsRjs7Z0NBWkQ7Ozs7Ozs7QUNBQTs7OztvQkFhQ0QsYUFBUSxTQUFDO3dCQUNSLE9BQU8sRUFBRSxDQUFDQyxtQkFBWSxFQUFFQyxpQkFBVyxFQUFFQyx5QkFBbUIsRUFBRUMsMEJBQWEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQzt3QkFDckcsWUFBWSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUseUJBQXlCLENBQUM7d0JBQzdHLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO3dCQUM3QixTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxjQUFjLENBQUM7cUJBQ3BEOzs4QkFsQkQ7Ozs7Ozs7Ozs7OztBQ1FBLGdDQUFtQyxTQUFpQixFQUFFLE9BQW9DO1FBQ3hGLE9BQU8sVUFBQyxPQUF3Qjs7WUFDOUIsSUFBTSxjQUFjLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQzs7WUFDbkYsSUFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDOztZQUdwRCxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtnQkFDN0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDekQ7O1lBR0QsSUFBSSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzdCLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNqRDs7WUFHRCxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtnQkFDOUIsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1lBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtnQkFDaEMsT0FBTztvQkFDTCxTQUFTLEVBQUU7d0JBQ1QsYUFBYSxFQUFFLFNBQVM7d0JBQ3hCLFVBQVUsRUFBRSxTQUFTLENBQUMsTUFBTTtxQkFDN0I7aUJBQ0YsQ0FBQzthQUNIO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDYixDQUFDO0tBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==