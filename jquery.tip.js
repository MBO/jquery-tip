/**
 * Author: Mirosław Boruta <boruta.miroslaw@gmail.com>
 *
 * Functions:
 *   open
 *   close
 *   widget
 *   destroy
 * Events:
 *   open
 *   close
 * Options:
 *   autoOpen[true] - if this tip should be open after create
 *   text[null] - text to be displayed inside tip can be:
 *      string - insert string inside tip
 *      jQuery/Node element - append inside tip
 *      function - call in context of actual element and take resulting string or jQuery/Node element
 *   closeText["close"] - text to place in close link
 *   tipClass[""] - additional classes to add to tip widget
 *   hide[null] - jquery-type duration for hide animation
 *   show[null] - jqyery-type duration for show animation
 *   position["right"] - type of position for widget, possible values:
 *          topleft  +---------+  topright
 *             left  | element |  right
 *       bottomleft  +---------+  bottomright
 *   horizontalOffset[0] - number of pixels to move tip widget border out of element
 */
(function($){

var uiTipClasses =
  "ui-tip " +
  "ui-widget " +
  "ui-widget-content " +
  "ui-corner-all ";

$.widget("ui.tip", {
    options: {
        autoOpen: true,
        text: null
        closeText: "close",
        tipClass: "",
        hide: null,
        show: null,
        position: 'right',
        horizontalOffset: 0
    },
    _create: function() {
        var self = this,
            options = self.options;

        var uiTip = (self.uiTip = $("<div/>"))
                .appendTo(document.body)
                .hide()
                .addClass(uiTipClasses + options.tipClass + " ui-tip-"+options.position),

            uiTipContent = $("<div/>")
                .append($.isFunction(self.options.text)
                    ? self.options.text.call(self.element)
                    : self.options.text)
                .addClass("ui-tip-content ui-widget-content")
                .appendTo(uiTip),

            uiTipTitlebar = $("<div/>")
                .addClass(
                    "ui-tip-titlebar " +
                    "ui-widget-header " +
                    "ui-corner-all " +
                    "ui-helper-clearfix")
                .prependTo(uiTip),

            uiTipTitlebarClose = $('<a href="#"></a>')
                .addClass(
                    "ui-tip-close " +
                    "ui-corner-all")
                .hover(
                    function() { uiTipTitlebarClose.addClass("ui-state-hover"); },
                    function() { uiTipTitlebarClose.removeClass("ui-state-hover"); })
                .focus(function() { uiTipTitlebarClose.addClass("ui-state-focus"); })
                .blur(function() { uiTipTitlebarClose.removeClass("ui-state-focus"); })
                .mousedown(function(event) { event.stopPropagation(); })
                .click(function(event) {
                    self.close(event);
                    return false; })
                .appendTo(uiTipTitlebar),

            uiTipTitlebarCloseText = $("<span/>")
                .addClass(
                    "ui-icon " +
                    "ui-icon-closethick")
                .text(options.closeText)
                .appendTo(uiTipTitlebarClose);

    },
    _init: function() {
        if (this.options.autoOpen) {
            this.open();
        }
    },
    widget: function() {
        return this.uiTip;
    },
    destroy: function() {
        var self = this;
        self.uiTip.hide();
        self.uiTip.remove();
        return self;
    },
    _position: function() {
        var topOffset;
        var leftOffset;
        var zIndex = this.element.zIndex() + 1;
        if (this.options.position.search(/left$/) > -1) {
            leftOffset = this.element.offset().left - this.uiTip.outerWidth() - this.options.horizontalOffset;
        } else {
            leftOffset = this.element.offset().left + this.element.outerWidth() + this.options.horizontalOffset;
        }
        if (this.options.position.search(/^top/) > -1) {
            topOffset = this.element.offset().top;
        } else if (this.options.position.search(/^bottom/) > -1) {
            topOffset = this.element.offset().top + this.element.outerHeight() - this.uiTip.outerHeight();
        } else {
            topOffset = this.element.offset().top + (this.element.outerHeight() - this.uiTip.outerHeight())/2;
        }
        
        this.uiTip.css({
            position: "absolute",
            top: topOffset,
            left: leftOffset,
            zIndex: zIndex
        });
    },
    open: function() {
        var self = this;
        self._position();
        self.uiTip.show(self.options.show, function() { self._trigger("open") });
        return self;
    },
    close: function() {
        var self = this;
        self.uiTip.hide(self.options.hide, function() { self._trigger("close") });
        return self;
    }
});

})(jQuery);

