import { Component, AfterViewInit, ViewChild, ElementRef,Input } from '@angular/core';
import { DatamanagerService } from '../../datamanager.service';

declare const google: any;
declare const d3: any;

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.css']
})
export class TreemapComponent implements AfterViewInit {

  @ViewChild('treemapcontainer',{static: false}) chart: ElementRef;
  @Input() period: string = 'PRIOR';
  width: number;
  height: number;
  data: any;
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
      this.data = new google.visualization.DataTable();
      // google.visualization.arrayToDataTable(dataArray);
      this.data.addColumn('string','ID');
      this.data.addColumn('string','Parent');
      this.data.addColumn('number','Value');
      this.data.addColumn('string','color');
      let colorDict = {
        'OP': '#24693d',
        'INP': '#2a5783',
        'RX': '#61a956',
        'OFV': '#b4b7b7',
        'ER': '#b3e0a6',
        'SNF': '#49525e'
      }

      if(Object.keys(this.chartDict).length>0) {
        this.data.addRow(['Payment Type', null, 0, 'transparent']);
        Object.keys((this.chartDict)).forEach((subkey,index) => {
          this.data.addRow([subkey+": $"+this.testMil(this.chartDict[subkey]['pay']/this.chartDict[subkey]['mm']),'Payment Type',this.chartDict[subkey]['pay']/this.chartDict[subkey]['mm'],colorDict[subkey]]);
        });
      } else {
        this.data.addRows([
          ['Payment Type', null, 0, 'transparent'],
          ['OP: $247.7', 'Payment Type', 247.7, '#24693d'],
          ['INP: $150.1', 'Payment Type', 150.1, '#2a5783'],
          ['RX: $134.3', 'Payment Type', 134.3, '#61a956'],
          ['OFV: $48.1', 'Payment Type', 48.1, '#b4b7b7'],
          ['ER: $34.1', 'Payment Type', 34.1, '#b3e0a6'],
          ['SNF: $0.1', 'Payment Type', 0.1, '#49525e']
        ]);
      }

      var view = new google.visualization.DataView(this.data);
      view.setColumns([0, 1, 2]);

      let tree = new google.visualization.TreeMap(this.chart.nativeElement);

      var observer = new MutationObserver(this.addColors.bind(this));
        observer.observe(this.chart.nativeElement, {
          childList: true,
          subtree: true
      });

       tree.draw(view, {
         animation: {
           startup: true,
           duration: 1000,
           easing: "inAndOut"
         },
         minColor: '#49525e',
         midColor: '#49525e',
         maxColor: '#49525e',
         headerHeight: 0,
         fontColor: 'white',
         showScale: false,
         fontSize: 16,
         generateTooltip: this.showFullTooltip.bind(this)
       });

         }

         addColors() {
           let colorDict = {
             'OP': '#24693d',
             'INP': '#2a5783',
             'RX': '#61a956',
             'OFV': '#b4b7b7',
             'ER': '#b3e0a6',
             'SNF': '#49525e'
           }
             Array.prototype.forEach.call(this.chart.nativeElement.getElementsByTagName('rect'), function(rect) {
               var textElements = rect.parentNode.getElementsByTagName('text');
               if (textElements.length > 0) {
                 var dataRows = this.data.getFilteredRows([{
                   column: 0,
                   value: textElements[0].textContent
                 }]);
                 var itemname = textElements[0].textContent.split(":")[0];
                 if(colorDict.hasOwnProperty(itemname)) {
                   rect.setAttribute('fill', colorDict[itemname]);
                 }
                 // console.log("not here",textElements[0].textContent,dataRows.length);
                 // if (dataRows.length > 0) {
                 //   console.log(rect,"here",this.data.getValue(dataRows[0],3))
                 //   rect.setAttribute('fill', this.data.getValue(dataRows[0], 3));
                 // }
               }
             }.bind(this));


           }

        showFullTooltip(row,size,value) {
          let type = this.data.getValue(row,0).split(":")[0];
          let money = this.testMil(this.data.getValue(row,2));
          return `
          <div style='background:white;padding:12px;border-radius:2px;min-width:180px;'>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Visit Type:</span><span>${type}</span></h1>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total PMPM:</span><span>$${money}</span></h1>
          <br>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total COB:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['cob']/this.chartDict[type]['mm']):0}</span></h1>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total Net Pay:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['netpay']/this.chartDict[type]['mm']):0}</span></h1>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total Mempay:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['mempay']/this.chartDict[type]['mm']):0}</span></h1>
          <br>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total Coins:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['coins']/this.chartDict[type]['mm']):0}</span></h1>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total Deductible:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['deduct']/this.chartDict[type]['mm']):0}</span></h1>
          <h1 style='justify-content:space-between;display:flex;align-items:center;margin:0px;' class='mat-h4'><span>Total Copay:</span><span>$${this.chartDict[type]?this.testMil(this.chartDict[type]['copay']/this.chartDict[type]['mm']):0}</span></h1>
          </div>
          `;
        }

}
