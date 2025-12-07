import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-photo-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {}
