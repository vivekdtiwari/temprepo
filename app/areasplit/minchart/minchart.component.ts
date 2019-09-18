import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DatamanagerService } from '../../datamanager.service';

declare var google: any;

@Component({
  selector: 'app-minchart',
  templateUrl: './minchart.component.html',
  styleUrls: ['./minchart.component.css']
})
export class MinchartComponent implements AfterViewInit {
  @Input() title: string = 'Default Title';
  @Input() type: string = 'age';
  @ViewChild('chartarea',{static: false}) chart: ElementRef;
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
    this.dataservice.getChartData2().subscribe(function(data) {this.baseData=data;if(google.visualization){this.updateChart()}}.bind(this))
  }

  updateChart() {
    let mainDict = {};
    if(this.type=="age") {
      this.baseData.forEach((point) => {
        if(!mainDict[point.age_grp]) {
          mainDict[point.age_grp] = {};
        }
        if(!mainDict[point.age_grp][point.plantyp]) {
          mainDict[point.age_grp][point.plantyp] = 0;
        }
        if(point.rp.toUpperCase()==this.title) {
          mainDict[point.age_grp][point.plantyp] = mainDict[point.age_grp][point.plantyp] + parseInt(point.mm);
        }
      });
      this.chartDict = mainDict;
    } else {
      this.baseData.forEach((point) => {
        if(point.gender==1 || point.gender=="M") {
          point.gender="MALE"
        } else if(point.gender==2 || point.gender=="F") {
          point.gender="FEMALE"
        }
        if(!mainDict[point.gender]) {
          mainDict[point.gender] = {};
        }
        if(!mainDict[point.gender][point.plantyp]) {
          mainDict[point.gender][point.plantyp] = 0;
        }
        if(point.rp.toUpperCase()==this.title) {
          mainDict[point.gender][point.plantyp] = mainDict[point.gender][point.plantyp] + parseInt(point.mm);
        }
      });
      this.chartDict = mainDict;
    }
    if(!google.visualization.arrayToDataTable){
      return;
    }

    this.drawChart();

  }

  drawChart() {
    var dataTable = new google.visualization.DataTable();
    var plan_type;
    var age_groups;
    if(this.dataservice.datasource == "OPTUM-SES") {
      plan_type = ['EPO', 'HMO', 'IND', 'PPO', 'POS', 'Others'];
    } else {
      plan_type = ['Cap POS','CDHP/HDHP','HMO','Non-Cap POS','Others','PPO','Unknown'];
    }

    if(this.type=="age") {
      plan_type = ['Cap POS','CDHP/HDHP','HMO','Non-Cap POS','Others','PPO','Unknown'];
      age_groups = ['0-17','18-34','35-44','45-54','55-64','65 AND OLDER'];
    } else {
      plan_type = ['Cap POS','CDHP/HDHP','HMO','Non-Cap POS','Others','PPO','Unknown'];
      age_groups = ['MALE','FEMALE'];
    }

    plan_type.forEach((plan,index) => {
      if(index==0) {
        dataTable.addColumn('string','Group');
      }
        dataTable.addColumn('number',plan);
        dataTable.addColumn({type: 'string', role: 'tooltip','p':{'html':true}});

    });

    if(Object.keys(this.chartDict).length>=2) {
      age_groups.forEach((age_grp) => {
        if(this.chartDict.hasOwnProperty(age_grp)) {
          if(this.dataservice.datasource == "OPTUM-SES") {
        dataTable.addRow([age_grp, this.chartDict[age_grp]['EPO'], this.generateTooltip(age_grp,'EPO',this.chartDict[age_grp]['EPO']) ,this.chartDict[age_grp]['HMO'], this.generateTooltip(age_grp,'HMO',this.chartDict[age_grp]['HMO']),this.chartDict[age_grp]['IND'], this.generateTooltip(age_grp,'IND',this.chartDict[age_grp]['IND']),this.chartDict[age_grp]['PPO'],this.generateTooltip(age_grp,'PPO',this.chartDict[age_grp]['PPO']), this.chartDict[age_grp]['POS'],this.generateTooltip(age_grp,'POS',this.chartDict[age_grp]['POS']), this.chartDict[age_grp]['Others'],this.generateTooltip(age_grp,'Others',this.chartDict[age_grp]['Others']),this.chartDict[age_grp]['PPO'],this.generateTooltip(age_grp,'PPO',this.chartDict[age_grp]['PPO'])]);
      } else {
        dataTable.addRow([age_grp, this.chartDict[age_grp]['Cap POS'], this.generateTooltip(age_grp,'Cap POS',this.chartDict[age_grp]['Cap POS']) ,this.chartDict[age_grp]['CDHP/HDHP'], this.generateTooltip(age_grp,'CDHP/HDHP',this.chartDict[age_grp]['CDHP/HDHP']),this.chartDict[age_grp]['HMO'], this.generateTooltip(age_grp,'HMO',this.chartDict[age_grp]['HMO']),this.chartDict[age_grp]['Non-Cap POS'],this.generateTooltip(age_grp,'Non-Cap POS',this.chartDict[age_grp]['Non-Cap POS']),this.chartDict[age_grp]['Others'],this.generateTooltip(age_grp,'Others',this.chartDict[age_grp]['Others']),this.chartDict[age_grp]['PPO'],this.generateTooltip(age_grp,'PPO',this.chartDict[age_grp]['PPO']),this.chartDict[age_grp]['Unknown'],this.generateTooltip(age_grp,'Unknown',this.chartDict[age_grp]['Unknown'])]);
      }
      }
    });
    }




    var options = {
      animation: {
        startup: true,
        duration: 1000,
        easing: "inAndOut"
      },
      chartArea: {
        right:8,
        width: '80%'
      },
      // focusTarget: 'category',
      tooltip: {
        isHtml: true,
        textStyle: {
          color: 'black'
        }
      },
      colors: ['#bab0ac','#f5d466','#b6992d','#786f6d','#499894','#e15759','#a0cbe9'],
      isStacked: true,
      width: this.width,
      height: this.height,
      backgroundColor: 'transparent',
      legend: { position: "none" },
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
        format: 'short',
        baselineColor: '#00838F',
        title: 'Member Months',
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
    // console.log(dataTable);
    chart.draw(dataTable, options);
  }

  generateTooltip(age,plan,value) {
    return `<div style="padding:12px;backround-color:aliceblue;min-width:180px; box-shadow: 3px 3px 5px black;">
    <h1 class="mat-h5" style="color:black;margin:0px;display:flex;justify-content:space-between;">Plan Type: <b>${plan}</b></h1>
    <h1 class="mat-h5" style="color:black;margin:0px;display:flex;justify-content:space-between;">Age Group: <b>${age}</b></h1>
    <h1 class="mat-h5" style="color:black;margin:0px;display:flex;justify-content:space-between;">Period: <b>${this.title}</b></h1>
    <h1 class="mat-h5" style="color:black;margin:0px;display:flex;justify-content:space-between;">Membership Months: <b>${(value)}</b></h1>
    </div>`
  }

  testMil (labelValue) {

      // Nine Zeroes for Billions
      return Math.round(Math.abs(Number(labelValue))) >= 1.0e+9

      ? Math.round(Math.abs(Number(labelValue))) / 1.0e+9 + "B"
      // Six Zeroes for Millions
      : Math.round(Math.abs(Number(labelValue))) >= 1.0e+6

      ? Math.round(Math.abs(Number(labelValue)) / 1.0e+6) + "M"
      // Three Zeroes for Thousands
      : Math.round(Math.abs(Number(labelValue))) >= 1.0e+3

      ? Math.round(Math.abs(Number(labelValue)) / 1.0e+3) + "K"

      : Math.round(Math.abs(Number(labelValue)));

  }

}
