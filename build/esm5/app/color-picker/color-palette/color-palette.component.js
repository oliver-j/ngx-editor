/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
export { ColorPaletteComponent };
if (false) {
    /** @type {?} */
    ColorPaletteComponent.prototype.hue;
    /** @type {?} */
    ColorPaletteComponent.prototype.color;
    /** @type {?} */
    ColorPaletteComponent.prototype.canvas;
    /** @type {?} */
    ColorPaletteComponent.prototype.ctx;
    /** @type {?} */
    ColorPaletteComponent.prototype.mousedown;
    /** @type {?} */
    ColorPaletteComponent.prototype.selectedPosition;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL2NvbG9yLXBpY2tlci9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWlCLEtBQUssRUFBRSxNQUFNLEVBQTRCLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7OztxQkFZckgsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDO3lCQU92QixLQUFLOzs7OztJQUlsQywrQ0FBZTs7O0lBQWY7UUFDRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7OztJQUVELG9DQUFJOzs7SUFBSjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkQ7O1FBQ0QsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDOztRQUM5QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQztRQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7UUFFdkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztR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LE9BQU8sRUFBRSxDQUFDO1lBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUM7S0FDRjs7Ozs7O0lBRUQseUNBQVM7Ozs7O0lBQVQsVUFBVSxDQUFTLEVBQUUsQ0FBUzs7UUFDNUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM1Qjs7Ozs7O0lBRUQsa0RBQWtCOzs7OztJQUFsQixVQUFtQixDQUFTLEVBQUUsQ0FBUzs7UUFDckMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3pELE9BQU8sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ2pGOztnQkFqR0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLHNLQUE2Qzs7aUJBRTlDOzs7c0JBRUUsS0FBSzt3QkFHTCxNQUFNO3lCQUdOLFNBQVMsU0FBQyxRQUFROzRCQXlEbEIsWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDOztnQ0F2RTVDOztTQU9hLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1jb2xvci1wYWxldHRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBhbGV0dGVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBodWU6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcblxuICBAVmlld0NoaWxkKCdjYW52YXMnKVxuICBjYW52YXM6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcHJpdmF0ZSBtb3VzZWRvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgc2VsZWN0ZWRQb3NpdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodDtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuaHVlIHx8ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJztcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHdoaXRlR3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHdpZHRoLCAwKTtcbiAgICB3aGl0ZUdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG4gICAgd2hpdGVHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gd2hpdGVHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgYmxhY2tHcmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgaGVpZ2h0KTtcbiAgICBibGFja0dyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgYmxhY2tHcmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwxKScpO1xuXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmxhY2tHcmFkO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbikge1xuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHguYXJjKHRoaXMuc2VsZWN0ZWRQb3NpdGlvbi54LCB0aGlzLnNlbGVjdGVkUG9zaXRpb24ueSwgMTAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ2h1ZSddKSB7XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMuc2VsZWN0ZWRQb3NpdGlvbjtcbiAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgdGhpcy5jb2xvci5lbWl0KHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHBvcy54LCBwb3MueSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZVVwKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gZmFsc2U7XG4gIH1cblxuICBvbk1vdXNlRG93bihldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFBvc2l0aW9uID0geyB4OiBldnQub2Zmc2V0WCwgeTogZXZ0Lm9mZnNldFkgfTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgICB0aGlzLmNvbG9yLmVtaXQodGhpcy5nZXRDb2xvckF0UG9zaXRpb24oZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3VzZWRvd24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRQb3NpdGlvbiA9IHsgeDogZXZ0Lm9mZnNldFgsIHk6IGV2dC5vZmZzZXRZIH07XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIHRoaXMuZW1pdENvbG9yKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XG4gICAgfVxuICB9XG5cbiAgZW1pdENvbG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmdiYUNvbG9yID0gdGhpcy5nZXRDb2xvckF0UG9zaXRpb24oeCwgeSk7XG4gICAgdGhpcy5jb2xvci5lbWl0KHJnYmFDb2xvcik7XG4gIH1cblxuICBnZXRDb2xvckF0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBjb25zdCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoeCwgeSwgMSwgMSkuZGF0YTtcbiAgICByZXR1cm4gJ3JnYmEoJyArIGltYWdlRGF0YVswXSArICcsJyArIGltYWdlRGF0YVsxXSArICcsJyArIGltYWdlRGF0YVsyXSArICcsMSknO1xuICB9XG59XG4iXX0=