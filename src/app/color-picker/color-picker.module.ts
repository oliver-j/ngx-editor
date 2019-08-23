import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ColorPickerComponent ],
  declarations: [ColorPickerComponent, ColorPaletteComponent, ColorSliderComponent]
})
export class ColorPickerModule { }
