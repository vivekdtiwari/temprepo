import { Component, OnInit,AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DatamanagerService } from '../../datamanager.service';

declare const google: any;

@Component({
  selector: 'app-finalstack',
  templateUrl: './finalstack.component.html',
  styleUrls: ['./finalstack.component.css']
})
export class FinalstackComponent implements AfterViewInit {

  @ViewChild('stackcontainer',{static: false}) chart: ElementRef;
  @Input() period: string = 'PRIOR';
  width: number;
  height: number;
  baseData: any[];
  chartDict: any = {};

  constructor(private dataservice: DatamanagerService) {

  }

  ngAfterViewInit() {
    this.width = this.chart.nativeElement.offsetWidth;
    this.height = this.chart.nativeElement.offsetHeight;
    google.charts.setOnLoadCallback(this.drawChart.bind(this));
    this.dataservice.getChartData().subscribe(function(data) {this.baseData=data;if(google.visualization){this.updateChart()}}.bind(this))
  }

  updateChart() {
    let mapDict = {};
    this.baseData.forEach((point) => {
      if(!mapDict[point.visit_type]) {
        mapDict[point.visit_type] = {
          'cob':0,
          'netpay':0,
          'mempay':0,
          'coins':0,
          'deduct':0,
          'copay':0,
          'pay':0,
          'mm':0
        }
      }
      Object.keys(mapDict[point.visit_type]).forEach((subkey) => {
        if(point.rp.toUpperCase()==this.period) {
          mapDict[point.visit_type][subkey] = mapDict[point.visit_type][subkey] + parseFloat(point[subkey])
        }
      });
    });
    this.chartDict = mapDict;
    if(!google.visualization.arrayToDataTable){
      return;
    }
    this.drawChart();
  }

  drawChart() {
    console.log("drawing chart",this.dataservice.datasource);
    let orderArr = ['netpay','deduct','copay','coins','cob'];
    let colArr = ['ER','INP','OFV','OP','RX','SNF'];

    var mainArr = [];
    if(this.dataservice.datasource.toLowerCase()!='optum-ses') {
      mainArr.push(['Plan Type', 'NetPay', 'Deductible', 'CoPay', 'Coins','COB', { role: 'annotation' } ]);
    } else {
      mainArr.push(['Plan Type','total PMPM',{ role: 'annotation' }])
    }

    if(Object.keys(this.chartDict).length>0) {
      colArr.forEach((col) => {
        let tempArr = [];
        tempArr.push(col);
        orderArr.forEach((paytype) => {
          if(this.dataservice.datasource.toLowerCase()!='optum-ses'){
            tempArr.push(this.chartDict[col][paytype]/this.chartDict[col]['mm']);
          }
        });
        if(this.dataservice.datasource.toLowerCase()=='optum-ses') {
          tempArr.push(this.chartDict[col]['pay']/this.chartDict[col]['mm']);
        }
        tempArr.push('');
        mainArr.push(tempArr);
      });
    }

    var data;
    console.log("check data",mainArr);
    if(mainArr.length>0){
      console.log("check data in");
      data = google.visualization.arrayToDataTable(mainArr);
    } else {
      data = google.visualization.arrayToDataTable([
          ['Plan Type', 'NetPay', 'Deductible', 'CoPay', 'Coins','COB', { role: 'annotation' } ],
          ['ER', 30, 24, 20, 32, 18, ''],
          ['INP', 16, 22, 23, 30, 16, ''],
          ['OFV', 28, 19, 29, 30, 12, ''],
          ['OP', 28, 19, 29, 30, 12, ''],
          ['Rx', 28, 19, 29, 30, 12, ''],
          ['SNF', 10, 24, 20, 32, 18, '']
        ]);
    }

    var options = {
      animation: {
        startup: true,
        duration: 1000,
        easing: "inAndOut"
      },
      focusTarget: 'category',
      colors: ['#43719f','#b9ddf1','#cdcecd','#308344','#b3e0a6'],
      isStacked: true,
      width: this.width,
      height: this.height,
      backgroundColor: 'transparent',
      legend: {
        position: "bottom",
        textStyle: {
          color: 'white'
        }
     },
      hAxis: {
        baselineColor: 'white',
        textStyle: {
          color: 'white'
        },
        gridlines: {
          color: 'red'
        },
        minorGridlines: {
          color: 'red'
        }
      },
      vAxis: {
        format: 'currency',
        baselineColor: '#00838F',
        title: 'PMPM',
        titleTextStyle: {
          color:'white'
        },
        gridlines: {
          color: 'pink',
          count: 0
        },
        minorGridlines: {
          color: 'pink',
          count: 0
        },
        textStyle: {
          color: 'white'
        }
      }
    };
    console.log("drawing chart before");
    var chart = new google.visualization.ColumnChart(this.chart.nativeElement);
    console.log("drawing chart",mainArr);
    chart.draw(data, options);
  }

}
