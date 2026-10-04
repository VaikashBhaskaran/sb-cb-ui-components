// Jest stub for '@ckeditor/ckeditor5-angular' (pulled in by @sunbird-cb/consumption); mirrors the <ckeditor> API surface only.
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

@Component({
  selector: 'ckeditor',
  template: '',
  standalone: false,
})
export class CKEditorComponent {
  @Input() editor: any;
  @Input() config: any;
  @Input() data: any;
  @Input() tagName: any;
  @Input() watchdog: any;
  @Input() editorWatchdogConfig: any;
  @Input() disableTwoWayDataBinding: any;
  @Input() disabled: any;
  @Output() ready = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();
}

@NgModule({
  declarations: [CKEditorComponent],
  exports: [CKEditorComponent],
})
export class CKEditorModule {}
