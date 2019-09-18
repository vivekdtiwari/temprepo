import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { FiltersComponent } from './filters/filters.component';
import { DropdownComponent } from './filters/dropdown/dropdown.component';
import { TitlesplitComponent } from './titlesplit/titlesplit.component';
import { AreasplitComponent } from './areasplit/areasplit.component';
import { MinchartComponent } from './areasplit/minchart/minchart.component';
import { TreemapComponent } from './areasplit/treemap/treemap.component';
import { UtilbarComponent } from './areasplit/utilbar/utilbar.component';
import { FinalstackComponent } from './areasplit/finalstack/finalstack.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    DropdownComponent,
    TitlesplitComponent,
    AreasplitComponent,
    MinchartComponent,
    TreemapComponent,
    UtilbarComponent,
    FinalstackComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
