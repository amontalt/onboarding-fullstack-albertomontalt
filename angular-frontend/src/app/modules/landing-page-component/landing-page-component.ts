import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageTitleComponent } from '../../shared/components/page-title/page-title'; 

@Component({
  selector: 'app-landing-page',
  standalone: true,

  imports: [RouterModule, PageTitleComponent], 
  templateUrl: './landing-page-component.html'
})
export class LandingPageComponent { }