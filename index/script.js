
var openBtn = document.getElementsByClassName("openBtn");
var closeBtn = document.getElementsByClassName("closeBtn");
var sections = document.getElementsByClassName("section");
var apiKey = "2a0d63cae69646ddb5bd580d5aa0d0e5";
var btnIndex = {
    0: [4, 4],
    1: [4, 4],
    2: [4, 4]
};
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

window.onload = function () {
    destaques().then(destaques => {
        let str = '';
        let strcarouselIndicators = '';
        let active = "";
        destaques.splice(1, 1);
        for (let i = 0; i < destaques.length; i++) {
            let destaque = destaques[i];
            let genres = destaque.genres[0].name;
            let platforms = destaque.platforms[0].platform.name;
            for (let j = 1; j < destaque.genres.length; j++) {
                genres += `, ${destaque.genres[j].name}`;
            }
            for (let j = 1; j < destaque.platforms.length; j++) {
                platforms += `, ${destaque.platforms[j].platform.name}`;
            }

            if (i == 0) active = 'active';
            else active = '';
            createModal(destaque.id)
            str += `<div class="carousel-item ${active}">
                        <div class="card mb-3 d-block w-100 border-0">
                            <div class="row g-0">
                                <div class="video-box col-md-6">
                                    <img class="img-fluid" src="${destaque.background_image}">
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <h5 class="card-title">${destaque.name}</h5>
                                        <p><b>Lançamento:</b> ${releasedDate(destaque)}</p>
                                        <p><b>Plataformas:</b> ${platforms}</p>
                                        <p><b>Gêneros:</b> ${genres}</p>
                                        <p><b>Avaliação (Metacritic):</b> <span style="color:green"> ${destaque.metacritic}</span></p>
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal${destaque.id}" onclick="moreDetails(${destaque.id})">
                                        Mais detalhes...
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
            strcarouselIndicators += `<button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}" class="${active}"></button>`;
        }
        document.querySelector(".carousel-inner").innerHTML += str;
        document.querySelector(".carousel-indicators").innerHTML += strcarouselIndicators;
    });

    lancamentos().then(lancamentos => {
        let str = '';
        for (let i = 0; i < lancamentos.length; i++) {
            let lancamento = lancamentos[i];
            createModal(lancamento.id);
            str += `
            <div class="col-sm-6 col-md-3">
            <div class="card h-100">
            <img src="${lancamento.background_image}" class="card-img-top" >
              <div class="card-body">
                <h5 class="card-title">${lancamento.name}</h5>
                <p class="card-text">${releasedDate(lancamento)}</p>
                <p class="card-text">${platformNames(lancamento)}</p>
              </div>
              <div class="card-footer border-0 bg-white ">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal${lancamento.id}" onclick="moreDetails(${lancamento.id})">Mais detalhes...</button>
              </div>
            </div>
          </div>`
        }
        document.querySelector("#lancamentos .row").innerHTML += str;
        openBtn.item(0).style.display="block";
    });

    plataformas().then(plataformas => {
        let str = ''
        for (let i = 0; i < plataformas.length; i++) {
            let games = plataformas[i].games;
            let strGames = '';
            for (let j = 0; j < 5; j++) {
                strGames += `• ${games[j].name}<br>`;
            }
            str += ` <div class="col-sm-6 col-md-3 ">
                <div class="card h-100">
                  <img src="${plataformas[i].image_background}" class="card-img-top" >
                  <div class="card-body">
                    <h5 class="card-title">${plataformas[i].name}</h5>
                    <p class="card-text">${strGames}</p>
                    </div>
                    <div class="card-footer border-0 bg-white">
                    <a href="https://pt.wikipedia.org/wiki/${plataformas[i].name.replace(' ', '_')}" class="btn btn-primary float-end">Mais detalhes...</a>
                  </div>
                </div>
              </div>`
        }
        document.querySelector("#plataformas .row").innerHTML += str;
        openBtn.item(1).style.display="block";
    }
    );

}

