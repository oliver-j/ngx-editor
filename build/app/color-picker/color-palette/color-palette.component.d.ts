import { ElementRef, AfterViewInit, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
export declare class ColorPaletteComponent implements AfterViewInit, OnChanges {
    hue: string;
    color: EventEmitter<string>;
    canvas: ElementRef<HTMLCanvasElement>;
    private ctx;
    private mousedown;
    selectedPosition: {
        x: number;
        y: number;
    };
    ngAfterViewInit(): void;
    draw(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onMouseUp(evt: MouseEvent): void;
    onMouseDown(evt: MouseEvent): void;
    onMouseMove(evt: MouseEvent): void;
    emitColor(x: number, y: number): void;
    getColorAtPosition(x: number, y: number): string;
}
