import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class ConfirmationComponent implements OnInit {
  commandeId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // recuperation de l'id de commande depuis l'url
    this.commandeId = this.route.snapshot.queryParamMap.get('id');
  }
}
