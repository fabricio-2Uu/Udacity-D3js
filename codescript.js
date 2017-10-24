
//Function called after the load of topojson file
function chart(error, brms) {

    if (error) throw error;

    //Calling the data about the car
    d3.csv("fiestaTODOSbr.csv", plotingDados);


    //Function called after load of car data
    function plotingDados(error, dadosCarro) {

      if (error) throw error;       

      //Sequence of html tags for position of canvas and information
      d3.select("body")
        .append("h2")
        .text("Mapa dos Indíces de Furto/Incêndio por Mesoregião");

      d3.select("body")
        .append("h5")
        .text("Veículo: Ford Fiesta 1.6 RoCam");

      d3.select("body")
        .append("div")
        .attr("class", "info")
        .append("h4")
        .attr("class", "nome");

      d3.select(".info")
        .append("h4")
        .attr("class", "expo");

      d3.select(".info")
        .append("h4")
        .attr("class", "freq");

      d3.select(".info")
        .append("h4")
        .attr("class", "ind");

      var width = 750,
        height = 550,
        active = d3.select(null);

      var projection = d3.geo.mercator()
          .scale(700)
          .translate([1000, 100]);

      var path = d3.geo.path()
          .projection(projection);

      var recMapa = d3.select("body")
          .append("g")
          .attr("class", "mapa")
          .append("h3");

      var svg = d3.select(".mapa")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

          d3.select(".mapa")
          .append("h1");

      svg.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height)
          .on("click", reset);

      var g = svg.append("g")
          .style("stroke-width", "1.5px");

      //Creating the map
      g.selectAll("path")
          .data(topojson.feature(brms, brms.objects.Meso).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "feature")
          .on("click", clicked);

      g.append("path")
          .datum(topojson.mesh(brms, brms.objects.Meso, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);

      //Creating the legend
      var legend = svg.append("g")
          .attr("class","legend")
          .attr("transform","translate(" + 10 + "," + 20 + ")")
          .selectAll("g")
          .data(["menor que 0.5%", "entre 0.5% e 1%", "acima de 1%"])
          .enter()
          .append("g");

      legend.append("circle")
          .attr("cy", function(d, i){
              return i * 30;
          })
          .attr("r", 5)
          .attr("fill", function(d) {
              if (d == "menor que 0.5%") {
                return "green";
              } else if (d == "entre 0.5% e 1%") {
                return "yellow";
              } else {
                return "red";
              }
            });

      legend.append("text")
          .attr("y", function(d, i){
              return i * 30 + 5;
          })
          .attr("x", 25)
          .text(function(d){
            return d;
          });


      //Function that generates a response to the click on one of the regions
      function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        //Var to recover the Meso name, then filtrate the data from cars 
        var nomeMeso = d3.select(this).datum().properties.name;
        var mesoFiltered = dadosCarro.filter(function(d){
          return d.mesoregiao == nomeMeso;
        });

        //Call the auxiliaries charts to the Mesoregion
        aux_3_chart(mesoFiltered);

        d3.select(".nome")
          .text(mesoFiltered[0].mesoregiao);

        //Sum of the cars exposed to insurance
        var somaExpo = 0
        mesoFiltered.forEach(function(d){ 
          somaExpo += parseInt(d.expostos);
        });

        d3.select(".expo")
          .text("Total de veículos segurados durante o periodo: " + somaExpo);

        //Sum of cars robbed or burned
        var somaInd = 0
        mesoFiltered.forEach(function(d){ 
          somaInd += parseInt(d.freq_inc_roub);
        });

        d3.select(".freq")
          .text("Total de veículos indenizados integralmente durante o periodo: " + somaInd);

        //Mean of cars robbed or burned
        var medInd = Math.round((somaInd/somaExpo) * 10000)/100;

        d3.select(".ind")
          .text("A média de veículos indenizados no últimos cinco anos na região foi de " + medInd + "%");

        //Variable that define the bounds of the region after one is selected (settled to 50%)
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = .5 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        //Time the transition period and redefine stroke and scale
        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
      }

      //Function that generates a response after a region is selected and is clicked again
      function reset() {
        active.classed("active", false);
        active = d3.select(null);

        g.transition()
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr("transform", "");

        dadosBrasil();
      }

      function key_func(d) {
          return d['key'];
      }

      //Funtion that feed with data the tree auxialiries charts at the right
      function aux_3_chart(d) {

        //Remove the previous charts to avoid overprojection
        d3.selectAll(".aux").remove();

        //Creating the canvas that will be used by the auxiliares charts
        var canvas_expostos = d3.select("body")
          .append("g")
            .attr("class", "aux")
          .append("svg")
            .attr("class", "expostos")
            .attr("width", 300)
            .attr("height", 300)     

        var canvas_sinistros = d3.select("body")
          .append("g")
            .attr("class", "aux")
          .append("svg")
            .attr("class", "sinistros")
            .attr("width", 300)
            .attr("height", 300);

        var canvas_indice = d3.select("body")
          .append("g")
            .attr("class", "aux")
          .append("svg")
            .attr("class", "indice")
            .attr("width", 300)
            .attr("height", 300);

        var myChart = new dimple.chart(canvas_expostos, d);
        var x = myChart.addTimeAxis("x", "ano", "%Y", "%Y");
        x.addOrderRule("Date");
        x.overrideMin = d3.time.format("%Y%m%d").parse("20090601");
        x.overrideMax = d3.time.format("%Y%m%d").parse("20160601");
        var y = myChart.addMeasureAxis("y", "expostos");
        y.title = "Carros Segurados"
        myChart.addSeries(null, dimple.plot.line);
        myChart.addSeries(null, dimple.plot.scatter)
        myChart.setBounds(60, 30, 120, 150)
        myChart.draw();

        var myChart = new dimple.chart(canvas_sinistros, d);
        var x = myChart.addTimeAxis("x", "ano", "%Y", "%Y");
        x.addOrderRule("Date");
        x.overrideMin = d3.time.format("%Y%m%d").parse("20090601");
        x.overrideMax = d3.time.format("%Y%m%d").parse("20160601");
        var y = myChart.addMeasureAxis("y", "freq_inc_roub");
        y.title = "Carros Furtados/Incendiados"
        myChart.addSeries(null, dimple.plot.line);
        myChart.addSeries(null, dimple.plot.scatter)
        myChart.setBounds(60, 30, 120, 150)
        myChart.draw();


        var myChart = new dimple.chart(canvas_indice, d);
        var x = myChart.addTimeAxis("x", "ano", "%Y", "%Y");
        x.addOrderRule("Date");
        x.overrideMin = d3.time.format("%Y%m%d").parse("20090601"); 
        x.overrideMax = d3.time.format("%Y%m%d").parse("20160601");
        var y = myChart.addMeasureAxis("y", "inc_roub_relativo");
        y.title = "Índice de Carros Furtados"
        y.overrideMin = 0.005;
        y.overrideMax = 0.03;
        y.tickFormat = ".2%";
        myChart.addSeries(null, dimple.plot.line);
        myChart.addSeries(null, dimple.plot.scatter)
        myChart.setBounds(60, 30, 120, 150)
        myChart.draw();

      }

      //Creating a set variables to store the years
      var years = d3.set();
      dadosCarro.forEach(function(d)
        {
          years.add(d.ano);
        });

      //Creating a nest variable to group the information by year
      var nested = d3.nest()
        .key(function(d) {
          return d['ano'];
        })
        .rollup()
        .entries(dadosCarro);

      function update(year) {

        //Variable that filter only the year desired
        var filtered = nested.filter(function(d) {
            return d['key'] == year;
        });

        //Variable that filter the data bellow the given year for Brasil
        var nFiltered = dadosCarro.filter(function(d){
          return (parseInt(d.ano) <= year && d.estado == "BR");
        });


        d3.select("h1")
          .text("Ano de " + year);

        //Variable to store the mean of cars robbed by year
        var meanindice = d3.mean(filtered[0].values, function(d) {
              return d.inc_roub_relativo;
        })

        //Var to keep the list of mesoregions
        var meso = []
        filtered[0].values.forEach(function(d) {
          meso.push(d.mesoregiao);
        });

        //Dict with pair of values of mesoregion and claims indice
        var indMeso = {}
        filtered[0].values.forEach(function(d) {
          indMeso[d.mesoregiao] = parseFloat(d.inc_roub_relativo);
        });

        //Function to color the mesoregion
        function update_meso(d) {
          try {
                if (meso.indexOf(d.properties.name) !== -1 && indMeso[d.properties.name] <= 0.005) {
                  return "green";
                } else if (meso.indexOf(d.properties.name) !== -1 && 
                  (indMeso[d.properties.name] > 0.005 && indMeso[d.properties.name] <= 0.01)) {
                  return "yellow";
                } else if (meso.indexOf(d.properties.name) !== -1 && indMeso[d.properties.name] > 0.01) {
                  return "red";
                }  else {
                  return "lightgray";
                }
              }
          catch(error) {
            console.log(error)              
          }
        }

        //Code that call the changes on the map
        svg.selectAll('path')
           .transition()
           .duration(1000)
           .style('fill', update_meso)
           .style('stroke', update_meso);

        //Code that call the auxiliaries charts with the correspond data
        aux_3_chart(nFiltered);
      
      }

      //Function that generate the map and the auxiliaries charts with the Country data 
      function dadosBrasil(){

        var brFiltered = dadosCarro.filter(function(d){
          return (d.estado == "BR");
        });            

        aux_3_chart(brFiltered);

        d3.select(".nome")
        .text("BRASIL");

        var somaExpo = 0
        dadosCarro.forEach(function(d){ 
          somaExpo += parseInt(d.expostos);
        });

        d3.select(".expo")
          .text("Total de veículos segurados durante o periodo: " + somaExpo);

        var somaInd = 0
        dadosCarro.forEach(function(d){ 
          somaInd += parseInt(d.freq_inc_roub);
        });

        d3.select(".freq")
          .text("Total de veículos indenizados integralmente durante o periodo: " + somaInd);

        var medInd = Math.round((somaInd/somaExpo) * 10000)/100;

        d3.select(".ind")
          .text("A média de veículos indenizados integralmente no no período de 2010 a 2015 no Brasil foi de " + medInd + "%");

        d3.select("h3")
          .text("Selecione uma Mesoregião no mapa")          

      }

      //Block of code that generate the iteration over the years
      update(years.values()[0]);

      var year_idx = 1;

      var year_interval = setInterval(function() {
        update(years.values()[year_idx]);
        
        year_idx++;


        if(year_idx >= years.size()) {
            clearInterval(year_interval);

            //Code called after the end of the iteration
            dadosBrasil();

            var buttons = d3.select("body")
              .append("div")
              .attr("class", "years_buttons")
              .selectAll("div")
              .data(years.values())
              .enter()
              .append("div")
              .text(function(d) {
                  return d;
              });

            buttons.on("click", function(d) {
                d3.select(".years_buttons")
                  .selectAll("div")
                  .transition()
                  .duration(500)
                  .style("color", "black")
                  .style("background", "rgb(251, 201, 127)");

                d3.select(this)
                  .transition()
                  .duration(500)
                  .style("background", "lightBlue")
                  .style("color", "white");
                update(d);
            });                                         

        }
      }, 2500);


    } 

}