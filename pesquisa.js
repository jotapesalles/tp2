var searchName = (new URL(document.location)).searchParams.get("name");
var pageNumber = (new URL(document.location)).searchParams.get("page");
var btnIndex = {
    0: [4, 4],
    1: [4, 4],
    2: [4, 4]
};
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

window.onload = function () {
    search().then(content => {
        let results = content.results;
        let str = '';
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            createModal(result.id);
            str += `
            <div class="col-sm-6 col-md-3">
            <div class="card h-100">
            <img src="${result.background_image}" class="card-img-top" >
              <div class="card-body">
                <h5 class="card-title">${result.name}</h5>
                <p class="card-text">${releasedDate(result)}</p>
                <p class="card-text">${platformNames(result)}</p>
              </div>
              <div class="card-footer border-0 bg-white ">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal${result.id}" onclick="moreDetails(${result.id})">Mais detalhes...</button>
              </div>
            </div>
          </div>`
        }
        document.querySelector("#pesquisa .row").innerHTML += str;
    });
}

async function search() {
    return fetch('https://api.rawg.io/api/games?key=2a0d63cae69646ddb5bd580d5aa0d0e5&search='+searchName)
        .then(res => res.json());
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