async function plataformas() {
    return fetch('https://api.rawg.io/api/platforms?key=2a0d63cae69646ddb5bd580d5aa0d0e5')
        .then(res => res.json())
        .then(data => data.results);
}

async function destaques() {
    return fetch('https://api.rawg.io/api/games?key=2a0d63cae69646ddb5bd580d5aa0d0e5&page_size=11&ordering=-metacritic')
        .then(res => res.json())
        .then(data => data.results);
}

async function lancamentos() {
    return fetch('https://api.rawg.io/api/games?key=2a0d63cae69646ddb5bd580d5aa0d0e5&ordering=-released&dates=2022-01-01,2022-12-01')
        .then(res => res.json())
        .then(data => data.results);
}

async function game(id) {
    return fetch(`https://api.rawg.io/api/games/${id}?key=2a0d63cae69646ddb5bd580d5aa0d0e5`)
        .then(res => res.json())
        .then(data => data);
}

function releasedDate(game) {
    released = new Date(`${game.released}`);
    return `${released.getDate()} de ${meses[released.getMonth()]} de ${released.getFullYear()}`;
}

function platformNames(game) {
    let platforms = game.platforms[0].platform.name;
    for (let j = 1; j < game.platforms.length; j++) {
        platforms += `, ${game.platforms[j].platform.name}`;
    }
    return platforms;
}

function openMore(n) {
    closeBtn.item(n).style.display = "block";
    var cards = sections.item(n).children[1];
    for (let index = btnIndex[n][0]; index < btnIndex[n][0] + 4; index++) {
        if (index == cards.childElementCount) {
            openBtn.item(n).style.display = "none";
            break;
        }
        element = cards.children[index];
        element.style.display = "block";
    }
    btnIndex[n][0] += 4;
    btnIndex[n][1] += 4;
}


function closeMore(n) {
    var cards = sections.item(n).children[1];
    for (let index = btnIndex[n][1]; index >= btnIndex[n][1] - 4; index--) {
        if (index < cards.childElementCount) {
            element = cards.children[index];
            element.style.display = "none";
            if (index == 4) {
                closeBtn.item(n).style.display = "none";
                openBtn.item(n).style.display = "block";
                break;
            }
        }
    }
    btnIndex[n][0] -= 4;
    btnIndex[n][1] -= 4;
}

function createModal(id) {
    document.querySelector(".about").innerHTML +=
        `<div class="modal fade" id="modal${id}" tabindex="-1" aria-labelledby="exampleModalLabel" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" >
            <div class="modal-content">
            </div>
        </div>
    </div>`;
}

function moreDetails(id) {
    modalContent = document.querySelector(`#modal${id} .modal-content`);
    if (modalContent.childElementCount == 0) {
        game(id).then(game => {
            let tags = '';
            if (game.tags.length >= 1) {
                tags = `<p> <b> Tags: </b>` + game.tags[0].name;
                for (let j = 1; j < game.tags.length; j++) {
                    tags += ", " + game.tags[j].name;
                }
                tags += "</p>";
            }
            let publishers = '';
            if (game.publishers.length >= 1) {
                publishers = "<p> <b> Publishers: </b>  " + game.publishers[0].name;
                console.log(game.publishers);
                for (let j = 1; j < game.publishers.length; j++) {
                    publishers += ", " + game.publishers[j].name;
                }
                publishers += "</p> ";
            }

            let rating = '';
            if (game.rating > 0) {
                rating += `<p> <b> Avaliações: </b> ${game.rating} </p> `;
            }

            let str = '';
            str += `<div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">${game.name}</h1>
                </div>
                <div class="modal-body">
                <b> Descrição: </b>
                ${game.description_raw}
                <img class="img-fluid" src="${game.background_image_additional}">
                </div>
                <div class="modal-footer ">
                    ${rating}
                    ${tags}
                    ${publishers}
                </div>`
            modalContent.innerHTML += str;
        });
    }
}
