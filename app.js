let mapaMalha;
let mapaDados;

async function loadMapData(){
    let mapaUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF'
    let dadosUrl='https://servicodados.ibge.gov.br/api/v1/localidades/estados';

    let mapaSvg = await fetch(mapaUrl);
    // converte os dados carregados para o formato de string
    mapaMalha = await mapaSvg.text();
    // carrega o arquivo de dados municipais
    let dadosJson = await fetch(dadosUrl);
    mapaDados = await dadosJson.json();

    let mapaConteudo = document.querySelector('#mapa-conteudo');
    mapaConteudo.innerHTML = mapaMalha;

    let elemEstados = document.querySelectorAll('#mapa-conteudo svg path');

    elemEstados.forEach((elemento) => {
        let numAleatorio = Math.random()*0.8; // cria um índice fictício com um número aleatório
        elemento.dataset.indice = (1 - numAleatorio).toFixed(2); // adiciona esse índice aos atributos do elemento

        // determina a opacidade de cor do preenchimento de acordo com o índice
        elemento.setAttribute('fill-opacity', elemento.dataset.indice);
        // determina a função a executar no mouseover
        elemento.onmouseover = marcaMunicipio;
        // determina a função a executar no mouseout
        elemento.onmouseout = desmarcaMunicipio;
    });
}

function marcaMunicipio(event){
    // seleciona o alvo do evento (o vetor do município)
    let elemento = event.target;
    // pega o atributo id do elemento, que tem o código do IBGE
    let codigoAlvo = elemento.id;
    // let codigo = dados.properties.codarea;
    let dadosMunicipio = mapaDados.filter(function(item){
        return item.id === codigoAlvo;
    });

    // pega o nome do municipio do json
    let nome = dadosMunicipio[0].nome;
    // pega a UF desse município do json
    let uf = dadosMunicipio[0].microrregiao.mesorregiao.UF.sigla;

    // tira a classe 'ativo' da seleção anterior, se houver
    let selecaoAnterior = document.querySelector('path.ativo');
    if(selecaoAnterior){ selecaoAnterior.classList.remove("ativo") }

    // adiciona a classe 'ativo' ao elemento atual
    elemento.classList.add("ativo");

    // preenche os elementos com nome, UF e o índice
    document.querySelector('#muni-titulo').textContent = nome + " (" + uf + ") ";
    document.querySelector('#muni-valor').textContent = "índice: " + elemento.dataset.indice;
}

function desmarcaMunicipio(event){
    // seleciona o alvo do evento (o vetor do município)
    let elemento = event.target;
    // remove a classe de destaque
    elemento.classList.remove("ativo");
}

loadMapData();