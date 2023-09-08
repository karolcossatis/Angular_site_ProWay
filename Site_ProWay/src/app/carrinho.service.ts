import { Injectable } from '@angular/core';
import { IProdutoCarrinho } from './produtos';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  itens: IProdutoCarrinho[] = [];
  //classe itens é um vetor de iprodutoscarrinho e inicia como um vetor vazio

  constructor() { }

  obtemCarrinho() {
    //FEITO 1:
       //const carrinho = JSON.parse(localStorage.getItem("carrinho") || "");
       //return carrinho

   //Refator por melhoria de codigo somente:
       //return JSON.parse(localStorage.getItem("carrinho") || "");

   //Refator após a pagina carrinho feita pois assim é mais completo:
   //ele vai buscar o this.itens e aplicar a logica jsonetc e depois
   //retornar o this.itens ja atualizado:
   this.itens = JSON.parse(localStorage.getItem("carrinho") || "[]");
   //refatorado para, ao inves de string vazia, passar o vetor vazio quando atualizar
   return this.itens;
  }

  adicionarProduto(produto: IProdutoCarrinho) {
    //vai receber um produto, do tipo IProdutocarrinho
    this.itens.push(produto);
    //vou acrescentar um novo produto no array itens com um push
    localStorage.setItem("carrinho", JSON.stringify(this.itens));
    //e salvar novamente no localstorage
    //poderia usar só o this,itens, porém o setItem recebe uma chave e um o valor 
    //o JSON.stringify vai transformar o objeto em uma string para salvar
  }

  removerProdutoCarrinho(produtoId: number) {
    this.itens = this.itens.filter(item => item.id !== produtoId);
    //percorrer os itens - vai filtrar os itens e deixar todos os itens que tem o id diferente
    //do produtoID selecionado(que esta no parametro)

    //e em seguida vai salvar novamente a lista atualizada no localstorage
    localStorage.setItem("carrinho", JSON.stringify(this.itens));
  }


  limparCarrinho(){
    this.itens = []
    localStorage.clear();
  }
}
