# Bling ERP

Integração para gestão de estoque, pedidos e logística via [Bling](https://www.bling.com.br/home):

- Exportação de produtos automática ou manual da E-Com Plus para o Bling ERP;
- Importação de produtos do Bling para a E-Com Plus;
- Atualização automática de estoque do Bling para a E-Com Plus (ou vice-versa) por SKU;
- Atualização automática de preços da E-Com Plus para o Bling por SKU;
- Exportação de pedidos automática ou manual da E-Com Plus para o Bling;
- Atualização automática de status de pedidos exportados;
- Importação de status de pedido, código de rastreamento e/ou nota fiscal pelo número;
___
<div class="alert alert-info">
  Crie sua conta Bling com o <b>cupom <code>#ecomclub</code></b> para ganhar 3 meses de teste.
</div>

___

## Tutorial de Configuração:

Instale o aplicativo na plataforma da E-com Plus e depois vá nas configurações do Bling conforme passo a passo abaixo:

### Parametrização Bling:

Você deve acessar a sua conta do Bling, e ir até o menu “Preferências”, localizado no canto superior direito.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config1.png)

Na barra lateral selecione a opção Sistema e depois clique em “usuários e usuário API”.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config2.png)

Uma nova tela será aberta, e então clique em “incluir um usuário”, selecione a opção de “usuário API”, e então preencha as informações de nome e e-mail. No campo API Key, clique em gerar. No menu abaixo você deverá selecionar todas as opções dos campos de Cadastros, Suprimentos e Vendas, conforme exemplo abaixo:


![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config3.png)

Agora copie o código do API Key no Bling e cole no Campo API Token do aplicativo do Bling na E-com Plus, que está instalado nos aplicativos:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config4.png)


### Integrações:

Após criar o usuário, o segundo passo é criar a sua loja no Bling, para isso acesse novamente o menu “Preferências” no painel do Bling, selecione o menu “Integrações”, e agora clique em “Configurações de integração com lojas virtuais e marketplaces”.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config5.png)

No campo de busca de busca digite a palavra “API”, e selecione a opção de Bling API.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config6.png)

Insira no campo Canal de Venda o nome E-com Plus e clique no botão salvar.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config7.png)


## Cadastrando produtos no Bling:

Quando você opta por integrar o Bling à E-com Plus, alguns dados são sincronizados entre as duas plataformas, evitando que você precise fazer o cadastro de produtos duas vezes.

Para que os produtos sejam exportados corretamente para E-com Plus, você primeiro precisa definir as integrações que vão ser feitas:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config8.png)

<div class="alert alert-info">
  Esta inseguro? Exporte todo o seu cadastro na E-com Plus antes de iniciar o processo de integração e tenha esse backup como segurança. 
</div>

 Procure sempre o nosso [suporte](https://community.e-com.plus/) caso tenha alguma dúvida.

### Como cadastrar produtos no Bling:

É importante que você entenda quais campos serão sincronizados, então segue abaixo a lista com a especificação de cada campo:

| Campo no Bling              | Especificação e Equivalência                                                                                                                             |   |   |   |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|---|---|---|
| Código (SKU)                | Este campo é OBRIGATÓRIO. Sem ele a exportação não funcionará.  Ele é a chave de conexão do produto entre as duas plataformas.                           |   |   |   |
| Descrição                   | O campo descrição no Bling equivale ao campo **nome do produto** no cadastro do produto da E-com Plus.                                                   |   |   |   |
| Dados gerais > Preço venda  | O campo **preço venda** no Bling equivale ao campo **preço de venda** no painel do produto na E-com Plus                                                 |   |   |   |
| Estoque                     | O campo estoque no Bling fica visível apenas em Suprimentos > Controle de estoques.                                                                      |   |   |   |
| Fornecedor > Marca          | O campo **marca** no Bling equivale ao **marcas** no cadastro da E-com Plus.                                                                             |   |   |   |
| Dados gerais > Peso Bruto   | O campo **peso bruto** no Bling equivale ao **peso** Aba frete no cadastro do produto na E-com Plus.  *O peso líquido não será importado.*               |   |   |   |
| Dados gerais > Largura      | Preencha o campo **largura** no Bling com a largura exata do produto.  Este campo será vinculado ao campo **largura** Na aba Frete no painel E-com Plus. |   |   |   |
| Dados gerais > Altura       | O campo **altura** no Bling equivale ao campo **altura** no painel da E-com Plus.                                                                        |   |   |   |
| Dados gerais > Profundidade | O campo **profundidade** no Bling equivale ao campo **comprimento** no painel de controle da E-com Plus.                                                 |   |   |   |
| Dados gerais > GTIN/EAN     | O campo **GTIN/EAN** no Bling equivale ao campo **GTIN / ISBN / UPC** no cadastro da E-com Plus.                                                         |   |   |   |


### Cadastrar produtos com variações no Bling:

Se você tem dúvidas sobre como cadastrar produtos (principalmente cadastros com variação de cor e tamanho), [clique aqui](https://ajuda.bling.com.br/hc/pt-br/articles/360035987033-Cadastrar-produtos-com-varia%C3%A7%C3%A3o) e confira o manual de cadastro de produtos do Bling.


####  Variação Simples
Deve-se informar o nome do atributo e o seu respectivo valor separados por ":" sem espaço ( atributo:valor ).

Consideramos que o produto Camisa tenha apenas tamanhos, seu atributo é "Tamanho" e o seu valor é "P", dessa forma deve ser informado como nome "Tamanho:P";

#### Variação Dupla
Deve-se utilizar o mesmo método citado acima, apenas adicionando o segundo atributo além do separador ";" entre eles ( atributo1:valor1;atributo2:valor2 ).

Consideramos que o produto Camisa Preta P, seus atributos são "Cor" e "Tamanho", já seus valores são "Preta" e "P" respectivamente, dessa forma deve ser informado como nome "Cor:Preta;Tamanho:P"


### Informações sobre os seus pedidos 
A E-com Plus envia os pedidos de acordo com o parâmetro selecionado na aba *configuração*:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config9.png)

Os dados de Nota fiscal, são enviados para a E-com Plus no momento que a Nota fiscal passa a ter o status de Emitida/DANFE. 

Para que o pedido tenha o status alterado para enviado na E-com Plus, é preciso que ele esteja com a situação de enviado. 

Para dar baixa no estoque dos produtos no Bling quando ocorrerem pedidos você deve configurar as atualizações de reserva de estoque para: Em aberto, Em andamento, Em digitação, Verificado. 

Acesse essa configuração em Preferências > Suprimentos > Estoque, e insira as informações no campo Considerar situações de vendas para obter o saldo atual.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config10.png)


### Dica importante:

Os campos sincronizados devem ser corrigidos/modificados apenas no Bling. Caso você corrija/modifique alguma destas informações no painel de controle da E-com Plus, estas informações serão sobrescritas pelos dados cadastrados no Bling assim que rodar a próxima rotina de sincronização.


## Importação - Exportação de  produtos / Pedidos manualmente:

Se houver produtos ou pedidos que deseja **exportar ou importar** entre as plataformas, vá em Exportação/Importação manual e informe as informações nos locais informados abaixo:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config11.png)


## Configuração para novos pedidos no Bling:

Configure como será gerado no Bling os novos pedidos gerado na E-com Plus:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config12.png)


## Logs de erros:

No aplicativo na E-com Plus existe o acompanhamento dos logs. Dessa forma, você pode verificar o que causou a falha ou consultar se o envio foi concluído corretamente.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config13.png)

