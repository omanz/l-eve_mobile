/*
  Generated class for the CapabilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export const CapabilityTechType = {
  Installation: 'Installation',
  Regard: 'Regard',
  Volant : 'Volant',
  Accelerateur: 'Accelerateur',
  Frein: 'Frein',
  BoiteAVitesse: 'Boite à vitesse',
  Embrayage: 'Embrayage',
  Approche: 'Approche',
}
export const CapabilityRoadType = {
  RTI: 'RTI',
  PrioriteI: 'Priorité I',
  PrioriteII: 'Priorité II',
  GuidaguePanneau: 'Guidage aux panneaux',
  Autoroute: 'Autoroute',
  Manoeuvres: 'Manoeuvres',
  Autonomie: 'Autonomie',
  Vision: 'Vision dans le traffic',
}

export class CapabilityProvider {

  constructor(public type : string, public value : number) {
    console.log('Hello CapabilityProvider Provider');
  }

}
