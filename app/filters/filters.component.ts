import { Component, OnInit } from '@angular/core';
import { DatamanagerService } from '../datamanager.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  datasources: string[] = [];
  reporting_period: string[] = [];
  population: string[] = [];
  continuous_enrollment: string[] = [];
  line_of_business: string[] = [];
  plan_type: string[] = [];
  age_group: string[] = [];
  gender: string[] = [];
  state: string[] = [];

  constructor(private dataservice: DatamanagerService) {
    this.dataservice.getDbFilter().subscribe((filters) => this.datasources=filters);
    this.dataservice.getRpFilter().subscribe((filters) => this.reporting_period=filters);
    this.dataservice.getPopulationFilter().subscribe((filters) => this.population=filters);
    this.dataservice.getCeFilter().subscribe((filters) => this.continuous_enrollment=filters);
    this.dataservice.getLobFilter().subscribe((filters) => this.line_of_business=filters);
    this.dataservice.getPlanFilter().subscribe((filters) => this.plan_type=filters);
    this.dataservice.getAgeFilter().subscribe((filters) => this.age_group=filters);
    this.dataservice.getGenderFilter().subscribe((filters) => this.gender=filters);
    this.dataservice.getStateFilter().subscribe((filters) => this.state=filters);
  }

  updateDbFilter(selectedDb) {
    this.dataservice.applyDbFilter(selectedDb);
  }

  updateRpFilter(selectedRp) {
    this.dataservice.applyRpFilter(selectedRp);
  }

  updatePopulationfilter(selectedPop) {
    this.dataservice.applyPopulationFilter(selectedPop);
  }

  updateCeFilter(selectedCe) {
    this.dataservice.applyCeFilter(selectedCe);
  }

  updateLobFilter(selectedLob) {
    this.dataservice.applyLobFilter(selectedLob);
  }

  updatePlanFilter(selectedPlan) {
    this.dataservice.applyPlanFilter(selectedPlan);
  }

  updateAgeFilter(selectedAge) {
    this.dataservice.applyAgeFilter(selectedAge);
  }

  updateGenderFilter(selectedGender) {
    this.dataservice.applyGenderFilter(selectedGender);
  }

  updateStateFilter(selectedState) {
    this.dataservice.applyStateFilter(selectedState);
  }

  ngOnInit() {
  }

}
