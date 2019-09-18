import { Component } from '@angular/core';
import {DatamanagerService} from './datamanager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashapp';
  legend = '<b>legend</b>';

  constructor(private dataservice: DatamanagerService) {
    this.dataservice.init();
    this.dataservice.getChartData2().subscribe((data) => this.updateLegend());
  }

  updateLegend() {
    if(this.dataservice.datasource!='OPTUM-SES') {

    }
  }




}
