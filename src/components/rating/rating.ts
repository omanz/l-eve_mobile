import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the RatingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rating',
  template:
    `<ion-icon *ngFor="let n of ratingRange; let i = index" [name]="i < rating ? 'star' : 'star-outline'" (click)="onUpdate(i+1)"></ion-icon>`
})
export class RatingComponent {
  public ratingRange = [1, 2, 3, 4, 5];

  @Input() rating = 3;

  @Output() public update: EventEmitter<number> = new EventEmitter();

  onUpdate(score: number): void {
    this.update.emit(score);
  }

}
