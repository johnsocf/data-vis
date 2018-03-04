import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  httpGet() {
    return this.http.get(`http://api.worldbank.org/climateweb/rest/v1/country/cru/tas/year/usa?format=json`);
  }

  httpGetFile(file) {
    return this.http.get(file);
  }

}
