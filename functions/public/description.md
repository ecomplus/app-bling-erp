# Bling ERP

Integração para gestão de estoque, pedidos e logística via [Bling](https://www.bling.com.br/home):

- Exportação de produtos automática ou manual da E-Com Plus para o Bling ERP;
- Importação de produtos do Bling para a E-Com Plus;
- Atualização automática de estoque do Bling para a E-Com Plus (ou vice-versa) por SKU;
- Atualização automática de preços da E-Com Plus para o Bling por SKU;
- Exportação de pedidos automática ou manual da E-Com Plus para o Bling;
- Atualização automática de status de pedidos exportados;
- Importação de status de pedido, código de rastreamento e/ou nota fiscal pelo número quando essa informação está no pedido antes da alteração de status;

<div class="alert alert-info">
  Crie sua conta Bling com o <b>cupom <code>#ecomclub</code></b> para ganhar 3 meses de teste.
</div>

___

## Configuração no Bling

**1**) Cadastre o usuário API no menu **Preferências** (![cog](https://user-images.githubusercontent.com/35343551/114405277-e844b900-9b7c-11eb-89e0-4a7093b16108.png)
) > **Sistemas** > **Usuários e usuário API**. 

![bling-init](https://user-images.githubusercontent.com/35343551/114407289-a0269600-9b7e-11eb-8ccb-2bb9b7a5e70c.png)

![bling-init-1](https://user-images.githubusercontent.com/35343551/114407344-ac125800-9b7e-11eb-85c0-b918cba725bf.png)

**2**) Na tela de usuários cadastrados clique em **Incluir um usuário**

![bling-init-1-2](https://user-images.githubusercontent.com/35343551/114407524-dbc16000-9b7e-11eb-9201-1727600ba44b.png)

**3**) Na tela de cadastro, escolha a opção **Usuário API**, preencha os campos de nome e e-mail, e clique em '**Gerar**' - uma nova **API key** será gerada, copie este código, pois ele será usado nos próximos passos no painel da **E-Com Plus**.

**4**) Em **Permissões** habilite todas opções de **Cadastros**, **Vendas**, **Suprimentos** e **salve**.

![bling-init-3](https://user-images.githubusercontent.com/35343551/114408048-6bffa500-9b7f-11eb-884a-c65c93ba2bb0.png)

## Configuração na E-Com Plus

### Instalar e inserir token na E-Com Plus

**1**) Acesse seu painel **E-Com Plus**

**2**) Vá em **Aplicativos** > **[Bling ERP](https://app.e-com.plus/#/apps/edit/114142)** e clique em **Instalar**:

![bling-init-4](https://user-images.githubusercontent.com/35343551/114413345-49bc5600-9b84-11eb-80a9-707c27b6a2dd.png)

**3**) Com o código **API KEY** copiado na etapa anterior **3**, acesse aba de **configuração** e cole no Campo **Chave da API Bling** e **salve**.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config4.png)

**4**) Caso você tenha outras multilojas (martkeplaces, lojas físicas ou mesmo lojas virtuais) no Bling, é interessante inserir no campo **Código da loja no Bling** no painel da **E-Com Plus**, o **Código da loja API Bling**, mais a frente será comentado como realizar esse procedimento. Caso não tenha, pode deixar esse campo em branco.


### Criar loja da E-Com Plus no Bling

**1) Preferências** (![cog](https://user-images.githubusercontent.com/35343551/114405277-e844b900-9b7c-11eb-89e0-4a7093b16108.png)
) > **Integrações** > **Configurações de integração com lojas virtuais e marketplaces**.

![bling-init-5-1](https://user-images.githubusercontent.com/35343551/114417783-45923780-9b88-11eb-9e59-62c592066690.png)

![bling-init-5-2](https://user-images.githubusercontent.com/35343551/114418062-88540f80-9b88-11eb-87b2-d6c8575d18bb.png)

**2**) No campo de busca de busca digite a palavra “**API**”, e selecione a opção de **Bling API**.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config6.png)

**3**) Insira no campo Canal de Venda o nome **E-Com Plus** e clique no **botão salvar**.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config7.png)

