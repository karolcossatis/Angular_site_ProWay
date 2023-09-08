import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrinhoService } from 'src/app/carrinho.service';
import { NotificacaoService } from 'src/app/notificacao.service';
import { IProduto, IProdutoCarrinho } from 'src/app/produtos';
import { ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.css']
})
export class DetalhesProdutoComponent {
  produto: IProduto | undefined;
  quantidade = 1;

  constructor(
    private produtosService: ProdutosService,
    private route: ActivatedRoute,
    private notificacaoService: NotificacaoService,
    private carrinhoService: CarrinhoService
  ){}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap; 
    //serve para pegar todos os parametros da rota
    const produtoId = Number(routeParams.get('id'));
    //pegar o id e usar na rota
    //o number aqui é usado para converter a string passada em um number, para o id
    this.produto = this.produtosService.getOne(produtoId);
    //produto recebe produtoservice, getOne pega o produto e obtem o id, como ele espera um numero pro id
    //na declaração anterior que busco o id, preciso converter a string em id. 
  }

  adicionarAoCarrinho(){
    this.notificacaoService.notificar("O produto foi adicionado ao carrinho");
    //aqui chamamos uma função de notificar, utilizando o notificaçãoService
    
    const produto: IProdutoCarrinho = {
      ...this.produto!,
      quantidade: this.quantidade
    }
    this.carrinhoService.adicionarProduto(produto);
  }
}
