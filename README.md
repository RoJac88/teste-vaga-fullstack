# Teste Prático para Desenvolvedor Full Stack Kronoos

Você foi designado para desenvolver uma aplicação que deve lidar com grandes volumes de dados. Você deve rodar as seguintes validações e tratativas para cada um dos dados do arquivo e mostrar um retorno ao concluir a rotina. A aplicação será responsável por fornecer uma massa de dados considerável (cerca de 30GB) e deve ser capaz de lidar com dados fornecidos.

*Observação Importante:*
1. Pedimos extremo comprometimento com o teste, e utilizamos IA para validar se os testes foram gerados por alguma IA (ChatGPT, LhamaGPT, Bard, Jasper, entre outras). Sua dedicação será crucial para uma avaliação justa.
2. Pedimos que não utilize bibliotecas para efetuar a validação do CPF ou CNPJ. Queremos que você desenvolva o seu próprio algoritmo de validação para que possamos entender qual sua dinâmica de raciocínio.
3. Pedimos que clonem o repo ou façam um fork para o github pessoal e nos sinalizem quando finalizarem, pois não será possível abrir PR neste repositório do teste.

## Manipulação de Dados de CSV e Conversão para Array

- Os dados são fornecidos em formato CSV.
- Utilizaremos a biblioteca fs (File System) para ler o arquivo CSV e a biblioteca csv-parser para processar os dados e convertê-los em um array de objetos JavaScript.

## Conversão de Dados para Moeda Real Brasileira

- Valores monetários, como vlTotal, vlPresta, vlMora, etc., precisam ser formatados como moeda brasileira (BRL).
- Utilizaremos a biblioteca intl do JavaScript para formatar os valores numéricos como moeda BRL, incluindo o símbolo de real (R$), separador de milhar e precisão de duas casas decimais.

## Validação de CPF ou CNPJ

- Implementaremos uma função para validar o campo nrCpfCnpj e verificar se ele é um CPF ou CNPJ válido, seguindo as regras de validação apropriadas para cada formato.
- Parte de todos os CPF e CNPJ sao invalidos, usamos um script para gerar dados fictícios. 

## Validação de Valor Total e Prestações

- Dividiremos o valor de `vlTotal` pela quantidade de prestações (`qtPrestacoes`).
- Verificaremos se o resultado dessa divisão é igual ao valor de `vlPresta` para cada prestação, garantindo que os cálculos estejam corretos e consistentes.

---

A conclusão bem-sucedida deste teste será avaliada com base na implementação eficiente de conceitos como tratamento de dados em larga escala, comunicação assíncrona, gerenciamento de estado, manipulação de CSV, escolha adequada de tecnologias e boas práticas de desenvolvimento.

Boa sorte!

## Observações do candidato

Como rodar a aplicação:
```
pnpm install
pnpm run dev
# ou
pnpm run build
pnpm start
```

## Configuração personalizada

Utilize as variáveis de ambiente `PORT` e `DATA` para alterar a porta usada pelo servidor e o diretório onde ficarão os arquivos csv.

Por padrão será utilizada a porta 3000 e o diretório `/data` na raiz do projeto.

## Endpoints implementados

| Rota         | Função |
| /            | lista os arquivos no diretório `data` |
| /report/:csv | processa e retorna o arquivo csv escolhido |

## Parâmetros

A rota `report` aceita parâmetros via query string para desabilitar algumas funcionalidades no processamento do arquivo:

- **rawCurrency**=1: Desativa a formatação da moeda
- **noCorrection**=1: Desativa a correção do valor da prestação
- **allowInvalidId**=1: Mostra linhas com cpf ou cnpj inválido

Por exemplo: `http://localhost:3000/report/data.csv?rawCurrency=1&allowInvalidId=1` incluí CPFs e CNPJs inválidos e não formata a moeda.

Por padrão as linhas com CPFs e CNPJs inválidos não são retornadas, a moeda é formatada e o valor da prestação é recalculado quando estiver incorreto.
