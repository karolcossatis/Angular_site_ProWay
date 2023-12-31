import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-barra-pesquisa',
  templateUrl: './barra-pesquisa.component.html',
  styleUrls: ['./barra-pesquisa.component.css']
})
export class BarraPesquisaComponent {
  descricao = "";

  constructor(
    private router: Router
  ){}

  pesquisar(){
    if (this.descricao) {
      this.router.navigate(["produtos"], { queryParams: { descricao: this.descricao }});
      return;
    }

    this.router.navigate(["produtos"]);
  }
}
