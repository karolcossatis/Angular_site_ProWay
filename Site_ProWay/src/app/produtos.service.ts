import { Injectable } from '@angular/core';
import { IProduto, produtos } from './produtos';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  produtos: IProduto[] = produtos;
  //propriedade produtos vai ser do tipo vetor IProduto e começar com produtos 

  constructor() { }
//vamos descrever 2 metodos para que retorne o id no endereço qd selecionado
  getAll() {
    return this.produtos; 
    //getAll vai retornar a lista de produtos do vetor IProduto
  }

  getOne(produtoId: number) {
    return this.produtos.find(produto => produto.id = produtoId);
  //getone (recebe o id do produto como parametro)
  //retorna a lista de produto + metodo find com a condição (especifica encontrar produto o qual o produto.id seja igual ao id do parametro da função)
    
  }

}
