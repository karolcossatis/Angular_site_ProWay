*site pro-way
- criei a pasta no pc 
-git init pra iniciar como repositorio
- abri no vs code e para gerar novo projeto em Angular: ng new Site_proway. (add angular routing- Y / formato estilo CSS)
- abrir o projeto : cd site_proway
-npm start

--COMEÇANDO O PROJETO--

-criar o primeiro componente que será o HEADER do site, como ele vai ser usado em todo o site, vou adicionar esse componente no modulo geral (app.module)

-componente header estilizado:
    .Usei icones do fontawesome, pra isso, coloquei o link do cdn no index.html do projeto
    .Montei o html do header, e estilizei o header.css e adicionei alguns estilos no css principal: style.css.
    .No app.component.html adicionei o componente :
    <div class="container">
        <app-header></app-header>
    </div>

-criei e adicionei o footer da mesma maneira.

-criar no modulo de rotas: ng g module app-routing --flat --module app.module 
    (flat, serve pra criar uma pasta própria)
    .no app.component.html adiciono o <router-outlet></router-outlet> , assim, agora, as paginas criadas ficaram nesse router-outlet, entre o header e o footer, que são fixos em todas as paginas.

-criar um novo modulo para o conteudo produtos,para usar o modo lazy loading , tb ja crio uma rota produtos --route produtos e atralar ao modulo app.module: --module app.module.
    comando completo: 
        ng g module produtos --route produtos --module app.module 
    obs: ja criou a rota automaticamente no app.routing c lazy-loading:
         { path: 'produtos', loadChildren: () => import('./produtos/produtos.module').then(m => m.ProdutosModule) }

    .se digitar /produtos a página ja estará disponivel, mas queremos que seja a home do site, ou seja, ao abrir o endereço, ja redirecione para lá. no app-routing:
        {path: "", redirectTo: "produtos", pathMatch: "full"}

    .FAZER Pagina NOT-FOUND:
            novo componente - nao encontrado, e por assim na rota:
          {path: "**", component: NaoEncontradoComponent },  
    
    .construir o produtos.html  e estilizar

    . na pasta app, vou criar um "mock", produtos.ts - onde vai entrar a minha lista de produtos.
        nesse arquivo vai conter uma interface de produtos --> um objeto IProduto
     EXEMPLO:      IProduto {
                        id: number;
                        descricao: string;
                        preco: number;
                        descricaoPreco: string;
                        imagem: string;
                    }

    nessa interface tb vamos exportar a lista de arrays desse objeto: 
    EXEMPLO:

        export const produtos = [
        { id: 1, descricao: "Mouse gamer", preco: 439.00, descricaoPreco: "À vista no PIX", imagem: "/assets/mouse-3.jpg" },
        { id: 2, descricao: "Monitor muito bom", preco: 1200.50, descricaoPreco: "À vista no PIX", desconto: 2000.00, imagem: "/assets/monitor-1.jpg" },
        ]

    - carregar as imagens dos produtos em assets e vamos usar um metodo do ngmodules para carregar essas imagens. :
        *ngFor="let produto of produtos" coloquei na div do card produtos assim:
        <div class="product-list__card" *ngFor="let produto of produtos">

        .criar esse parametro produtos dentro de produtos.ts: 
            export class ProdutosComponent {
            produtos: IProduto[] =  produtos; 
            //aqui, definir que o produtos declarado no produtos.html no ngFor , é o produtos do vetor IProduto 
        
        .Para adicionar as informaçoes de forma dinamica, que estao no arrau de IProdutos:

            <img [src]="produto.imagem" >
            <h2 class="product-item__name">
                {{ produto.descricao }} 
            </h2>
            <p class="product-item__price">
                {{ produto.preco | currency: "BRL"}} //esse currency é para por em reais.
            </p>
            <p class="product-item__price-description">
                {{ produto.descricaoPreco }}
            </p>
        
        .Para que eu seja direcionada para a página do produtos escolhido, atrelar o link com o id vou usar no router link na tag <a>

             <a routerLink="/produtos/{{produto.id}}" class="product-list__link">
        
* criar a página com detalhes dos produtos
    .gerar novo componente detalhes-produto dentro da pasta produtos, atrelado ao modulo de produtos:
        ng g component produtos/detalhes-produto --module produtos.module

    .na rota de produtos 'produtos.routing.module.ts' , adiciono a roda pra qd for adicionado o id do produto (qd eu clicar em um produto vai redirecionar por conta do id):
         { path: ':id', component: DetalhesProdutoComponent}

    .Fiz o template no detalhes-produtos.ts e estilizei no detalhes-produtos.css

    .Vamos aplicar a lógica para que fique dinamico, de acordo com cada produto/id.
        .criar o produtos.service
        .No 'produtos.service.ts' :  vamos declarar a propriedade produtos, que sera o vetor IProdutos. 
    e adicionar 2 metodos , getAll- que vai retornar a lista de produtos  e o getOne que vai receber o id do produto, e retornar somente o produtos que tem aquele id.:
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

    .em produtos.component.ts: implementar o IProdutos 
        .produtos: IProduto[] =  produtos; 
        , mas vamos modificar, e indicar que ele pode ser Iprodutos ou indefinido:
             produtos: IProduto[] | undefined; 
        .Vamos usar o service, para implementar o método dos produtos:
           constructor(
            private produtosService: ProdutosService
            ){}

            ngOnInit(): void {
            this.produtos = this.produtosService.getAll();
            }
        
    .Vamos injetar tb o service de produtos no detalhes-produtos:
        constructor(
        private produtosService: ProdutosService
         ){}

    .e a rota:
        private route: ActivatedRoute
    
    .ao iniciar o componente:
         ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const produtoId = Number(routeParams.get("id"));
        this.produto = this.produtosService.getOne(produtoId);
        }

