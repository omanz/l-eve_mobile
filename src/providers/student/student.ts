import { Injectable } from '@angular/core';
import {CapabilityProvider, CapabilityRoadType, CapabilityTechType} from "../capability/capability";

/*
  Generated class for the StudentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentProvider {

  public contact_id: string = '';
  public name : string = '';
  public first_name : string = '';
  public phoneNumber : string ='';
  public remarques: string = '';
  public capabilities : {technique: {}, road: {}};
  public lastCourse: Date;

  constructor() {
    console.log('Hello StudentProvider Provider');

    let techCapabilities = {};
    let roadCapabilities = {};
    for (let capability in CapabilityTechType) {
      techCapabilities[capability] = new CapabilityProvider(CapabilityTechType[capability], 0);
    }
    for (let capability in CapabilityRoadType) {
      roadCapabilities[capability] = new CapabilityProvider(CapabilityRoadType[capability], 0);
    }
    this.capabilities = {technique: techCapabilities, road: roadCapabilities}

  }


  public getCapabilities() {
    let capabilitiesTech = {};

    // iterate through all tech capabilities and if student has one, assign it
    for (let capability in CapabilityTechType){
      let value = this.capabilities.technique[capability] ? this.capabilities.technique[capability]['value'] : 0;
      capabilitiesTech[capability] = new CapabilityProvider(CapabilityTechType[capability], value);
    }

    let capabilitiesRoad = {};
    // iterate through all tech capabilities and if student has one, assign it
    for (let capability in CapabilityRoadType){
      let value = this.capabilities.road[capability] ? this.capabilities.road[capability]['value'] : 0;
      capabilitiesRoad[capability] = new CapabilityProvider(CapabilityRoadType[capability], value);
    }

    return {technique: capabilitiesTech, road: capabilitiesRoad};
  }

  getByType(type: string): CapabilityProvider{
    for (let capability in this.capabilities){
      if (type == CapabilityTechType[capability]){
        return this.capabilities[capability];
      }
    }
    return null;

  }

  setByType(type: string, value : number) {
    for (let capability in this.capabilities){
      if (type == CapabilityTechType[capability]){
        this.capabilities[capability].value = value;
        return;
      }
    }
  }


}
