# Sobre
O projeto visa apresentar a evolução dos índices de sinistralidade do veículo FORD FIESTA RoCam 1.6 durante o período de 2010 a 2015 utilizando o mapa do Brasil por mesoregiões.

O veículo em questão foi escolhido com o objetivo de verificar afirmações comumente realizadas na mídia e na cultura popular, de que carros que saem de circulação são mais visados por ladrões. Essa ideia se basea no fato de que as peças dos veículos que saíram de circulação se tornam mais procuradas, pois, pelo o que falam, deixam de ser produzidas pelos fabricantes.
O Ford Fiesta RoCam 1.6 deixou de ser produzido na metade de 2014. Os dados disponíveis no site da SUSEP (órgão que regula o mercado de seguros) vão até final de 2015.

# Design

A base do gráfico principal foi escolhido após uma pesquisa no site do Mike Bostock, dentre as várias opções que ele disponibiliza. Considerando que o dados refletiriam regiões do país, sem dúvida a melhor opção seria a apresentação por meio de mapa. Além do mapa, considerei importante a existência de gráficos que apresentassem uma evolução dinâmica dos dados, de forma que o leitor pudesse identificar a tendência geral dos dados apresentados.

Após os feedbacks foram feitas pequenas atualizações no Design para torná-lo mais claro, como realocar informações, aumentar o tamanho dos gráficos auxiliares e melhorar a escala do eixo Y do último gráfico.

# Feedback

**Primeira Sugestão**: Incluir o ano mais próximo do mapa, para que seja possível acompanhar a evolução do mapa e saber o ano específico.

_Resultado_: Sugestão foi acatada e o ano foi incluído abaixo do mapa.

**Segunda Sugestão**: Aumentar os gráficos auxiliares, estão muito pequenos.

_Resultado_: Sugestão foi acatada e os gráficos auxiliares foram ampliados.

**Terceira Sugestão**: Incluir botões com os anos para que seja possível alterar o mapa.

_Resultado_: Sugestão foi acatada e os botões de anos foram incluídos.

**Quarta Sugestão**: A animação está muito rapida.

_Resultado_: Sugestão foi acatada e o intervalo de tempo entre cada ano foi alterado de 2 segundos para 5 segundos.

**Quinta Sugestão**: Acelerar a primeira tela da animação e reduzir o tempo das demais.

_Resultado_: Sugestão foi acatada e a primeita animação é apresentada imediatamente, o intervalo de tempo entre cada ano foi alterado de 5 segundos para 2,5 segundos.

**Sexta Sugestão**: Melhorar o título do eixo Y dos gráficos auxiliares.

_Resultado_: Sugestão foi acatada e o texto do eixo Y foi alterado para ficar mais claro.

## Referências
1. https://bl.ocks.org/mbostock/4699541

2. https://stackoverflow.com/questions/32493963/dimple-bar-chart-hangs-over-y-axis

3. https://github.com/fititnt/gis-dataset-brasil (Arquivo TopoJSON)