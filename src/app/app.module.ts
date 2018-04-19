import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {D3Service} from "d3-ng2-service";


import { AppComponent } from './app.component';
import {ApiService} from "./shared/api.service";
import {StoreModule} from "@ngrx/store";
import {appReducer} from "./store/reducers/app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {WBDataAPIService} from "./store/effects/error.effects";
import { KeysPipePipe } from './pipes/keys-pipe.pipe';
import { WorldMapComponent } from './components/world-map/world-map.component';
import {LineChartComponent} from "./components/line-chart/line-chart.component";
import {MultiDimensionalComponent} from "./components/multi-dimensional/multi-dimensional.component";
import {ScatterPlotComponent} from "./components/scatter-plot/scatter-plot.component";
import {RevBarGraphComponent} from "./components/rev-bar-graph/rev-bar-graph.component";
import {D3graphComponent} from "./components/d3graph/d3graph.component";
import {MatSliderModule, MatSelectModule, MatFormFieldModule, MatMenuModule, MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import {ShareService} from "./services/shared.service";
import {AttrRankGraphComponent} from "./components/attr-rank-graph/attr-rank-graph.component";
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    AppComponent,
    D3graphComponent,
    RevBarGraphComponent,
    ScatterPlotComponent,
    MultiDimensionalComponent,
    LineChartComponent,
    LineChartComponent,
    KeysPipePipe,
    WorldMapComponent,
    AttrRankGraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer),
    // !environment.production ?
    //   StoreDevtoolsModule.instrument({
    //       maxAge: 25 // Retains last 25 states
    //   })
    //   : [],
    EffectsModule.forRoot([
      WBDataAPIService
    ]),
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FlexLayoutModule
  ],
  providers: [ApiService, D3Service, ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
