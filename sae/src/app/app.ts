import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { FooterComponent } from './footer-component/footer-component';
import { HeaderComponent } from './header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookieBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-app');
}
