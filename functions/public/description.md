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

Instale o aplicativo na plataforma da E-Com Plus e depois vá nas configurações do Bling conforme passo a passo abaixo:

### Parametrização Bling:

Você deve acessar a sua conta do Bling, e ir até o menu “Preferências”, localizado no canto superior direito.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config1.png)

Na barra lateral selecione a opção Sistema e depois clique em “usuários e usuário API”.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config2.png)

Uma nova tela será aberta, e então clique em “incluir um usuário”, selecione a opção de “usuário API”, e então preencha as informações de nome e e-mail. No campo API Key, clique em gerar. No menu abaixo você deverá selecionar todas as opções dos campos de Cadastros, Suprimentos e Vendas, conforme exemplo abaixo:


![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config3.png)

Agora copie o código do API Key no Bling e cole no Campo API Token do aplicativo do Bling na E-Com Plus, que está instalado nos aplicativos:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config4.png)


### Integrações:

Após criar o usuário, o segundo passo é criar a sua loja no Bling, para isso acesse novamente o menu “Preferências” no painel do Bling, selecione o menu “Integrações”, e agora clique em “Configurações de integração com lojas virtuais e marketplaces”.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config5.png)

No campo de busca de busca digite a palavra “API”, e selecione a opção de Bling API.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config6.png)

Insira no campo Canal de Venda o nome E-Com Plus e clique no botão salvar.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config7.png)

Acesse então loja virtual que será associada a E-Com Plus, clique nela e abrirá as autenticações, clique na aba Callbacks, altere o tipo de retorno para JSON. Coloque a seguinte URL em todos os 3 campos:

https://us-central1-ecom-bling.cloudfunctions.net/app/bling/callback?token=geradanaapikey(usuarioapi)&store_id=**numerodaloja**  (o número da loja está na página principal do seu dashboard na E-Com Plus).

Feito isso, ative as 3 configurações e Salve, conforme a imagem:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config14.png)

Pronto, no Bling está tudo configurado para que sua loja Bling esteja sincronizada com a E-Com Plus.

### Informações sobre os seus pedidos 
A E-Com Plus envia os pedidos de acordo com o parâmetro selecionado na aba *configuração*:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config9.png)

Os dados de Nota fiscal, são enviados para a E-Com Plus no momento que a Nota fiscal passa a ter o status de Emitida/DANFE. 

Para que o pedido tenha o status alterado para enviado na E-Com Plus, é preciso que ele esteja com a situação de enviado. 

Para dar baixa no estoque dos produtos no Bling quando ocorrerem pedidos você deve configurar as atualizações de reserva de estoque para: Em aberto, Em andamento, Em digitação, Verificado. 

Acesse essa configuração em Preferências > Suprimentos > Estoque, e insira as informações no campo Considerar situações de vendas para obter o saldo atual.

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config10.png)


### Dica importante:

Os campos sincronizados devem ser corrigidos/modificados apenas no Bling. Caso você corrija/modifique alguma destas informações no painel de controle da E-Com Plus, estas informações serão sobrescritas pelos dados cadastrados no Bling assim que rodar a próxima rotina de sincronização.


## Importação - Exportação de  produtos / Pedidos manualmente:

Se houver produtos ou pedidos que deseja **exportar ou importar** entre as plataformas, vá em Exportação/Importação manual e informe as informações nos locais informados abaixo:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config11.png)


## Configuração para novos pedidos no Bling:

Configure como será gerado no Bling os novos pedidos gerado na E-Com Plus:

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config12.png)


## Logs de erros:

No aplicativo na E-Com Plus existe o acompanhamento dos logs. Dessa forma, você pode verificar o que causou a falha ou consultar se o envio foi concluído corretamente. Os retornos `200` e `201` quer dizer que a comunicação foi feita com sucesso!

![exemplo](https://us-central1-ecom-bling.cloudfunctions.net/app/img/config13.png)

