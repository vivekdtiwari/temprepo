import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const d3: any;

@Injectable({
  providedIn: 'root'
})
export class DatamanagerService {

  data: any[];
  data2: any[];
  datasource: string = '';
  baseRpFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  basePopulationFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  baseCeFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  baseLobFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  basePlanFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  baseAgeFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  baseGenderFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  baseStateFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  dbFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  rpFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  populationFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  ceFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  lobFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  planFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  ageFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  genderFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  stateFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  chartData: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  chartData2: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
  }

  init() {
    console.log("init is invoked");
    d3.csv('assets/cost_dataset.csv')
      .then(function(data) {
        d3.csv('assets/membership_dataset.csv')
        .then(function(data2){
          this.data2 = data2;
          // this.chartData2.next(data);
          this.data = data;
          this.dbFilter.next(this.createDbFilter(this.data));
          this.chartData.next(data);
          this.chartData2.next(data2);
        }
      .bind(this))

      }.bind(this))
      .catch((error) => console.log(error))
  }

  createDbFilter(data) {
    let db = Array.from(new Set(data.map((datapoint) => datapoint.datasource)));
    return db;
  }



  getDbFilter() {
    return this.dbFilter.asObservable();
  }

  getRpFilter() {
    return this.baseRpFilter.asObservable();
  }

  getPopulationFilter() {
    return this.basePopulationFilter.asObservable();
  }

  getCeFilter() {
    return this.baseCeFilter.asObservable();
  }

  getLobFilter() {
    return this.baseLobFilter.asObservable();
  }

  getPlanFilter() {
    return this.basePlanFilter.asObservable();
  }

  getAgeFilter() {
    return this.baseAgeFilter.asObservable();
  }

  getGenderFilter() {
    return this.baseGenderFilter.asObservable();
  }

  getStateFilter() {
    return this.baseStateFilter.asObservable();
  }

  applyDbFilter(value) {
    this.datasource = value[0];
    let db = new Set();
    let rp = new Set();
    let population = new Set();
    let cont_enrollment = new Set();
    let lob = new Set();
    let plan_type = new Set();
    let age_group = new Set();
    let gender = new Set();
    let state = new Set();

    this.data.forEach((point) => {
      if(point.datasource==value[0]){
        if(point.lob=='COM') {
          point.lob='Commercial';
        } else if(point.lob=='MCR') {
          point.lob='Medicare (Advantage)';
        }
        if(point.cont_enrollment==1) {
          point.cont_enrollment="YES"
        } else if(point.cont_enrollment==0) {
          point.cont_enrollment="NO"
        }
        if(point.datasource=='OPTUM-SES') {
          if(point.state==null || point.state=='') {
            point.state='UNKNOWN - REGION';
          } else if(point.state=='ENC') {
            point.state='ENC(EAST NORTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='ESC') {
            point.state='ESC(EAST SOUTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='M') {
            point.state='M(MOUNTAIN) - REGION';
          } else if(point.state.toUpperCase()=='MA') {
            point.state='MA(MIDDLE ATLANTIC) - REGION';
          } else if(point.state.toUpperCase()=='WNC') {
            point.state='WNC(WEST NORTH CENTRAL) - REGION'
          } else if(point.state.toUpperCase()=='NE') {
            point.state='NE(NEW ENGLAND) - REGION'
          } else if(point.state.toUpperCase()=='P') {
            point.state='P(PACIFIC) - REGION'
          } else if(point.state.toUpperCase()=='SA') {
            point.state='SA(SOUTH ATLANTIC) - REGION'
          } else if(point.state.toUpperCase()=='U') {
            point.state='UNKNOWN - REGION'
          } else if(point.state.toUpperCase()=='WSC') {
            point.state='WSC(WEST SOUTH CENTRAL) - REGION'
          } else {
            if(!point.state.toLowerCase().includes('region')) {
              point.state = point.state + ' - REGION';
            }
          }
        } else {
          if(point.state==null || point.state=='') {
            point.state = 'UNK - STATE'
          } else {
            if(!point.state.toLowerCase().includes('state')) {
              point.state = point.state + ' - STATE'
            }
          }
        }
        if(point.plantyp.toUpperCase()=='OTH') {
          point.plantyp="Others"
        }
        db.add(point.datasource);
        rp.add(point.rp);
        population.add(point.population);
        cont_enrollment.add(point.cont_enrollment);
        lob.add(point.lob);
        plan_type.add(point.plantyp);
        age_group.add(point.age_grp);
        if(point.gender==1 || point.gender=="M") {
          point.gender="MALE"
        } else if(point.gender==2 || point.gender=="F") {
          point.gender="FEMALE"
        }
        gender.add(point.gender);
        state.add(point.state);
      }
    });
    this.baseRpFilter.next(Array.from(rp).sort());
    this.basePopulationFilter.next(Array.from(population).sort());
    this.baseCeFilter.next(Array.from(cont_enrollment).sort());
    this.baseLobFilter.next(Array.from(lob).sort());
    this.basePlanFilter.next(Array.from(plan_type).sort());
    this.baseAgeFilter.next(Array.from(age_group).sort());
    this.baseGenderFilter.next(Array.from(gender).sort());
    this.baseStateFilter.next(Array.from(state).sort());
    this.rpFilter.next(Array.from(rp).sort());
    this.populationFilter.next(Array.from(population).sort());
    this.ceFilter.next(Array.from(cont_enrollment).sort());
    this.lobFilter.next(Array.from(lob).sort());
    this.planFilter.next(Array.from(plan_type).sort());
    this.ageFilter.next(Array.from(age_group).sort());
    this.genderFilter.next(Array.from(gender).sort());
    this.stateFilter.next(Array.from(state).sort());
    this.createBaseData();
    this.createBaseData2();
  }

  createBaseData() {
    let flag = true;
    let baseData = this.data.filter((point) => {
      if(point.datasource==this.datasource){
        if(point.lob=='COM') {
          point.lob='Commercial';
        } else if(point.lob=='MCR') {
          point.lob='Medicare (Advantage)';
        }
        if(point.cont_enrollment==1) {
          point.cont_enrollment="YES"
        } else if(point.cont_enrollment==0) {
          point.cont_enrollment="NO"
        }
        if(point.datasource=='OPTUM-SES') {
          if(point.state==null || point.state=='') {
            point.state='UNKNOWN - REGION';
          } else if(point.state=='ENC') {
            point.state='ENC(EAST NORTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='ESC') {
            point.state='ESC(EAST SOUTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='M') {
            point.state='M(MOUNTAIN) - REGION';
          } else if(point.state.toUpperCase()=='MA') {
            point.state='MA(MIDDLE ATLANTIC) - REGION';
          } else if(point.state.toUpperCase()=='WNC') {
            point.state='WNC(WEST NORTH CENTRAL) - REGION'
          } else if(point.state.toUpperCase()=='NE') {
            point.state='NE(NEW ENGLAND) - REGION'
          } else if(point.state.toUpperCase()=='P') {
            point.state='P(PACIFIC) - REGION'
          } else if(point.state.toUpperCase()=='SA') {
            point.state='SA(SOUTH ATLANTIC) - REGION'
          } else if(point.state.toUpperCase()=='U') {
            point.state='UNKNOWN - REGION'
          } else if(point.state.toUpperCase()=='WSC') {
            point.state='WSC(WEST SOUTH CENTRAL) - REGION'
          }
        } else {
          if(point.state==null || point.state=='') {
            point.state = 'UNK - STATE'
          }
        }
        if(point.plantyp.toUpperCase()=='OTH') {
          point.plantyp="Others"
        }

        let condition = point.datasource==this.datasource &&
          this.rpFilter.value.includes(point.rp) &&
          this.populationFilter.value.includes(point.population) &&
          this.ceFilter.value.includes(point.cont_enrollment) &&
          this.lobFilter.value.includes(point.lob) &&
          this.planFilter.value.includes(point.plantyp) &&
          this.ageFilter.value.includes(point.age_grp) &&
          this.genderFilter.value.includes(point.gender) &&
          this.stateFilter.value.includes(point.state);
        return condition;
      }
    });

    this.chartData.next(baseData);

    this.createBaseData2();

  }

  createBaseData2() {
    let flag = true;
    let baseData = this.data2.filter((point) => {
      if(point.datasource==this.datasource){
        if(point.lob=='COM') {
          point.lob='Commercial';
        } else if(point.lob=='MCR') {
          point.lob='Medicare (Advantage)';
        }
        if(point.cont_enrollment==1) {
          point.cont_enrollment="YES"
        } else if(point.cont_enrollment==0) {
          point.cont_enrollment="NO"
        }
        if(point.datasource=='OPTUM-SES') {
          if(point.state==null || point.state=='') {
            point.state='UNKNOWN - REGION';
          } else if(point.state=='ENC') {
            point.state='ENC(EAST NORTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='ESC') {
            point.state='ESC(EAST SOUTH CENTRAL) - REGION';
          } else if(point.state.toUpperCase()=='M') {
            point.state='M(MOUNTAIN) - REGION';
          } else if(point.state.toUpperCase()=='MA') {
            point.state='MA(MIDDLE ATLANTIC) - REGION';
          } else if(point.state.toUpperCase()=='WNC') {
            point.state='WNC(WEST NORTH CENTRAL) - REGION'
          } else if(point.state.toUpperCase()=='NE') {
            point.state='NE(NEW ENGLAND) - REGION'
          } else if(point.state.toUpperCase()=='P') {
            point.state='P(PACIFIC) - REGION'
          } else if(point.state.toUpperCase()=='SA') {
            point.state='SA(SOUTH ATLANTIC) - REGION'
          } else if(point.state.toUpperCase()=='U') {
            point.state='UNKNOWN - REGION'
          } else if(point.state.toUpperCase()=='WSC') {
            point.state='WSC(WEST SOUTH CENTRAL) - REGION'
          } else {
            if(!point.state.toLowerCase().includes('region')) {
              point.state = point.state + ' - REGION';
            }
          }
        } else {
          if(point.state==null || point.state=='') {
            point.state = 'UNK - STATE'
          } else {
            if(!point.state.toLowerCase().includes('state')) {
              point.state = point.state + ' - STATE'
            }
          }
        }
        if(point.plantyp.toUpperCase()=='OTH') {
          point.plantyp="Others"
        }

        let condition = point.datasource==this.datasource &&
          this.rpFilter.value.includes(point.rp) &&
          this.populationFilter.value.includes(point.population) &&
          this.ceFilter.value.includes(point.cont_enrollment) &&
          this.lobFilter.value.includes(point.lob) &&
          this.planFilter.value.includes(point.plantyp) &&
          this.ageFilter.value.includes(point.age_grp) &&
          this.genderFilter.value.includes(point.gender) &&
          this.stateFilter.value.includes(point.state);
          if(flag) {

          }

        return condition;
      }
    });

    this.chartData2.next(baseData);

  }

  applyRpFilter(value) {
    this.rpFilter.next(value);
    this.createBaseData();
  }

  applyPopulationFilter(value) {
    this.populationFilter.next(value);
    this.createBaseData();
  }

  applyCeFilter(value) {
    this.ceFilter.next(value);
    this.createBaseData();
  }

  applyLobFilter(value) {
    this.lobFilter.next(value);
    this.createBaseData();
  }

  applyPlanFilter(value) {
    this.planFilter.next(value);
    this.createBaseData();
  }

  applyAgeFilter(value) {
    this.ageFilter.next(value);
    this.createBaseData();
  }

  applyGenderFilter(value) {
    this.genderFilter.next(value);
    this.createBaseData();
  }

  applyStateFilter(value) {
    this.stateFilter.next(value);
    this.createBaseData();
  }

  getChartData() {
    return this.chartData.asObservable();
  }

  getChartData2(){
    return this.chartData2.asObservable();
  }

}
