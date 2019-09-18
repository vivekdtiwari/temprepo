import { Component, AfterViewInit, ViewChild, ElementRef,Input } from '@angular/core';
import { DatamanagerService } from '../../datamanager.service';

declare const google: any;

@Component({
  selector: 'app-utilbar',
  templateUrl: './utilbar.component.html',
  styleUrls: ['./utilbar.component.css']
})
export class UtilbarComponent implements AfterViewInit {

  @ViewChild('utilbarcontainer',{static: false}) chart: ElementRef;
  @Input() period: string = 'PRIOR';
  width: number = 0;
  height: number = 0;
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
        mapDict[point.visit_type]={
          'num_visits':0,
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

  testMil (labelValue) {

      // Nine Zeroes for Billions
      return Math.round(Math.abs(Number(labelValue))*100)/100 >= 1.0e+9

      ? (Math.round(Math.abs(Number(labelValue))*100) / 1.0e+9)/100 + "B"
      // Six Zeroes for Millions
      : Math.round(Math.abs(Number(labelValue))*100)/100 >= 1.0e+6

      ? Math.round(Math.abs(Number(labelValue))*100 / 1.0e+6)/100 + "M"
      // Three Zeroes for Thousands
      : Math.round(Math.abs(Number(labelValue))*100)/100 >= 1.0e+3

      ? (Math.round(Math.abs(Number(labelValue)) *100/ 1.0e+3))/100 + "K"

      : Math.round(Math.abs(Number(labelValue))*100)/100;

  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Visit Type', 'PTMPM', {role: 'style'}],
        ['INP', Math.round(this.chartDict['INP']?this.chartDict['INP']['num_visits']*1000/this.chartDict['INP']['mm']:0), '#09357a'],
        ['ER', Math.round(this.chartDict['ER']?this.chartDict['ER']['num_visits']*1000/this.chartDict['ER']['mm']:0),'#2a8ebf'],
        ['OFV', Math.round(this.chartDict['OFV']?this.chartDict['OFV']['num_visits']*1000/this.chartDict['OFV']['mm']:0), '#bfbfbf'],
        ['OP',Math.round(this.chartDict['OP']?this.chartDict['OP']['num_visits']*1000/this.chartDict['OP']['mm']:0), '#237d26'],
        ['SNF',Math.round(this.chartDict['SNF']?this.chartDict['SNF']['num_visits']*1000/this.chartDict['SNF']['mm']:0), '#4f81bd'],
        ['Rx',Math.round(this.chartDict['RX']?this.chartDict['RX']['num_visits']*1000/this.chartDict['RX']['mm']:0), '#bfe18d']
      ]);
    var view = new google.visualization.DataView(data);

    view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

    var options = {
      animation: {
        startup: true,
        duration: 1000,
        easing: "inAndOut"
      },
      tooltip: {
        isHtml: true
      },
      annotations: {
        fontColor: 'white',
        color: 'white',
        datum: {
          stem: {
            length: 0
          }
        },
        alwaysOutside: true,
        // style: 'line',
        textStyle: {
          color: 'white',
          fontSize: 12
        }
      },
      colors: ['red','blue','green'],
      width: this.width,
      height: this.height,
      backgroundColor: 'transparent',
      legend: { position: "none" },
      hAxis: {
        title: 'Visit Type',
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
        baselineColor: '#00838F',
        title: 'Utilization PTMPM',
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
    var chart = new google.visualization.ColumnChart(this.chart.nativeElement);
    var observer = new MutationObserver(this.addColors.bind(this));
      observer.observe(this.chart.nativeElement, {
        childList: true,
        subtree: true
    });
    chart.draw(view, options);
  }

  addColors() {
    Array.prototype.forEach.call(this.chart.nativeElement.getElementsByTagName('text'), function(text) {
      text.setAttribute('fill','white');
    });
  }

}
