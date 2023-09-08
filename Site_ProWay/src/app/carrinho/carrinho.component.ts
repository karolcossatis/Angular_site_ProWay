import { Component } from '@angular/core';
import { CarrinhoService } from '../carrinho.service';
import { IProdutoCarrinho } from '../produtos';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent {
  itensCarrinho: IProdutoCarrinho[] = [];
  total = 0;
 

  constructor(
    public carrinhoService: CarrinhoService,
    private router: Router
  ){}

  //metodo para popular a propriedade carrinho
  ngOnInit(): void {
    this.itensCarrinho = this.carrinhoService.obtemCarrinho();
    this.calculaTotal();
  }

  calculaTotal() {
    this.total = this.itensCarrinho.reduce((prev, curr) => prev + (curr.preco * curr.quantidade), 0);
    //total recebe os itens do carrinho, como vetor tem a funcao reduce. 
    //reduce percorrer todos os elementos e pode trazer o prevency = prev e o currency = curr
    //prev=elemento anterior e o curr=elemento em seguida
    // o 0 no final é pq ele pode ser 0 default
  }

  removerProdutoCarrinho(produtoID: number) {
    this.itensCarrinho = this.itensCarrinho.filter( item => item.id !== produtoID);
    this.carrinhoService.removerProdutoCarrinho(produtoID);
    this.calculaTotal();
  }

  comprar(){
    alert("Parabens, você finalizou a sua compra!");
    this.carrinhoService.limparCarrinho();
    this.router.navigate(["produtos"])
  }

}
