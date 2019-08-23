/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
export class ColorPaletteComponent {
    constructor() {
        this.color = new EventEmitter(true);
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
        this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);
        /** @type {?} */
        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);
        /** @type {?} */
        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
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
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['hue']) {
            this.draw();
            /** @type {?} */
            const pos = this.selectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
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
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onMouseMove(evt) {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL2NvbG9yLXBpY2tlci9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWlCLEtBQUssRUFBRSxNQUFNLEVBQTRCLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPckosTUFBTTs7cUJBSzBCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQzt5QkFPdkIsS0FBSzs7Ozs7SUFJbEMsZUFBZTtRQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7O0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkQ7O1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDOztRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQztRQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7UUFFdkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxT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Q0FBQztZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUM7S0FDRjs7Ozs7O0lBRUQsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTOztRQUM1QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCOzs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUzs7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3pELE9BQU8sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ2pGOzs7WUFqR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLHNLQUE2Qzs7YUFFOUM7OztrQkFFRSxLQUFLO29CQUdMLE1BQU07cUJBR04sU0FBUyxTQUFDLFFBQVE7d0JBeURsQixZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtY29sb3ItcGFsZXR0ZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JQYWxldHRlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KClcbiAgaHVlOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpXG4gIGNvbG9yOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG5cbiAgQFZpZXdDaGlsZCgnY2FudmFzJylcbiAgY2FudmFzOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHByaXZhdGUgbW91c2Vkb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHNlbGVjdGVkUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmh1ZSB8fCAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XG4gICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCB3aGl0ZUdyYWQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCB3aWR0aCwgMCk7XG4gICAgd2hpdGVHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwxKScpO1xuICAgIHdoaXRlR3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHdoaXRlR3JhZDtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IGJsYWNrR3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGhlaWdodCk7XG4gICAgYmxhY2tHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLDAsMCwwKScpO1xuICAgIGJsYWNrR3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMSknKTtcblxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJsYWNrR3JhZDtcbiAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9zaXRpb24pIHtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgIHRoaXMuY3R4LmFyYyh0aGlzLnNlbGVjdGVkUG9zaXRpb24ueCwgdGhpcy5zZWxlY3RlZFBvc2l0aW9uLnksIDEwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydodWUnXSkge1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICBjb25zdCBwb3MgPSB0aGlzLnNlbGVjdGVkUG9zaXRpb247XG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHRoaXMuY29sb3IuZW1pdCh0aGlzLmdldENvbG9yQXRQb3NpdGlvbihwb3MueCwgcG9zLnkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6bW91c2V1cCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VVcChldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlZG93biA9IGZhbHNlO1xuICB9XG5cbiAgb25Nb3VzZURvd24oZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZWRvd24gPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0ZWRQb3NpdGlvbiA9IHsgeDogZXZ0Lm9mZnNldFgsIHk6IGV2dC5vZmZzZXRZIH07XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgdGhpcy5jb2xvci5lbWl0KHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSkpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW91c2Vkb3duKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkUG9zaXRpb24gPSB7IHg6IGV2dC5vZmZzZXRYLCB5OiBldnQub2Zmc2V0WSB9O1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB0aGlzLmVtaXRDb2xvcihldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXRDb2xvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGNvbnN0IHJnYmFDb2xvciA9IHRoaXMuZ2V0Q29sb3JBdFBvc2l0aW9uKHgsIHkpO1xuICAgIHRoaXMuY29sb3IuZW1pdChyZ2JhQ29sb3IpO1xuICB9XG5cbiAgZ2V0Q29sb3JBdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpLmRhdGE7XG4gICAgcmV0dXJuICdyZ2JhKCcgKyBpbWFnZURhdGFbMF0gKyAnLCcgKyBpbWFnZURhdGFbMV0gKyAnLCcgKyBpbWFnZURhdGFbMl0gKyAnLDEpJztcbiAgfVxufVxuIl19