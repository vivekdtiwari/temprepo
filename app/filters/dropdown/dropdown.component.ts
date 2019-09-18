import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable,from } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() title: string = 'Default Title';
  @Input() multiselect: string = 'true';
  @Input() options: string[] = [];
  @Output() public onUpdate: EventEmitter<any> = new EventEmitter();
  @ViewChild('filterselect',{static:true}) filterElem: any;
  @ViewChild('allselect',{static:true}) allElem: any;
  filterset = [];
  toggleFlag: boolean = true;

  constructor() {
  }

  ngOnChanges() {
    this.filterset = [];
  }

  ngOnInit() {
  }

  selectAll(event) {
    if(Array.isArray(this.filterset)) {
      if(this.toggleFlag) {
        this.filterElem['options'].forEach((option) => option.select())
      } else if(this.filterset.length==this.options.length+1) {
        this.filterElem['options'].forEach((option) => option.deselect())
      }
      this.toggleFlag = !this.toggleFlag;
    }
  }

  change(event) {
    let currentoptions = [];
    if(Array.isArray(this.filterset)) {
      if(this.filterset.length<this.options.length+1 && this.filterset[0]==undefined) {
        this.allElem.deselect();
      }
      currentoptions = this.filterset.filter((value) => value!=undefined);
    } else {
      if(this.filterset) {
        currentoptions = [this.filterset];
      } else {
        currentoptions = [];
      }
    }
    this.onUpdate.emit(currentoptions);
  }

}
