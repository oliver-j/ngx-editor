import { ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
export declare class ColorSliderComponent implements AfterViewInit {
    canvas: ElementRef<HTMLCanvasElement>;
    color: EventEmitter<string>;
    private ctx;
    private mousedown;
    private selectedHeight;
    ngAfterViewInit(): void;
    draw(): void;
    onMouseUp(evt: MouseEvent): void;
    onMouseDown(evt: MouseEvent): void;
    onMouseMove(evt: MouseEvent): void;
    emitColor(x: number, y: number): void;
    getColorAtPosition(x: number, y: number): string;
}
