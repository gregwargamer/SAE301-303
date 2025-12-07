import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  readonly apiBase = 'http://localhost/td3/sushi_box/api';

  readonly boxesUrl = `${this.apiBase}/boxes/index.php`;
  readonly panierUrl = `${this.apiBase}/panier/index.php`;
  readonly loginUrl = `${this.apiBase}/user/login.php`;
  readonly registerUrl = `${this.apiBase}/user/add_user.php`;
}
