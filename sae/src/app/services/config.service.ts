import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  //readonly apiBase = 'http://localhost/sitevassil/Sans%20titre/SAE301-303/sushi_box/api';
  //readonly apiBase = 'https://basesae-api.9265cwwfn9.workers.dev';
  //readonly apiBase = 'http://localhost:8787';
  readonly apiBase = 'http://localhost/td3/sushi_box/api';

  readonly boxesUrl = `${this.apiBase}/boxes/index.php`;
  readonly boxDetailUrl = `${this.apiBase}/boxes/get.php`;
  readonly bestSellersUrl = `${this.apiBase}/boxes/bestsellers.php`;
  readonly nouveautesUrl = `${this.apiBase}/boxes/nouveautes.php`;


  readonly panierUrl = `${this.apiBase}/panier/index.php`;
  readonly loginUrl = `${this.apiBase}/user/login.php`;
  readonly registerUrl = `${this.apiBase}/user/add_user.php`;
  readonly commanderUrl = `${this.apiBase}/order/commander.php`;
}
