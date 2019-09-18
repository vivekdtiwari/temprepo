import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-areasplit',
  templateUrl: './areasplit.component.html',
  styleUrls: ['./areasplit.component.css']
})
export class AreasplitComponent implements OnInit {

  @Input() title: string;


  constructor() { }

  ngOnInit() {
  }

}
