import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import {ApiService} from "./shared/api.service";
import {StoreModule} from "@ngrx/store";
import {appReducer} from "./store/reducers/app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {WBDataAPIService} from "./store/effects/error.effects";
import { KeysPipePipe } from './pipes/keys-pipe.pipe';
import { WorldMapComponent } from './components/world-map/world-map.component';


@NgModule({
  declarations: [
    AppComponent,
    KeysPipePipe,
    WorldMapComponent
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
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
