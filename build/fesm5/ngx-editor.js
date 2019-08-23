import { Injectable, Component, Input, Output, ViewChild, EventEmitter, Renderer2, forwardRef, HostListener, NgModule } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NG_VALUE_ACCESSOR, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';

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
            var req = new HttpRequest('POST', endPoint, formData, {
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
        { type: Injectable }
    ];
    /** @nocollapse */
    CommandExecutorService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
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
        this.message = new Subject();
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
        { type: Injectable }
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
        this.blur = new EventEmitter();
        /**
         * emits `focus` event when focused in to the textarea
         */
        this.focus = new EventEmitter();
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
        { type: Component, args: [{
                    selector: 'app-ngx-editor',
                    template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\"\n      [style.minHeight]=\"config['minHeight']\" [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\"\n      (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxEditorComponent; }),
                            multi: true
                        }],
                    styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorComponent.ctorParameters = function () { return [
        { type: MessageService },
        { type: CommandExecutorService },
        { type: Renderer2 }
    ]; };
    NgxEditorComponent.propDecorators = {
        editable: [{ type: Input }],
        spellcheck: [{ type: Input }],
        placeholder: [{ type: Input }],
        translate: [{ type: Input }],
        height: [{ type: Input }],
        minHeight: [{ type: Input }],
        width: [{ type: Input }],
        minWidth: [{ type: Input }],
        toolbar: [{ type: Input }],
        resizer: [{ type: Input }],
        config: [{ type: Input }],
        showToolbar: [{ type: Input }],
        enableToolbar: [{ type: Input }],
        imageEndPoint: [{ type: Input }],
        blur: [{ type: Output }],
        focus: [{ type: Output }],
        textArea: [{ type: ViewChild, args: ['ngxTextArea',] }],
        ngxWrapper: [{ type: ViewChild, args: ['ngxWrapper',] }]
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
        { type: Component, args: [{
                    selector: 'app-ngx-grippie',
                    template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                    styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
                }] }
    ];
    /** @nocollapse */
    NgxGrippieComponent.ctorParameters = function () { return [
        { type: NgxEditorComponent }
    ]; };
    NgxGrippieComponent.propDecorators = {
        onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
        onMouseUp: [{ type: HostListener, args: ['document:mouseup', ['$event'],] }],
        onResize: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
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
        { type: Component, args: [{
                    selector: 'app-ngx-editor-message',
                    template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
                    styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorMessageComponent.ctorParameters = function () { return [
        { type: MessageService }
    ]; };
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
        this.execute = new EventEmitter();
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
            urlLink: ['', [Validators.required]],
            urlText: ['', [Validators.required]],
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
            imageUrl: ['', [Validators.required]]
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
            videoUrl: ['', [Validators.required]],
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
                    if (event instanceof HttpResponse) {
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
        { type: Component, args: [{
                    selector: 'app-ngx-editor-toolbar',
                    template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\" (click)=\"triggerCommand('bold')\"\n      title=\"Fett\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\" (click)=\"triggerCommand('italic')\"\n      title=\"Kursiv\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\" (click)=\"triggerCommand('underline')\"\n      title=\"Unterstrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\" (click)=\"triggerCommand('strikeThrough')\"\n      title=\"Durchgestrichen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\" (click)=\"triggerCommand('superscript')\"\n      title=\"Superskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\" (click)=\"triggerCommand('subscript')\"\n      title=\"Subskript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n      title=\"Schriftart\" [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n      title=\"Schriftgr\u00F6\u00DFe\" [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n      title=\"Farbe\" [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\" (click)=\"triggerCommand('justifyLeft')\"\n      title=\"Linksb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\" (click)=\"triggerCommand('justifyCenter')\"\n      title=\"Zentriert\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\" (click)=\"triggerCommand('justifyRight')\"\n      title=\"Rechtsb\u00FCndig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\" (click)=\"triggerCommand('justifyFull')\"\n      title=\"Blocksatz\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\" (click)=\"triggerCommand('indent')\"\n      title=\"Einr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\" (click)=\"triggerCommand('outdent')\"\n      title=\"Ausr\u00FCcken\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\" (click)=\"triggerCommand('cut')\"\n      title=\"Ausschneiden\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\" (click)=\"triggerCommand('copy')\"\n      title=\"Kopieren\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-files-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\" (click)=\"triggerCommand('delete')\"\n      title=\"L\u00F6schen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\" (click)=\"triggerCommand('removeFormat')\"\n      title=\"Formatierung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\" (click)=\"triggerCommand('undo')\"\n      title=\"R\u00FCckg\u00E4ngig\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\" (click)=\"triggerCommand('redo')\"\n      title=\"Wiederholen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\" (click)=\"triggerCommand('insertParagraph')\"\n      title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\" (click)=\"triggerCommand('blockquote')\"\n      title=\"Blockzitat\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\" (click)=\"triggerCommand('removeBlockquote')\"\n      title=\"Blockzitat entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\" (click)=\"triggerCommand('insertHorizontalRule')\"\n      title=\"Horizontale Linie\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\" (click)=\"triggerCommand('insertUnorderedList')\"\n      title=\"Ungeordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\" (click)=\"triggerCommand('insertOrderedList')\"\n      title=\"Geordnete Liste\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n      [popover]=\"insertLinkTemplate\" title=\"Verlinkung einf\u00FCgen\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\" (click)=\"triggerCommand('unlink')\"\n      title=\"Verlinkung entfernen\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n      title=\"Bild\" [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n      title=\"Video\" [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n      [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fa fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n          required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">In neuem Tab \u00F6ffnen</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fa fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"> </div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"> </div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Bild w\u00E4hlen</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Wird hochgeladen</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\" [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n              required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\" [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n          [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n            required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"H\u00F6he (px)\" pattern=\"[0-9]\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"Breite (px)\" pattern=\"[0-9]\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">OK</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Textfarbe</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Hintergrundfarbe</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <app-color-picker #cpicker></app-color-picker>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(cpicker.color, selectedColorTab)\">OK</button>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Schriftgr\u00F6\u00DFe</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Schriftgr\u00F6\u00DFe in px/rem\"\n          [(ngModel)]=\"fontSize\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Schriftart</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\" placeholder=\"Zum Beispiel: 'Times New Roman', Times, serif\"\n          [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">OK</button>\n    </form>\n  </div>\n</ng-template>\n",
                    providers: [PopoverConfig],
                    styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{display:flex;flex-wrap:wrap;background-color:#f5f5f5;font-size:.8rem;padding:.2rem .2rem 0;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:flex;border-radius:5px;background-color:#fff;margin-right:.2rem;margin-bottom:.2rem}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;display:inline-flex;justify-content:center;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorToolbarComponent.ctorParameters = function () { return [
        { type: PopoverConfig },
        { type: FormBuilder },
        { type: MessageService },
        { type: CommandExecutorService }
    ]; };
    NgxEditorToolbarComponent.propDecorators = {
        config: [{ type: Input }],
        urlPopover: [{ type: ViewChild, args: ['urlPopover',] }],
        imagePopover: [{ type: ViewChild, args: ['imagePopover',] }],
        videoPopover: [{ type: ViewChild, args: ['videoPopover',] }],
        fontSizePopover: [{ type: ViewChild, args: ['fontSizePopover',] }],
        colorPopover: [{ type: ViewChild, args: ['colorPopover',] }],
        execute: [{ type: Output }]
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
        { type: Component, args: [{
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
        this.color = new EventEmitter(true);
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
        { type: Component, args: [{
                    selector: 'app-color-palette',
                    template: "<canvas #canvas class=\"color-palette\" width=\"250\" height=\"250\" (mousedown)=\"onMouseDown($event)\" (mousemove)=\"onMouseMove($event)\">\n</canvas>\n",
                    styles: [".color-palette:hover{cursor:pointer}:host{width:250px;height:250px;display:block}"]
                }] }
    ];
    ColorPaletteComponent.propDecorators = {
        hue: [{ type: Input }],
        color: [{ type: Output }],
        canvas: [{ type: ViewChild, args: ['canvas',] }],
        onMouseUp: [{ type: HostListener, args: ['window:mouseup', ['$event'],] }]
    };
    return ColorPaletteComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ColorSliderComponent = /** @class */ (function () {
    function ColorSliderComponent() {
        this.color = new EventEmitter();
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
        { type: Component, args: [{
                    selector: 'app-color-slider',
                    template: "<canvas #canvas class=\"color-slider\" width=\"50\" height=\"250\" (mousedown)=\"onMouseDown($event)\" (mousemove)=\"onMouseMove($event)\">\n</canvas>\n",
                    styles: [".color-slider:hover{cursor:pointer}"]
                }] }
    ];
    ColorSliderComponent.propDecorators = {
        canvas: [{ type: ViewChild, args: ['canvas',] }],
        color: [{ type: Output }],
        onMouseUp: [{ type: HostListener, args: ['window:mouseup', ['$event'],] }]
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
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
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
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule.forRoot(), ColorPickerModule],
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

export { NgxEditorModule, MaxLengthValidator, ColorPaletteComponent as ɵc, ColorPickerComponent as ɵb, ColorPickerModule as ɵa, ColorSliderComponent as ɵd, CommandExecutorService as ɵg, MessageService as ɵf, NgxEditorMessageComponent as ɵi, NgxEditorToolbarComponent as ɵj, NgxEditorComponent as ɵe, NgxGrippieComponent as ɵh };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWdyaXBwaWUvbmd4LWdyaXBwaWUuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItbWVzc2FnZS9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBhbGV0dGUvY29sb3ItcGFsZXR0ZS5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL2NvbG9yLXBpY2tlci9jb2xvci1zbGlkZXIvY29sb3Itc2xpZGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5tb2R1bGUudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5tb2R1bGUudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvdmFsaWRhdG9ycy9tYXhsZW5ndGgtdmFsaWRhdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZW5hYmxlIG9yIGRpc2FibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIHRvb2xiYXIgaXRlbVxuICogQHBhcmFtIHRvb2xiYXIgdG9vbGJhciBjb25maWd1cmF0aW9uIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWU6IHN0cmluZywgdG9vbGJhcjogYW55KTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSkge1xuICAgIGlmICh0b29sYmFyWydsZW5ndGgnXSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gdG9vbGJhci5maWx0ZXIoYXJyYXkgPT4ge1xuICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBmb3VuZC5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIHNldCBlZGl0b3IgY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSBjb25maWd1cmF0aW9uIHZpYSBbY29uZmlnXSBwcm9wZXJ0eVxuICogQHBhcmFtIG5neEVkaXRvckNvbmZpZyBkZWZhdWx0IGVkaXRvciBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gaW5wdXQgZGlyZWN0IGNvbmZpZ3VyYXRpb24gaW5wdXRzIHZpYSBkaXJlY3RpdmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3JDb25maWd1cmF0aW9uKHZhbHVlOiBhbnksIG5neEVkaXRvckNvbmZpZzogYW55LCBpbnB1dDogYW55KTogYW55IHtcbiAgZm9yIChjb25zdCBpIGluIG5neEVkaXRvckNvbmZpZykge1xuICAgIGlmIChpKSB7XG4gICAgICBpZiAoaW5wdXRbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZVtpXSA9IGlucHV0W2ldO1xuICAgICAgfVxuICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICB2YWx1ZVtpXSA9IG5neEVkaXRvckNvbmZpZ1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogcmV0dXJuIHZlcnRpY2FsIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByZXNpemVyIHByb3BlcnR5IGlzIHNldCB0byBiYXNpY1xuICpcbiAqIEBwYXJhbSByZXNpemVyIHR5cGUgb2YgcmVzaXplciwgZWl0aGVyIGJhc2ljIG9yIHN0YWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXNpemUocmVzaXplcjogc3RyaW5nKTogYW55IHtcbiAgaWYgKHJlc2l6ZXIgPT09ICdiYXNpYycpIHtcbiAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogc2F2ZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVNlbGVjdGlvbigpOiBhbnkge1xuICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoc2VsLmdldFJhbmdlQXQgJiYgc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgIHJldHVybiBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIGRvY3VtZW50LmNyZWF0ZVJhbmdlKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogcmVzdG9yZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIGluXG4gKlxuICogQHBhcmFtIHJhbmdlIHNhdmVkIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgb3V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlU2VsZWN0aW9uKHJhbmdlKTogYm9vbGVhbiB7XG4gIGlmIChyYW5nZSkge1xuICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24gJiYgcmFuZ2Uuc2VsZWN0KSB7XG4gICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIHtcbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXG4gIHNhdmVkU2VsZWN0aW9uOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBfaHR0cCBIVFRQIENsaWVudCBmb3IgbWFraW5nIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIC8qKlxuICAgKiBleGVjdXRlcyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgY29tbWFuZCAhPT0gJ2VuYWJsZU9iamVjdFJlc2l6aW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgRWRpdG9yJyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdlbmFibGVPYmplY3RSZXNpemluZycsIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAnYmxvY2txdW90ZScpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnYmxvY2txdW90ZScpO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAncmVtb3ZlQmxvY2txdW90ZScpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnZGl2Jyk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoY29tbWFuZCwgZmFsc2UsIG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2VVUkkgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0SW1hZ2UoaW1hZ2VVUkk6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBpZiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBjb25zdCBpbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRJbWFnZScsIGZhbHNlLCBpbWFnZVVSSSk7XG4gICAgICAgICAgaWYgKCFpbnNlcnRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFVSTCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tlaW5lIFRleHRzdGVsbGUgYXVzZ2V3w4PCpGhsdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXG4gKlxuICogQHBhcmFtIHZpZGVQYXJhbXMgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxuICovXG4gIGluc2VydFZpZGVvKHZpZGVQYXJhbXM6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBpZiAodmlkZVBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzWW91dHViZUxpbmsodmlkZVBhcmFtcy52aWRlb1VybCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHlvdXR1YmVVUkwgPSAnPGlmcmFtZSB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgKyAnc3JjPVwiJyArIHZpZGVQYXJhbXMudmlkZW9VcmwgKyAnXCI+PC9pZnJhbWU+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh5b3V0dWJlVVJMKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hlY2tUYWdTdXBwb3J0SW5Ccm93c2VyKCd2aWRlbycpKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWRVUkwodmlkZVBhcmFtcy52aWRlb1VybCkpIHtcbiAgICAgICAgICAgICAgY29uc3QgdmlkZW9TcmMgPSAnPHZpZGVvIHdpZHRoPVwiJyArIHZpZGVQYXJhbXMud2lkdGggKyAnXCIgaGVpZ2h0PVwiJyArIHZpZGVQYXJhbXMuaGVpZ2h0ICsgJ1wiJ1xuICAgICAgICAgICAgICAgICsgJyBjb250cm9scz1cInRydWVcIj48c291cmNlIHNyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvdmlkZW8+JztcbiAgICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKHZpZGVvU3JjKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2aWRlbyBVUkwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBpbnNlcnQgdmlkZW8nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY2hlY2tzIHRoZSBpbnB1dCB1cmwgaXMgYSB2YWxpZCB5b3V0dWJlIFVSTCBvciBub3RcbiAgICpcbiAgICogQHBhcmFtIHVybCBZb3V0dWUgVVJMXG4gICAqL1xuICBwcml2YXRlIGlzWW91dHViZUxpbmsodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCB5dFJlZ0V4cCA9IC9eKGh0dHAocyk/OlxcL1xcLyk/KCh3KXszfS4pP3lvdXR1KGJlfC5iZSk/KFxcLmNvbSk/XFwvLisvO1xuICAgIHJldHVybiB5dFJlZ0V4cC50ZXN0KHVybCk7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgd2hldGhlciB0aGUgc3RyaW5nIGlzIGEgdmFsaWQgdXJsIG9yIG5vdFxuICAgKiBAcGFyYW0gdXJsIHVybFxuICAgKi9cbiAgcHJpdmF0ZSBpc1ZhbGlkVVJMKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXJsUmVnRXhwID0gLyhodHRwfGh0dHBzKTpcXC9cXC8oXFx3Kzp7MCwxfVxcdyopPyhcXFMrKSg6WzAtOV0rKT8oXFwvfFxcLyhbXFx3IyE6Lj8rPSYlIVxcLVxcL10pKT8vO1xuICAgIHJldHVybiB1cmxSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwbG9hZHMgaW1hZ2UgdG8gdGhlIHNlcnZlclxuICAgKlxuICAgKiBAcGFyYW0gZmlsZSBmaWxlIHRoYXQgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqIEBwYXJhbSBlbmRQb2ludCBlbnBvaW50IHRvIHdoaWNoIHRoZSBpbWFnZSBoYXMgdG8gYmUgdXBsb2FkZWRcbiAgICovXG4gIHVwbG9hZEltYWdlKGZpbGU6IEZpbGUsIGVuZFBvaW50OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICghZW5kUG9pbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgRW5kcG9pbnQgaXNuYHQgcHJvdmlkZWQgb3IgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgaWYgKGZpbGUpIHtcblxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cbiAgICAgIGNvbnN0IHJlcSA9IG5ldyBIdHRwUmVxdWVzdCgnUE9TVCcsIGVuZFBvaW50LCBmb3JtRGF0YSwge1xuICAgICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9odHRwLnJlcXVlc3QocmVxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSW1hZ2UnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBsaW5rIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyBwYXJhbWV0ZXJzIHRoYXQgaG9sZHMgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgbGlua1xuICAgKi9cbiAgY3JlYXRlTGluayhwYXJhbXM6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGNoZWNrIHdoZXRoZXIgdGhlIHNhdmVkIHNlbGVjdGlvbiBjb250YWlucyBhIHJhbmdlIG9yIHBsYWluIHNlbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xuICAgICAgICBjb25zdCBuZXdVcmwgPSAnPGEgaHJlZj1cIicgKyBwYXJhbXMudXJsTGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgcGFyYW1zLnVybFRleHQgKyAnPC9hPic7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcbiAgICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjcmVhdGVMaW5rJywgZmFsc2UsIHBhcmFtcy51cmxMaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tlaW5lIFRleHRzdGVsbGUgYXVzZ2V3w4PCpGhsdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnQgY29sb3IgZWl0aGVyIGZvbnQgb3IgYmFja2dyb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gY29sb3IgY29sb3IgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIHdoZXJlIHdoZXJlIHRoZSBjb2xvciBoYXMgdG8gYmUgaW5zZXJ0ZWQgZWl0aGVyIHRleHQvYmFja2dyb3VuZFxuICAgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICBpZiAocmVzdG9yZWQgJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICAgIGlmICh3aGVyZSA9PT0gJ3RleHRDb2xvcicpIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9yZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaGlsaXRlQ29sb3InLCBmYWxzZSwgY29sb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCBmb250IHNpemUgZm9yIHRleHRcbiAgICpcbiAgICogQHBhcmFtIGZvbnRTaXplIGZvbnQtc2l6ZSB0byBiZSBzZXRcbiAgICovXG4gIHNldEZvbnRTaXplKGZvbnRTaXplOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udFNpemUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS2VpbmUgVGV4dHN0ZWxsZSBhdXNnZXfDg8KkaGx0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCBmb250IG5hbWUvZmFtaWx5IGZvciB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSBmb250TmFtZSBmb250LWZhbWlseSB0byBiZSBzZXRcbiAgICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udE5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250RmFtaWx5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBUZXh0c3RlbGxlIGF1c2dld8ODwqRobHQnKTtcbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IEhUTUwgKi9cbiAgcHJpdmF0ZSBpbnNlcnRIdG1sKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGlzSFRNTEluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgaHRtbCk7XG5cbiAgICBpZiAoIWlzSFRNTEluc2VydGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb24nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgYSBudW1iZXIgb3Igc3RyaW5nXG4gICAqIGlmIG51bWJlciByZXR1cm4gdHJ1ZVxuICAgKiBlbHNlIHJldHVybiBmYWxzZVxuICAgKi9cbiAgcHJpdmF0ZSBpc051bWVyaWModmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXi17MCwxfVxcZCskLy50ZXN0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBkZWxldGUgdGhlIHRleHQgYXQgc2VsZWN0ZWQgcmFuZ2UgYW5kIHJldHVybiB0aGUgdmFsdWUgKi9cbiAgcHJpdmF0ZSBkZWxldGVBbmRHZXRFbGVtZW50KCk6IGFueSB7XG4gICAgbGV0IHNsZWN0ZWRUZXh0O1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuICAgICAgdGhpcy5zYXZlZFNlbGVjdGlvbi5kZWxldGVDb250ZW50cygpO1xuICAgICAgcmV0dXJuIHNsZWN0ZWRUZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBjaGVjayBhbnkgc2xlY3Rpb24gaXMgbWFkZSBvciBub3QgKi9cbiAgcHJpdmF0ZSBjaGVja1NlbGVjdGlvbigpOiBhbnkge1xuICAgIGNvbnN0IHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuXG4gICAgaWYgKHNsZWN0ZWRUZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBTZWxlY3Rpb24gTWFkZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHRhZyBpcyBzdXBwb3J0ZWQgYnkgYnJvd3NlciBvciBub3RcbiAgICpcbiAgICogQHBhcmFtIHRhZyBIVE1MIHRhZ1xuICAgKi9cbiAgcHJpdmF0ZSBjaGVja1RhZ1N1cHBvcnRJbkJyb3dzZXIodGFnOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZykgaW5zdGFuY2VvZiBIVE1MVW5rbm93bkVsZW1lbnQpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuXG4vKiogdGltZSBpbiB3aGljaCB0aGUgbWVzc2FnZSBoYXMgdG8gYmUgY2xlYXJlZCAqL1xuY29uc3QgRFVSQVRJT04gPSA3MDAwO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZVNlcnZpY2Uge1xuICAvKiogdmFyaWFibGUgdG8gaG9sZCB0aGUgdXNlciBtZXNzYWdlICovXG4gIHByaXZhdGUgbWVzc2FnZTogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIC8qKiByZXR1cm5zIHRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIGVkaXRvciAqL1xuICBnZXRNZXNzYWdlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kcyBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2UgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBzZW5kTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1lc3NhZ2UubmV4dChtZXNzYWdlKTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZUluKERVUkFUSU9OKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhIHNob3J0IGludGVydmFsIHRvIGNsZWFyIG1lc3NhZ2VcbiAgICpcbiAgICogQHBhcmFtIG1pbGxpc2Vjb25kcyB0aW1lIGluIHNlY29uZHMgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWRcbiAgICovXG4gIHByaXZhdGUgY2xlYXJNZXNzYWdlSW4obWlsbGlzZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZS5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSwgbWlsbGlzZWNvbmRzKTtcbiAgfVxufVxuIiwiLyoqXG4gKiB0b29sYmFyIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY29uc3Qgbmd4RWRpdG9yQ29uZmlnID0ge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgc3BlbGxjaGVjazogdHJ1ZSxcbiAgaGVpZ2h0OiAnYXV0bycsXG4gIG1pbkhlaWdodDogJzAnLFxuICB3aWR0aDogJ2F1dG8nLFxuICBtaW5XaWR0aDogJzAnLFxuICB0cmFuc2xhdGU6ICd5ZXMnLFxuICBlbmFibGVUb29sYmFyOiB0cnVlLFxuICBzaG93VG9vbGJhcjogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB0ZXh0IGhlcmUuLi4nLFxuICBpbWFnZUVuZFBvaW50OiAnJyxcbiAgdG9vbGJhcjogW1xuICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3VwZXJzY3JpcHQnLCAnc3Vic2NyaXB0J10sXG4gICAgWydmb250TmFtZScsICdmb250U2l6ZScsICdjb2xvciddLFxuICAgIFsnanVzdGlmeUxlZnQnLCAnanVzdGlmeUNlbnRlcicsICdqdXN0aWZ5UmlnaHQnLCAnanVzdGlmeUZ1bGwnLCAnaW5kZW50JywgJ291dGRlbnQnXSxcbiAgICBbJ2N1dCcsICdjb3B5JywgJ2RlbGV0ZScsICdyZW1vdmVGb3JtYXQnLCAndW5kbycsICdyZWRvJ10sXG4gICAgWydwYXJhZ3JhcGgnLCAnYmxvY2txdW90ZScsICdyZW1vdmVCbG9ja3F1b3RlJywgJ2hvcml6b250YWxMaW5lJywgJ29yZGVyZWRMaXN0JywgJ3Vub3JkZXJlZExpc3QnXSxcbiAgICBbJ2xpbmsnLCAndW5saW5rJywgJ2ltYWdlJywgJ3ZpZGVvJ11cbiAgXVxufTtcbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuaW1wb3J0IHsgbmd4RWRpdG9yQ29uZmlnIH0gZnJvbSAnLi9jb21tb24vbmd4LWVkaXRvci5kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3InLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3IuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neEVkaXRvckNvbXBvbmVudCksXG4gICAgbXVsdGk6IHRydWVcbiAgfV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cbiAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XG4gIC8qKiBUaGUgc3BlbGxjaGVjayBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgZWxlbWVudCBpcyB0byBoYXZlIGl0cyBzcGVsbGluZyBhbmQgZ3JhbW1hciBjaGVja2VkIG9yIG5vdC4gKi9cbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcbiAgLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgdGV4dEFyZWEgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0cmFuc2xhdGUgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudCBzaG91bGQgYmUgdHJhbnNsYXRlZCBvciBub3QuXG4gICAqXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxuICAgKi9cbiAgQElucHV0KCkgdHJhbnNsYXRlOiBzdHJpbmc7XG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIGhlaWdodCBmb3IgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgV2lkdGggb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluV2lkdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQ2hlY2sgbmd4RWRpdG9yQ29uZmlnIGZvciB0b29sYmFyIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIGVuYWJsZSBhbGwgdG9vbGJhclxuICAgKi9cbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xuICAvKipcbiAgICogVGhlIGVkaXRvciBjYW4gYmUgcmVzaXplZCB2ZXJ0aWNhbGx5LlxuICAgKlxuICAgKiBgYmFzaWNgIHJlc2l6ZXIgZW5hYmxlcyB0aGUgaHRtbDUgcmVzemllci4gQ2hlY2sgaGVyZSBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2Nzc3JlZi9jc3MzX3ByX3Jlc2l6ZS5hc3BcbiAgICpcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cbiAgICovXG4gIEBJbnB1dCgpIHJlc2l6ZXIgPSAnc3RhY2snO1xuICAvKipcbiAgICogVGhlIGNvbmZpZyBwcm9wZXJ0eSBpcyBhIEpTT04gb2JqZWN0XG4gICAqXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXG4gICAqIGlucHV0cyBwcm92aWRlZCBkaXJlY3RseSBhcmUgY29uc2lkZXJlZCBhcyB0b3AgcHJpb3JpdHlcbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcbiAgLyoqIFdlYXRoZXIgdG8gc2hvdyBvciBoaWRlIHRvb2xiYXIgKi9cbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIGVuYWJsZVRvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBFbmRwb2ludCBmb3Igd2hpY2ggdGhlIGltYWdlIHRvIGJlIHVwbG9hZGVkICovXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcblxuICAvKiogZW1pdHMgYGJsdXJgIGV2ZW50IHdoZW4gZm9jdXNlZCBvdXQgZnJvbSB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIC8qKiBlbWl0cyBgZm9jdXNgIGV2ZW50IHdoZW4gZm9jdXNlZCBpbiB0byB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGZvY3VzOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ25neFRleHRBcmVhJykgdGV4dEFyZWE6IGFueTtcbiAgQFZpZXdDaGlsZCgnbmd4V3JhcHBlcicpIG5neFdyYXBwZXI6IGFueTtcblxuICBVdGlsczogYW55ID0gVXRpbHM7XG5cbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25Ub3VjaGVkOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3IgbWVzc2FnZSBjb21wb25lbnRcbiAgICogQHBhcmFtIF9jb21tYW5kRXhlY3V0b3IgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqIEBwYXJhbSBfcmVuZGVyZXIgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIHRoZSBkb20gZWxlbWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvcjogQ29tbWFuZEV4ZWN1dG9yU2VydmljZSxcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7IH1cblxuICAvKipcbiAgICogZXZlbnRzXG4gICAqL1xuICBvblRleHRBcmVhRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1cy5lbWl0KCdmb2N1cycpO1xuICB9XG5cbiAgLyoqIGZvY3VzIHRoZSB0ZXh0IGFyZWEgd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkICovXG4gIG9uRWRpdG9yRm9jdXMoKSB7XG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZWQgZnJvbSB0aGUgY29udGVudGVkaXRhYmxlIHNlY3Rpb24gd2hpbGUgdGhlIGlucHV0IHByb3BlcnR5IGNoYW5nZXNcbiAgICogQHBhcmFtIGh0bWwgaHRtbCBzdHJpbmcgZnJvbSBjb250ZW50ZWRpdGFibGVcbiAgICovXG4gIG9uQ29udGVudENoYW5nZShpbm5lckhUTUw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkNoYW5nZShpbm5lckhUTUwpO1xuICAgICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcihpbm5lckhUTUwpO1xuICAgIH1cbiAgfVxuXG4gIG9uVGV4dEFyZWFCbHVyKCk6IHZvaWQge1xuICAgIC8qKiBzYXZlIHNlbGVjdGlvbiBpZiBmb2N1c3NlZCBvdXQgKi9cbiAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3Iuc2F2ZWRTZWxlY3Rpb24gPSBVdGlscy5zYXZlU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub25Ub3VjaGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICB0aGlzLmJsdXIuZW1pdCgnYmx1cicpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlc2l6aW5nIHRleHQgYXJlYVxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0WSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIGVpZHRhYmxlIHBvcnRpb24gb2YgdGhlIGVkaXRvclxuICAgKi9cbiAgcmVzaXplVGV4dEFyZWEob2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IG5ld0hlaWdodCA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0LCAxMCk7XG4gICAgbmV3SGVpZ2h0ICs9IG9mZnNldFk7XG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBlZGl0b3IgYWN0aW9ucywgaS5lLiwgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmROYW1lIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLmV4ZWN1dGUoY29tbWFuZE5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcih2YWx1ZSk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICc8YnI+Jykge1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMucmVmcmVzaFZpZXcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSBjaGFuZ2UgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIHRvdWNoIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogcmVmcmVzaCB2aWV3L0hUTUwgb2YgdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgaHRtbCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICByZWZyZXNoVmlldyh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2lubmVySFRNTCcsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIEEgSFRNTCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICB0b2dnbGVQbGFjZWhvbGRlcih2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gJzxicj4nIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMubmd4V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2hvdy1wbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEganNvbiBjb250YWluaW5nIGlucHV0IHBhcmFtc1xuICAgKi9cbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgIGVuYWJsZVRvb2xiYXI6IHRoaXMuZW5hYmxlVG9vbGJhcixcbiAgICAgIHNob3dUb29sYmFyOiB0aGlzLnNob3dUb29sYmFyLFxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxuICAgICAgdG9vbGJhcjogdGhpcy50b29sYmFyXG4gICAgfTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8qKlxuICAgICAqIHNldCBjb25maWd1YXJ0aW9uXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy5leGVjdXRlQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uL25neC1lZGl0b3IuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1ncmlwcGllJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1ncmlwcGllLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEdyaXBwaWVDb21wb25lbnQge1xuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKiBwcmV2aW91cyB2YWx1ZSBiZWZvciByZXNpemluZyB0aGUgZWRpdG9yICovXG4gIG9sZFkgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXG4gIGdyYWJiZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSkgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZ3JhYmJlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VkaXRvckNvbXBvbmVudC5yZXNpemVUZXh0QXJlYShldmVudC5jbGllbnRZIC0gdGhpcy5vbGRZKTtcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBNb3VzZWV2ZW50XG4gICAqXG4gICAqIHNldCB0aGUgZ3JhYmJlciB0byBmYWxzZSBvbiBtb3VzZSB1cCBhY3Rpb25cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmdyYWJiZXIgPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIG9uUmVzaXplKGV2ZW50OiBNb3VzZUV2ZW50LCByZXNpemVyPzogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmdyYWJiZXIgPSB0cnVlO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItbWVzc2FnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQge1xuICAvKiogcHJvcGVydHkgdGhhdCBob2xkcyB0aGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciAqL1xuICBuZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xuICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmdldE1lc3NhZ2UoKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IHN0cmluZykgPT4gdGhpcy5uZ3hNZXNzYWdlID0gbWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXJzIGVkaXRvciBtZXNzYWdlXG4gICAqL1xuICBjbGVhck1lc3NhZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5uZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBQb3BvdmVyQ29uZmlnIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuaW1wb3J0IHtDb2xvclBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi4vLi4vY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci10b29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtQb3BvdmVyQ29uZmlnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgbGluayBmb3JtICovXG4gIHVybEZvcm06IEZvcm1Hcm91cDtcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IGltYWdlIGZvcm0gKi9cbiAgaW1hZ2VGb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCB2aWRlbyBmb3JtICovXG4gIHZpZGVvRm9ybTogRm9ybUdyb3VwO1xuICAvKiogc2V0IHRvIGZhbHNlIHdoZW4gaW1hZ2UgaXMgYmVpbmcgdXBsb2FkZWQgKi9cbiAgdXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAvKiogdXBsb2FkIHBlcmNlbnRhZ2UgKi9cbiAgdXBkbG9hZFBlcmNlbnRhZ2UgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgd2hlbiB0aGUgaW1hZ2UgaXMgYmVpbmcgdXBsb2FkZWQgKi9cbiAgaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgLyoqIHdoaWNoIHRhYiB0byBhY3RpdmUgZm9yIGNvbG9yIGluc2V0aW9uICovXG4gIHNlbGVjdGVkQ29sb3JUYWIgPSAndGV4dENvbG9yJztcbiAgLyoqIGZvbnQgZmFtaWx5IG5hbWUgKi9cbiAgZm9udE5hbWUgPSAnJztcbiAgLyoqIGZvbnQgc2l6ZSAqL1xuICBmb250U2l6ZSA9ICcnO1xuICAvKiogaGV4IGNvbG9yIGNvZGUgKi9cbiAgaGV4Q29sb3IgPSAnJztcbiAgLyoqIHNob3cvaGlkZSBpbWFnZSB1cGxvYWRlciAqL1xuICBpc0ltYWdlVXBsb2FkZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogRWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZzogYW55O1xuICBAVmlld0NoaWxkKCd1cmxQb3BvdmVyJykgdXJsUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnaW1hZ2VQb3BvdmVyJykgaW1hZ2VQb3BvdmVyO1xuICBAVmlld0NoaWxkKCd2aWRlb1BvcG92ZXInKSB2aWRlb1BvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2ZvbnRTaXplUG9wb3ZlcicpIGZvbnRTaXplUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnY29sb3JQb3BvdmVyJykgY29sb3JQb3BvdmVyO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiBhIHRvb2xiYXIgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBleGVjdXRlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BvcE92ZXJDb25maWc6IFBvcG92ZXJDb25maWcsXG4gICAgcHJpdmF0ZSBfZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcbiAgICBwcml2YXRlIF9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlOiBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlKSB7XG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5vdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgIHRoaXMuX3BvcE92ZXJDb25maWcucGxhY2VtZW50ID0gJ2JvdHRvbSc7XG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5jb250YWluZXIgPSAnYm9keSc7XG4gIH1cblxuICAvKipcbiAgICogZW5hYmxlIG9yIGRpYWJsZSB0b29sYmFyIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIG5hbWUgb2YgdGhlIHRvb2xiYXIgYnV0dG9uc1xuICAgKi9cbiAgY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gVXRpbHMuY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWUsIHRoaXMuY29uZmlnWyd0b29sYmFyJ10pO1xuICB9XG5cbiAgLyoqXG4gICAqIHRyaWdnZXJzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhciB0byBiZSBleGVjdXRlZCBhbmQgZW1pdHMgYW4gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgbmFtZSBvZiB0aGUgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgdHJpZ2dlckNvbW1hbmQoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5leGVjdXRlLmVtaXQoY29tbWFuZCk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIFVSTCBpbnNlcnQgZm9ybVxuICAgKi9cbiAgYnVpbGRVcmxGb3JtKCk6IHZvaWQge1xuICAgIHRoaXMudXJsRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHVybExpbms6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIHVybFRleHQ6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIHVybE5ld1RhYjogW3RydWVdXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBsaW5rIGluIHRoZSBlZGl0b3JcbiAgICovXG4gIGluc2VydExpbmsoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuY3JlYXRlTGluayh0aGlzLnVybEZvcm0udmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZFVybEZvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudXJsUG9wb3Zlci5oaWRlKCk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZEltYWdlRm9ybSgpOiB2b2lkIHtcbiAgICB0aGlzLmltYWdlRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIGltYWdlVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgaW5zZXJ0IGltYWdlIGZvcm1cbiAgICovXG4gIGJ1aWxkVmlkZW9Gb3JtKCk6IHZvaWQge1xuICAgIHRoaXMudmlkZW9Gb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgdmlkZW9Vcmw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIGhlaWdodDogWycnXSxcbiAgICAgIHdpZHRoOiBbJyddXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZWQgd2hlbiBmaWxlIGlzIHNlbGVjdGVkXG4gICAqXG4gICAqIEBwYXJhbSBlIG9uQ2hhbmdlIGV2ZW50XG4gICAqL1xuICBvbkZpbGVDaGFuZ2UoZSk6IHZvaWQge1xuICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblxuICAgIGlmIChlLnRhcmdldC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5jb25maWcuaW1hZ2VFbmRQb2ludCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcblxuICAgICAgICAgIGlmIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGxvYWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydEltYWdlKGV2ZW50LmJvZHkudXJsKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBpbnNlcnQgaW1hZ2UgaW4gdGhlIGVkaXRvciAqL1xuICBpbnNlcnRJbWFnZSgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZSh0aGlzLmltYWdlRm9ybS52YWx1ZS5pbWFnZVVybCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cbiAgICB0aGlzLmJ1aWxkSW1hZ2VGb3JtKCk7XG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cbiAgICB0aGlzLmltYWdlUG9wb3Zlci5oaWRlKCk7XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0VmlkZW8oKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0VmlkZW8odGhpcy52aWRlb0Zvcm0udmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZFZpZGVvRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy52aWRlb1BvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgLyoqIGluc2VyIHRleHQvYmFja2dyb3VuZCBjb2xvciAqL1xuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBoZXg6IGFueSA9IGNvbG9yLm1hdGNoKC9ecmdiYT9bXFxzK10/XFwoW1xccytdPyhcXGQrKVtcXHMrXT8sW1xccytdPyhcXGQrKVtcXHMrXT8sW1xccytdPyhcXGQrKVtcXHMrXT8vaSk7XG4gICAgICBoZXggPSAgXCIjXCIgK1xuICAgICAgICAoXCIwXCIgKyBwYXJzZUludChoZXhbMV0sMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpICtcbiAgICAgICAgKFwiMFwiICsgcGFyc2VJbnQoaGV4WzJdLDEwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKSArXG4gICAgICAgIChcIjBcIiArIHBhcnNlSW50KGhleFszXSwxMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydENvbG9yKGhleCwgd2hlcmUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9yUG9wb3Zlci5oaWRlKCk7XG4gIH1cblxuICAvKiogc2V0IGZvbnQgc2l6ZSAqL1xuICBzZXRGb250U2l6ZShmb250U2l6ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2Uuc2V0Rm9udFNpemUoZm9udFNpemUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmZvbnRTaXplUG9wb3Zlci5oaWRlKCk7XG4gIH1cblxuICAvKiogc2V0IGZvbnQgTmFtZS9mYW1pbHkgKi9cbiAgc2V0Rm9udE5hbWUoZm9udE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnROYW1lKGZvbnROYW1lKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5idWlsZFVybEZvcm0oKTtcbiAgICB0aGlzLmJ1aWxkSW1hZ2VGb3JtKCk7XG4gICAgdGhpcy5idWlsZFZpZGVvRm9ybSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWNvbG9yLXBpY2tlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2xvci1waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1waWNrZXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyQ29tcG9uZW50IHtcbiAgcHVibGljIGh1ZTogc3RyaW5nO1xuICBwdWJsaWMgY29sb3I6IHN0cmluZztcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1jb2xvci1wYWxldHRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBhbGV0dGVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBodWU6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcblxuICBAVmlld0NoaWxkKCdjYW52YXMnKVxuICBjYW52YXM6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcHJpdmF0ZSBtb3VzZWRvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgc2VsZWN0ZWRQb3NpdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodDtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuaHVlIHx8ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJztcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHdoaXRlR3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHdpZHRoLCAwKTtcbiAgICB3aGl0ZUdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG4gICAgd2hpdGVHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gd2hpdGVHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgYmxhY2tHcmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgaGVpZ2h0KTtcbiAgICBibGFja0dyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgYmxhY2tHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwxKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmxhY2tHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbikge1xuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHguYXJjKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbi54LCB0aGlzLnNlbGVjdGVkUG9zaXRpb24ueSwgMTAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ2h1ZSddKSB7XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMuc2VsZWN0ZWRQb3NpdGlvbjtcbiAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgdGhpcy5jb2xvci5lbWl0KHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHBvcy54LCBwb3MueSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVVwKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gZmFsc2U7XG4gIH1cblxuICBvbk1vdXNlRG93bihldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFBvc2l0aW9uID0geyB4OiBldnQub2Zmc2V0WCwgeTogZXZ0Lm9mZnNldFkgfTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgICB0aGlzLmNvbG9yLmVtaXQodGhpcy5nZXRDb2xvckF0UG9zaXRpb24oZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3VzZWRvd24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRQb3NpdGlvbiA9IHsgeDogZXZ0Lm9mZnNldFgsIHk6IGV2dC5vZmZzZXRZIH07XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIHRoaXMuZW1pdENvbG9yKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XG4gICAgfVxuICB9XG5cbiAgZW1pdENvbG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmdiYUNvbG9yID0gdGhpcy5nZXRDb2xvckF0UG9zaXRpb24oeCwgeSk7XG4gICAgdGhpcy5jb2xvci5lbWl0KHJnYmFDb2xvcik7XG4gIH1cblxuICBnZXRDb2xvckF0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBjb25zdCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoeCwgeSwgMSwgMSkuZGF0YTtcbiAgICByZXR1cm4gJ3JnYmEoJyArIGltYWdlRGF0YVswXSArICcsJyArIGltYWdlRGF0YVsxXSArICcsJyArIGltYWdlRGF0YVsyXSArICcsMSknO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtY29sb3Itc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JTbGlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnY2FudmFzJylcbiAgY2FudmFzOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgbW91c2Vkb3duOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc2VsZWN0ZWRIZWlnaHQ6IG51bWJlcjtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGhlaWdodCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4xNywgJ3JnYmEoMjU1LCAyNTUsIDAsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMzQsICdyZ2JhKDAsIDI1NSwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MSwgJ3JnYmEoMCwgMjU1LCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNjgsICdyZ2JhKDAsIDAsIDI1NSwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44NSwgJ3JnYmEoMjU1LCAwLCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcblxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LnJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RlZEhlaWdodCkge1xuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHgucmVjdCgwLCB0aGlzLnNlbGVjdGVkSGVpZ2h0IC0gNSwgd2lkdGgsIDEwKTtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93Om1vdXNldXAnLCBbJyRldmVudCddKVxuICBvbk1vdXNlVXAoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZWRvd24gPSBmYWxzZTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gdHJ1ZTtcbiAgICB0aGlzLnNlbGVjdGVkSGVpZ2h0ID0gZXZ0Lm9mZnNldFk7XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgdGhpcy5lbWl0Q29sb3IoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGV2dDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLm1vdXNlZG93bikge1xuICAgICAgdGhpcy5zZWxlY3RlZEhlaWdodCA9IGV2dC5vZmZzZXRZO1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB0aGlzLmVtaXRDb2xvcihldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXRDb2xvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IHJnYmFDb2xvciA9IHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHgsIHkpO1xuICAgIHRoaXMuY29sb3IuZW1pdChyZ2JhQ29sb3IpO1xuICB9XG5cbiAgZ2V0Q29sb3JBdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpLmRhdGE7XG4gICAgcmV0dXJuICdyZ2JhKCcgKyBpbWFnZURhdGFbMF0gKyAnLCcgKyBpbWFnZURhdGFbMV0gKyAnLCcgKyBpbWFnZURhdGFbMl0gKyAnLDEpJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb2xvclBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29sb3ItcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb2xvclBhbGV0dGVDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXBhbGV0dGUvY29sb3ItcGFsZXR0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29sb3JTbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXNsaWRlci9jb2xvci1zbGlkZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbQ29sb3JQaWNrZXJDb21wb25lbnQgXSxcbiAgZGVjbGFyYXRpb25zOiBbQ29sb3JQaWNrZXJDb21wb25lbnQsIENvbG9yUGFsZXR0ZUNvbXBvbmVudCwgQ29sb3JTbGlkZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyTW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBQb3BvdmVyTW9kdWxlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdyaXBwaWVDb21wb25lbnQgfSBmcm9tICcuL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7Q29sb3JQaWNrZXJNb2R1bGV9IGZyb20gJy4uL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFBvcG92ZXJNb2R1bGUuZm9yUm9vdCgpLCBDb2xvclBpY2tlck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW05neEVkaXRvckNvbXBvbmVudCwgTmd4R3JpcHBpZUNvbXBvbmVudCwgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCwgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hFZGl0b3JDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLCBNZXNzYWdlU2VydmljZV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JNb2R1bGUgeyB9XG4iLCJpbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmludGVyZmFjZSBJTWF4TGVuZ3RoVmFsaWRhdG9yT3B0aW9ucyB7XG4gIGV4Y2x1ZGVMaW5lQnJlYWtzPzogYm9vbGVhbjtcbiAgY29uY2F0V2hpdGVTcGFjZXM/OiBib29sZWFuO1xuICBleGNsdWRlV2hpdGVTcGFjZXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTWF4TGVuZ3RoVmFsaWRhdG9yKG1heGxlbmd0aDogbnVtYmVyLCBvcHRpb25zPzogSU1heExlbmd0aFZhbGlkYXRvck9wdGlvbnMpIHtcbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbCA9PiB7XG4gICAgY29uc3QgcGFyc2VkRG9jdW1lbnQgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGNvbnRyb2wudmFsdWUsICd0ZXh0L2h0bWwnKTtcbiAgICBsZXQgaW5uZXJUZXh0ID0gcGFyc2VkRG9jdW1lbnQuYm9keS5pbm5lclRleHQgfHwgJyc7XG5cbiAgICAvLyByZXBsYWNlIGFsbCBsaW5lYnJlYWtzXG4gICAgaWYgKG9wdGlvbnMuZXhjbHVkZUxpbmVCcmVha3MpIHtcbiAgICAgIGlubmVyVGV4dCA9IGlubmVyVGV4dC5yZXBsYWNlKC8oXFxyXFxuXFx0fFxcbnxcXHJcXHQpL2dtLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gY29uY2F0IG11bHRpcGxlIHdoaXRlc3BhY2VzIGludG8gYSBzaW5nbGUgd2hpdGVzcGFjZVxuICAgIGlmIChvcHRpb25zLmNvbmNhdFdoaXRlU3BhY2VzKSB7XG4gICAgICBpbm5lclRleHQgPSBpbm5lclRleHQucmVwbGFjZSgvKFxcc1xccyspL2dtLCAnICcpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBhbGwgd2hpdGVzcGFjZXNcbiAgICBpZiAob3B0aW9ucy5leGNsdWRlV2hpdGVTcGFjZXMpIHtcbiAgICAgIGlubmVyVGV4dCA9IGlubmVyVGV4dC5yZXBsYWNlKC8oXFxzKS9nbSwgJycpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclRleHQubGVuZ3RoID4gbWF4bGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZ3hFZGl0b3I6IHtcbiAgICAgICAgICBhbGxvd2VkTGVuZ3RoOiBtYXhsZW5ndGgsXG4gICAgICAgICAgdGV4dExlbmd0aDogaW5uZXJUZXh0Lmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJVdGlscy5yZXN0b3JlU2VsZWN0aW9uIiwiVXRpbHMuc2F2ZVNlbGVjdGlvbiIsIlV0aWxzLmNhbkVuYWJsZVRvb2xiYXJPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxpQ0FBd0MsS0FBYSxFQUFFLE9BQVk7SUFDakUsSUFBSSxLQUFLLEVBQUU7UUFDVCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7U0FDYjthQUFNOztZQUNMLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLO2dCQUNoQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7U0FDcEM7S0FDRjtTQUFNO1FBQ0wsT0FBTyxLQUFLLENBQUM7S0FDZDtDQUNGOzs7Ozs7Ozs7QUFTRCxnQ0FBdUMsS0FBVSxFQUFFLGVBQW9CLEVBQUUsS0FBVTtJQUNqRixLQUFLLElBQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUMvQixJQUFJLENBQUMsRUFBRTtZQUNMLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNB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