### Configurar callback no Bling ERP

**1**) Acesse então loja virtual que será associada a **E-Com Plus**, clique nela e abrirá as **autenticações**, o código do **Código da loja API Bling**, deverá ser **copiado** e **colado** no painel da **E-Com Plus**, conforme citado no **item 4** da etapa **Instalar e inserir token na E-Com Plus**.

![bling-init-6](https://user-images.githubusercontent.com/35343551/114429682-036ef300-9b94-11eb-874c-1a5ad94b1bf3.png)


![bling-init-6-1](https://user-images.githubusercontent.com/35343551/114429616-f3efaa00-9b93-11eb-85ff-b67fab5aadc2.png)


**2**) Clique na aba **Callbacks**, altere o tipo de retorno para **JSON URLENCODED**. Coloque a seguinte URL 

```
https://us-central1-ecom-bling.cloudfunctions.net/app/bling/callback?token={APIKEY}&store_id={numeroLojaNaEcom}
```
em callback de **estoque** e de **pedidos de venda**:

![bling-init-7](https://user-images.githubusercontent.com/35343551/114428029-1385d300-9b92-11eb-96ef-f7352a2dfa08.png)

A **API Key** é o mesmo que inseriu no campo **Chave da API Bling** no painel da **E-Com Plus** e **numeroLojaNaEcom** é o **store ID** que consta na home do painel da **E-Com Plus**. Exemplo: Se sua **APIKEY**: fce0bn9999ee0e8888a9c99e62b52191f26e999a2aa006a00e e **numeroLojaNaEcom**: 1011, sua URL de callback será https://us-central1-ecom-bling.cloudfunctions.net/app/bling/callback?token=fce0bn9999ee0e8888a9c99e62b52191f26e999a2aa006a00e&store_id=1011

**3**) Deixe o envio de lotes desativado e **salve** as configurações realizadas.

Pronto, no Bling está tudo configurado para que sua loja **Bling** esteja sincronizada com a **E-Com Plus**.

### Integrando E-Com Plus e Bling ERP

Existem algumas configurações que podem ser realizadas de acordo com o fluxo da loja, uma delas é refletir o status da plataforma, para o Bling ERP, para isso veja o tutorial de [Configurar novos status no Bling](https://community.e-com.plus/t/como-configurar-novos-status-no-bling/). As demais podem ser feitas diretamente em seu painel **E-Com Plus**.

Na aba **Geral**:

**1**) Marque a opção **Exportar novos pedidos** para enviar todos os pedidos gerados na plataforma, independente do status que ele esteja ao entrar:

![bling-init-8](https://user-images.githubusercontent.com/35343551/114430652-0a4a3580-9b95-11eb-9936-26616cdd76f6.png)

**2**) Se quiser que seja enviado apenas os pedidos aprovados, selecione a opção 1 e **Apenas pedidos aprovados**, ou seja, o pedido somente será criado no Bling, se o status mudar para aprovado, caso contrário não será enviado o pedido e também não haverá reserva de estoque, caso o mesmo esteja pendente, por isso interessante enviar todos os pedidos.

![bling-init-8-1](https://user-images.githubusercontent.com/35343551/114430814-34035c80-9b95-11eb-8c41-5cba9344ee9f.png)

**3**) Caso tenha outros canais de vendas, você pode ativar o campo: **Randomizar número dos pedidos**, isso irá inserir número do pedido com 8 dígitos evitando conflitar com outro existente no Bling, ou você pode controlar faixas de pedidos inseridos no Bling, exemplo: a loja virtual irá estar na faixa número do pedido 100 mil até 200 mil, a faixa do marketplace A estará na faixa 0 até 100 mil, o marketplace B na faixa 200 mil a 300 mil e assim por diante.

![bling-init-8-2](https://user-images.githubusercontent.com/35343551/114431701-2e5a4680-9b96-11eb-90f3-65ef2ea7dc8f.png)

**4**) Marque a opção **Exportar novos produtos** para enviar produtos ao **Bling** automaticamente, assim que criados.

![bling-init-8-3](https://user-images.githubusercontent.com/35343551/114431812-4a5de800-9b96-11eb-8914-210fc1f75a7e.png)

**5**) Marque a opção **Sobrescrever produtos** para que os produtos importados tenham todas as suas informações subscritas pelas quais existem no painel do Bling, como por exemplo **preço**, **descrição** e **estoque**, se você altera a descrição no Bling, essa opção é valida ativar.

![bling-init-8-4](https://user-images.githubusercontent.com/35343551/114432131-bb050480-9b96-11eb-94c0-d02edf2cfe84.png)

**6**) Marque a opção **Importar estoques**, caso o seu controle de estoque ocorra no **Bling**, necessário ter opção **callback de estoque** configurada. Além disso, sugerimos que desabilite a função **Controle automático de estoque** dos produtos na plataforma.

![bling-init-8-5](https://user-images.githubusercontent.com/35343551/114432492-23ec7c80-9b97-11eb-9a82-e75b79eccd26.png)

**7**) Marque a opção **Exportar estoques**, caso o seu controle de estoque seja na **plataforma E-Com Plus**, callback de estoque não terá efeito, logo **desativado**.

![bling-init-8-6](https://user-images.githubusercontent.com/35343551/114432672-5302ee00-9b97-11eb-9cda-c1aae31c5cda.png)

**8**) Marque a opção **Exportar preços** para que quando alterar um preço na plataforma, o mesmo seja enviado ao **Bling**.

![bling-init-8-7](https://user-images.githubusercontent.com/35343551/114432779-6ca43580-9b97-11eb-8632-5414f2801237.png)

Finalmente clique em **Salvar**.

### Configurando informações dos pedidos

Na aba **Configuração para novos pedidos no Bling**, você configura informações que são enviadas em todos os pedidos, caso tenha alguma informação única que queira enviar e não esteja ai, nos informe no suporte que verificamos a possibilidade de inserí-la, apenas para você.

#### Identificar Vendedor

Insira o nome do vendedor cadastrado no Bling

![bling-init-9](https://user-images.githubusercontent.com/35343551/114434879-e5a48c80-9b99-11eb-8bd0-92c15721effd.png)

#### Cadastrar Natureza da Operação

Insira a natureza da operação, caso tenha uma específica para todos os pedidos, ou coloque uma ao enviar determinado pedido manualmente, ou deixe em branco.

![bling-init-9-1](https://user-images.githubusercontent.com/35343551/114435331-6cf20000-9b9a-11eb-9138-09fbb89fe12b.png)


#### Fixar Frete

Insira o frete fixo que deseja enviar em todos pedidos, interessante para empresas que faturam apenas o valor do pedido, sem considerar o frete (a cargo do comprador), nesse caso, coloque como zero, que em todos os pedidos o frete será enviado como zero. Se ficar em branco, por padrão todos os preços de frete são enviados.

![bling-init-9-2](https://user-images.githubusercontent.com/35343551/114435602-b8a4a980-9b9a-11eb-92f7-019d45b36626.png)


### Importação - Exportação de  produtos / Pedidos manualmente

Se houver produtos ou pedidos que deseja **exportar ou importar** entre as plataformas, vá em Exportação/Importação manual e informe as informações nos locais informados abaixo:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config11.png)

* No caso de **produtos a exportar**, basta digitar o nome do produto e selecionar ele pela integração.
* No caso de **produtos a importar** é necessário digitar o sku dele.
* Não há como trazer pedidos do Bling para a plataforma, quando importa pedidos, é trazido apenas informações presentes nele como status, nfe e código de rastreio para um pedido equivalente na plataforma.

### Logs de processos

No aplicativo na E-Com Plus existe o acompanhamento dos logs. Dessa forma, você pode verificar o que causou a falha ou consultar se o envio foi concluído corretamente. Os retornos `200` e `201` quer dizer que a comunicação foi feita com sucesso!

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config13.png)
