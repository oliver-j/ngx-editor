/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';
export class ColorSliderComponent {
    constructor() {
        this.color = new EventEmitter();
        this.mousedown = false;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.draw();
    }
    /**
     * @return {?}
     */
    draw() {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d');
        }
        /** @type {?} */
        const width = this.canvas.nativeElement.width;
        /** @type {?} */
        const height = this.canvas.nativeElement.height;
        this.ctx.clearRect(0, 0, width, height);
        /** @type {?} */
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
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
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onMouseUp(evt) {
        this.mousedown = false;
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onMouseDown(evt) {
        this.mousedown = true;
        this.selectedHeight = evt.offsetY;
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onMouseMove(evt) {
        if (this.mousedown) {
            this.selectedHeight = evt.offsetY;
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }
    /**
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    emitColor(x, y) {
        /** @type {?} */
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }
    /**
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    getColorAtPosition(x, y) {
        /** @type {?} */
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}
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
if (false) {
    /** @type {?} */
    ColorSliderComponent.prototype.canvas;
    /** @type {?} */
    ColorSliderComponent.prototype.color;
    /** @type {?} */
    ColorSliderComponent.prototype.ctx;
    /** @type {?} */
    ColorSliderComponent.prototype.mousedown;
    /** @type {?} */
    ColorSliderComponent.prototype.selectedHeight;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3Itc2xpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvY29sb3ItcGlja2VyL2NvbG9yLXNsaWRlci9jb2xvci1zbGlkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWlCLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT3BILE1BQU07O3FCQUswQixJQUFJLFlBQVksRUFBRTt5QkFHbkIsS0FBSzs7Ozs7SUFHbEMsZUFBZTtRQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7O0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkQ7O1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDOztRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O1FBRXhDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUMvQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxzQkFBc0IsQ0FB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QUM7S0FDakY7OztZQW5GRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsb0tBQTRDOzthQUU3Qzs7O3FCQUVFLFNBQVMsU0FBQyxRQUFRO29CQUdsQixNQUFNO3dCQThDTixZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtY29sb3Itc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbG9yLXNsaWRlci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JTbGlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnY2FudmFzJylcbiAgY2FudmFzOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBAT3V0cHV0KClcbiAgY29sb3I6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgbW91c2Vkb3duOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc2VsZWN0ZWRIZWlnaHQ6IG51bWJlcjtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGhlaWdodCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4xNywgJ3JnYmEoMjU1LCAyNTUsIDAsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMzQsICdyZ2JhKDAsIDI1NSwgMCwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MSwgJ3JnYmEoMCwgMjU1LCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNjgsICdyZ2JhKDAsIDAsIDI1NSwgMSknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44NSwgJ3JnYmEoMjU1LCAwLCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwgMCwgMCwgMSknKTtcblxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LnJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RlZEhlaWdodCkge1xuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHgucmVjdCgwLCB0aGlzLnNlbGVjdGVkSGVpZ2h0IC0gNSwgd2lkdGgsIDEwKTtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93Om1vdXNldXAnLCBbJyRldmVudCddKVxuICBvbk1vdXNlVXAoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZWRvd24gPSBmYWxzZTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2dDogTW91c2VFdmVudCkge1xuICAgIHRoaXMubW91c2Vkb3duID0gdHJ1ZTtcbiAgICB0aGlzLnNlbGVjdGVkSGVpZ2h0ID0gZXZ0Lm9mZnNldFk7XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgdGhpcy5lbWl0Q29sb3IoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGV2dDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLm1vdXNlZG93bikge1xuICAgICAgdGhpcy5zZWxlY3RlZEhlaWdodCA9IGV2dC5vZmZzZXRZO1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB0aGlzLmVtaXRDb2xvcihldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXRDb2xvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IHJnYmFDb2xvciA9IHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHgsIHkpO1xuICAgIHRoaXMuY29sb3IuZW1pdChyZ2JhQ29sb3IpO1xuICB9XG5cbiAgZ2V0Q29sb3JBdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpLmRhdGE7XG4gICAgcmV0dXJuICdyZ2JhKCcgKyBpbWFnZURhdGFbMF0gKyAnLCcgKyBpbWFnZURhdGFbMV0gKyAnLCcgKyBpbWFnZURhdGFbMl0gKyAnLDEpJztcbiAgfVxufVxuIl19