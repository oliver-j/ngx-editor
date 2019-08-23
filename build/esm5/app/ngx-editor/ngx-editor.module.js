/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';
import { NgxEditorComponent } from './ngx-editor.component';
import { NgxGrippieComponent } from './ngx-grippie/ngx-grippie.component';
import { NgxEditorMessageComponent } from './ngx-editor-message/ngx-editor-message.component';
import { NgxEditorToolbarComponent } from './ngx-editor-toolbar/ngx-editor-toolbar.component';
import { MessageService } from './common/services/message.service';
import { CommandExecutorService } from './common/services/command-executor.service';
import { ColorPickerModule } from '../color-picker/color-picker.module';
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
export { NgxEditorModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7Ozs7Z0JBRXJFLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQztvQkFDckcsWUFBWSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUseUJBQXlCLENBQUM7b0JBQzdHLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUM3QixTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxjQUFjLENBQUM7aUJBQ3BEOzswQkFsQkQ7O1NBb0JhLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFBvcG92ZXJNb2R1bGUgfSBmcm9tICduZ3gtYm9vdHN0cmFwJztcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R3JpcHBpZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdyaXBwaWUvbmd4LWdyaXBwaWUuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3ItbWVzc2FnZS9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbW1hbmRFeGVjdXRvclNlcnZpY2UgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtDb2xvclBpY2tlck1vZHVsZX0gZnJvbSAnLi4vY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgUG9wb3Zlck1vZHVsZS5mb3JSb290KCksIENvbG9yUGlja2VyTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTmd4RWRpdG9yQ29tcG9uZW50LCBOZ3hHcmlwcGllQ29tcG9uZW50LCBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50LCBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neEVkaXRvckNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW0NvbW1hbmRFeGVjdXRvclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1vZHVsZSB7IH1cbiJdfQ==