. Modificar o template de detalhes-produto, para usar as infos do vetor IProduto:
        {{ produto?.preco }}
        'aqui o ? deve ser pq ele pode ser ou nao undefined, se nao for undefined, ele vai usar a informação do produto.preco'

.na propriedade quantidade no html, vou usar o two-way data binding, para que o que que digitar no input quantidade, fique armazenado. 
    . declarar a propriedade quantidade no detalhes-produto.component.ts
            quantidade = 1;
    .importar o FormModule no produtos.ts para usar o ngmodel - twoway data-binding
    . no html do detalhes-produtos:
         <input type="number" [(ngModel)]="quantidade" min="1"> 
         obs. o min é uma propriedade do proprio input

.Fez uma alteração no vetor IProduto, adicionamos uma propriedade:
    quantidadeEstoque: number;
.e declaramos que produto é um vetor de IProduto:
    export const produtos: IProduto[] = [


*COMO USAR BIBLIOTECAS DE COMPONENTES Prontos NO ANGULAR

.Vamos adicionar um snackbar no projeto, e para isso usar o material.angular.io 
.para instalar a biblioteca:    
         ng add @angular/material
.importar no app.module.ts o componente que quero com angular/material
    import {MatSnackBarModule} from '@angular/material/snack-bar'

    imports: [
            MatSnackBarModule
    ],

. Vamos criar um novo service de notificação, e usar esse componente snackbar junto.
    .ng g service notificacao
    .importar o snackbar de @angular/material
    .declarar no constructor:  private snackBar: MatSnackBar
    .criar metodo notificar:
            notificar(mensagem: string) {
            this.snackBar.open(mensagem, "ok", {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "center"
            });
    
.Vou usar este service notificação em um método dentro de produtos-detalhes.ts
    instaciar service: private notificacaoService: NotificacaoService
.declarar o metodo: 
    adicionarAoCarrinho(){
        this.notificacaoService.notificar("O produto foi adicionado ao carrinho");
    }
.atrelar o metodo ao clique do botao:
    .dentro do template detalhes-produtos.html :
    <button (click)="adicionarAoCarrinho()">Adicionar ao carrinho</button>
.agora ao clicar no botao "adicionar ao carrinho", já está notificando na tela com o snackbar

*Precisamos aplicar a lógica do carrinho, pra isso vamos fazer uma nova service para atender a lógica dessa propriedade.
    .ng g service carrinho 
    .defino a classe itens no carrinho.service: 
        itens: 
    .Crio a interface no produtos.ts que sera usada pela classe itens, nesse caso é uma extensao de iprodutos, com um atributo a mais, quantidade:

        export interface IProdutoCarrinho extends IProduto {
        quantidade: number;
        //Qual propriedade que iprodutocarrinho e iproduto tem de diferente? seria a quantidade, 
        //que será a quantidade adicionada no carrinho na hora da compra.
    }
    .volto no carrinho.service.ts:
         itens: IProdutoCarrinho[] = [];
        //classe itens é um vetor de iprodutoscarrinho e inicia como um vetor vazio

. ainda no carrinho.service.ts vamos criar os métodos relacionados ao carrinho:
        
.obtemCarrinho() 
            {
                const carrinho = localStorage.getItem("carrinho");
                // carrinho, busca informaçoes de  = localStorage do navegador e a chave é "carrinho"
                //como aqui o foco nao é o backend, usamos o localStorage salvar as infos do carrinho,
                //pelas infos do cookie. 
                //
                return carrinho
            }

            .refatorei aqui:
            pois - a chave irá retornar uma string, e essa pode retornar uma string vazia por isso o || "",  e por ser string precisa ser convertida em objeto , por isso o JSON.parse:

            obtemCarrinho() {
                const carrinho = JSON.parse(localStorage.getItem("carrinho") || "");
                return carrinho
            }

.metodo adicionarProduto():
            .  adicionarProduto(produto: IProdutoCarrinho) {
                    //vai receber um produto, do tipo IProdutocarrinho
                    //e preciso salvar o iten q vou obter do localstorage:
                this.itens.push(produto);
                  //vou acrescentar um novo produto no array itens com um push
                localStorage.setItem("carrinho", JSON.stringify(this.itens));
                     //e salvar novamente no localstorage
                    //poderia usar só o this,itens, porém o setItem recebe uma chave e um o valor 
                    //o JSON.stringify vai transformar o objeto em uma string para salvar
            }

.metodo de limpar o carrinho:
             limparCarrinho(){
            this.itens = []
            localStorage.clear();
         }

*vamos usar esse service no componente detalhes-carrinho.ts / no metodo adicionarAoCarrinho()
    .adicionarAoCarrinho(){
    this.notificacaoService.notificar("O produto foi adicionado ao carrinho");
            //aqui chamamos uma função de notificar, utilizando o notificaçãoService

    const produto: IProdutoCarrinho = {
        //criar o produto aqui, o tipo dele é IProduto 
      ...this.produto!,
      //aqui indica que ele é tudo que ja tem dentro de um produto,
      //o ! é para indicar que nao vai ser indefinido, pq o produto inicialmente pode ser produto ou vazio.
      quantidade: this.quantidade
      //e que vai ter a quantidade, q ele vai pegar de quantidade, por isso o this.quantidade
    }
    this.carrinhoService.adicionarProduto(produto); 
        // passar aqui no parametro o produto 
  }

  .podemos conferir pelo console -- aplicação - armazenamento local; que o item esta sendo salvo!

.vamos adicionar mais um detalhe relacionado ao carrinho. na navbar em carrinho tem a opcao de mostrar quantidade de itens do carrinho:
    .no hearder.component.ts ,injetar o service carrinho
         constructor(
        public carrinhoService: CarrinhoService
        ){}
    . e no template usar a info dentro do badge:

*CRIAR PÁGINA CARRINHO:

.ng g module carrinho --route carrinho --module app.module 
(cria modulo +adiciona rota carrinho + atrela ao modulo principal app.module)

.montei o template no carrinho.html, inicialmente com as infos fixas/provisorias , depois de implementar as funcionalidades vamos mudar para a forma dinamica {{}}. 

.alterei o css da pagina carrinho.

.no carrinho.comnponent.ts vamos implemntar a funcionalidade dessa pagina:
    .INJETAR o service , CarrinhoService pois vamos usar o metodo declarado lá:
        constructor(
            public carrinhoService: CarrinhoService
        ){}

    .DEFINIR a propriedade itensCarrinho , que será um array/ vetor do vetor IProdutosCarrinho:
          itensCarrinho: IProdutoCarrinho[] = [];

    .DECLARAR O METODO usado pela pagina carrinho, ao iniciar essa pagina, disparar o metodo obtemCarrinho, um metodo que esta definido em CarrinhoService e que vai popular a propriedade itensCarrinho:
         ngOnInit(): void {
        this.itensCarrinho = this.carrinhoService.obtemCarrinho();
         }

    .Vou refatorar o obtecarrinho, pois o mais correto seria 
        buscar o this.itens e converter json:
            this.itens = JSON.parse(localStorage.getItem("carrinho") || "");
        e depois retornar o this itens atualizado
            return this.itens

.Com as funcionalidades do CARRINHO.COMNPONENT.TS  definidas, vou alterar agora o CARRINHO-HTML e adicionar a diretiva *NGFOR para deixar a página dinamica; para cada item do carrinho irá criar uma lista e  mostrar o produto relacionado:
    no <li *ngFor="let itemCarrinho of itensCarrinho">
            <img [src]="itemCarrinho.imagem">
            <p>{{ itemCarrinho.descricao }}</p>
            <p>{{ itemCarrinho.preco }}</p>
            <label>
                Quantidade
                <input type="number" [(ngModel)]="itemCarrinho.quantidade" >
            </label>
            OBS!!!! para funcionar o ngmodel precisa importar o formsmodule no modulo respectivo!

.vamos criar o metodo remover do carrinho dentro de carrinho.servirce:
    .  removerProdutoCarrinho(produtoId: number) {
    this.itens = this.itens.filter(item => item.id !== produtoId);
    //percorrer os itens - vai filtrar os itens e deixar todos os itens que tem o id diferente
    //do produtoID selecionado(que esta no parametro)

    //e em seguida vai salvar novamente a lista atualizada no localstorage
    localStorage.setItem("carrinho", JSON.stringify(this.itens));
  }

.como deixei a classe carrinho como public dentro do meu carrinho.component, eu consigo utilizar o metodo direto no meu template , html. 
    <button class="remove-button" (click)="carrinhoService.removerProdutoCarrinho(itemCarrinho.id)">
 
.refatorando: 
    -->fiz o metodo removerProdutoCarrinho dentro do carrinhoService 
          removerProdutoCarrinho(produtoId: number) {
    this.itens = this.itens.filter(item => item.id !== produtoId);
    //percorrer os itens - vai filtrar os itens e deixar todos os itens que tem o id diferente
    //do produtoID selecionado(que esta no parametro)

    //e em seguida vai salvar novamente a lista atualizada no localstorage
    localStorage.setItem("carrinho", JSON.stringify(this.itens));
  }
    -> implemenetei esse service na minha classe dentro de carrinho.component.ts :
          removerProdutoCarrinho(produtoID: number) {
    this.itensCarrinho = this.itensCarrinho.filter( item => item.id !== produtoID);
    this.carrinhoService.removerProdutoCarrinho(produtoID);
  }
    --> no template alterei para:
        <button class="remove-button" (click)="removerProdutoCarrinho(itemCarrinho.id)">

*na PAGINA CARRINHO:
.quando não tem produtos, deve mostrar outro conteudo, para isso:
    .vamos usar a diretiva *ngif - se tiver algum item no carrinho, vai abrir a lista de produtos , else, vai abrir um outro componente de carrinho vazio 
        <div *ngIf="itensCarrinho.length > 0; else semProduto">
    .depois da div que apresenta a lista de produtos, adiciono o template do else:
        <ng-template  #semProduto>Nenhum produto no carrinho</ng-template>

.calcular o total da maneira correta:
    .criar metodo calculaTotal . foi criado no carrinho.component.ts
         total = 0;

         calculaTotal() {
        this.total = this.itensCarrinho.reduce((prev, curr) => prev + (curr.preco * curr.quantidade), 0);
        //total recebe os itens do carrinho, como vetor tem a funcao reduce. 
        //reduce percorrer todos os elementos e pode trazer o prevency = prev e o currency = curr
        //prev=elemento anterior e o curr=elemento em seguida
        // o 0 no final é pq ele pode ser 0 default
        }
    .adicionar esse metodo no Oninit: 
        this.calculaTotal(); 
    .adicionar no template: 
        <h2 class="cart-total">Total: {{ total | currency: "BRL" }}</h2>
.Precisamos tb fazer decrementar do total em caso de remocao do carrinho:
    . é só adicionar o this.calculaTotal no fim do metodo de remove carrinho:
         removerProdutoCarrinho(produtoID: number) {
            this.itensCarrinho = this.itensCarrinho.filter( item => item.id !== produtoID);
            this.carrinhoService.removerProdutoCarrinho(produtoID);
            this.calculaTotal();
            }
    .quero tambem poder alterar total, quando modificar o input com a quantidade de produto:
        .<input type="number" [(ngModel)]="itemCarrinho.quantidade" (change)="calculaTotal()" >

.dando funcionalidade ao BOTAO COMPRAR:
     .Criar o metodo comprar no carrinho.componente.ts
      comprar(){
        alert("Parabens, você finalizou a sua compra!");
        this.carrinhoService.limparCarrinho();
        this.router.navigate(["produtos"])
        }
    .atrelar funcionalidade ao evento de click do mouse no botao comprar:
        <button class="buy-button" (click)="comprar()">Comprar</button>


*PÁGINA CONTATO:
.criar novo modulo contato:
    ng g module contato --route contato --module app.module
.criei o template no html e o css
.vamos fazer uma VALIDAÇÃO REATIVA, que ja valida as informações do formulario de acordo com o conteúdo digitado. 
        .para isso vamos importar dentro do contato.module.ts o:
        - ReactiveFormsModule
        .no constructor do contato.component.ts
        constructor(
        private fb: FormBuilder
         ) { }
        .acima do construtor vamos usar propriedades do formbuilder:
        aqui vou usar uma função de agrupar o formulario
            formContato = this.fb.group({})
        .e vamos usar atributos para validação dos campos:
            formContato = this.fb.group({
            nome: ["", [
            Validators.minLength(4),
            Validators.required
            ]],
            .....

             });

            basicamente as funções aqui usadas sao para validar por tamanho e campo obrigatorio(required)
        .agora no contatoHTML:
        e atrelar ao formulario do html o nome do form definido no componente.ts
             <form [formGroup]="formContato">

            e para cada input definir:
            formControlName="nome" (nome aqui é o nome do input para id)
            tbm vamos usar algumas classes do formcontrols para esses inputs. como por exemplo:
            formatação de valido e invalido:
                 [class.valid]="formContato.controls['nome'].valid"
                [class.invalid]="formContato.controls['nome'].invalid
                caso inválido tenho 2 estados q quero atrelar a ele:
                [class.invalid]="formContato.controls['nome'].invalid &&
                (formContato.controls['nome'].touched || formContato.controls['nome'].dirty)"

                em caso de invalido ainda quero abrir uma mensagem abaixo do input então faço uma dibv q ira abrir case invalid:

                <div *ngIf="formContato.controls['nome'].invalid && (formContato.controls['nome'].touched ||formContato.controls['nome'].dirty)"
                 >
                <small class="error-message" *ngIf="formContato.controls['nome'].hasError('minlength')" >
                    Esse campo precisa de no mínimo 4 caracteres.
                </small>

                <small class="error-message" *ngIf="formContato.controls['nome'].hasError('required')" >
                    Esse campo precisa ser preenchido.
                </small>
                 </div>

                nesse caso usei uma mensagem caso minlegth e required como defini no component.ts anteriormente.

.ngx-mask (mascara nos inputs) - aqui é uma opção para que no input telefone fique no formato desejado de telefone 00 0000-0000 
.intalo com o npm e adiciono no modulo respectivo os imports (!!não funcionou imports!!)

.*adicionar a funcionalidade no BOTÃO ENVIAR FORMULÁRIO: 
    .para isso criamos o metódo de enviarFormulario, vai abrir um alert e limpar o formulario:
        enviarFormulario(){
        alert("A mensagem foi enviada!");
        this.formContato.reset();
        }
    .no button:
        <button [disabled]="formContato.invalid" type="submit">Enviar</button>
        deixei desabilitado em caso formulario invalido e adicionei o type submit 
        assim , a ação ficará no form ,nao no button:
         <form class="contact-form" [formGroup]="formContato" (ngSubmit)="enviarFormulario()">

.BARRA DE BUSCAR PRODUTOS:
    .Criar um componente para a barra de pesquisa, e no html do header add esse novo componente onde ele ficará:
    <appbarra-pesquisa></appbarra-pesquisa>
    
    .no componente barra-pesquisa html vamos usar o ngmodel e ng submit:
            <form class="search-form" (ngSubmit)="pesquisar()">
            <input type="text" name="descricao" [(ngModel)]="descricao">
             <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
            </form>
    .criar a função pesquisar no barra-pesquisa.ts:
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

    .Em produtos.component.ts está a logica de busca por descrição:
        ngOnInit(): void {
        const produtos = this.produtosService.getAll();

        this.route.queryParamMap.subscribe(params => {
        const descricao = params.get("descricao")?.toLowerCase();
        
        if (descricao) {
            this.produtos = produtos.filter(produto => produto.descricao.toLowerCase().includes(descricao));
            return;
        }
        this.produtos = produtos;
        });


*FINALIZANDO A APLICAÇÃO E FAZENDO O DEPLOY NO GITHUBPAGES:

.fazer  o BUILD da aplicação:
    ng build --base-hr="https://karolcossatis.github.io/proway-computers/"

    posso definir a pasta onde ficara o build do projeto dentro de angular.json -> 
     "outputPath": "dist/site-pro-way",