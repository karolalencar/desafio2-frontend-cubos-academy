const body = document.querySelector('body');
const input = document.querySelector('.input');
const paginaAnterior = document.querySelector('.btn-prev');
const paginaPosterior = document.querySelector('.btn-next');
const filmes = document.querySelector('.movies');
const filmesSelecao = document.querySelector('.movies .movie');
const filme = document.querySelector('.movie');
const infoFilme = document.querySelector('.movie__title');
const notaFilme = document.querySelector('.movie__rating');
const tituloHighlight = document.querySelector('.highlight__title');
const descricaoHighlight = document.querySelector('.highlight__description');
const notaHighlight = document.querySelector('.highlight__rating');
const generosHighlight = document.querySelector('.highlight__genres');
const estreiaHighlight = document.querySelector('.highlight__launch');
const videoHighlight = document.querySelector('.highlight__video');
const linkHighlight = document.querySelector('.highlight__video-link');
const modal = document.querySelector('.modal');
const tituloModal = document.querySelector('.modal__title');
const imagemModal = document.querySelector('.modal__img');
const descricaoModal = document.querySelector('.modal__description');
const notaModal = document.querySelector('.modal__average'); 
const generosModal = document.querySelector('.modal__genres');

let listaFilmes = [];
let page = 0;
let maxPage = 15;
let minPage = 0;


//  Busca de filmes

input.addEventListener('keydown', function (event) {
    
    if (event.key !== 'Enter') {
        return;
    }
        page = 0;
        if (input.value === '') {

        const promiseRespostaFilmes = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

        promiseRespostaFilmes.then(function (resposta) {
        const promiseBody = resposta.json();

        promiseBody.then(function (body) {
            listaFilmes = body;
    
            recarregaFilmes();
        })
        });
        
        
    } else {
        const promiseRespostaBusca = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);

        promiseRespostaBusca.then(function (resposta) {
        const promiseBody = resposta.json();

        promiseBody.then(function (body) {
            listaFilmes = body;

            recarregaFilmes();
        })
    })
    }

    input.value = '';
});


// Visualização de filmes

const promiseRespostaFilmes = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');



paginaAnterior.addEventListener('click', function () {
    if (page === 0) {
        page = maxPage;
    } else {
        page -= 5;
    }

    recarregaFilmes();
});

paginaPosterior.addEventListener('click', function () {
    if (page === maxPage) {
        page = minPage;
    } else {
        page += 5;
    }

    recarregaFilmes();
});

function recarregaFilmes () {
    filmes.innerHTML = '';
    for (let i = page; i < page + 5; i++) {
        const divFilme = document.createElement('div');
        divFilme.classList.add('movie');
        divFilme.style.backgroundImage = `url(${listaFilmes.results[i].poster_path})`;
        divFilme.setAttribute("id", listaFilmes.results[i].id);
        const infosFilme = document.createElement('div');
        infosFilme.classList.add('movie__info');
        const tituloFilme = document.createElement('span');
        tituloFilme.classList.add('movie__title');
        tituloFilme.textContent = listaFilmes.results[i].title;
        const spanNota = document.createElement('span');
        spanNota.classList.add('movie__rating');
        const imagem = document.createElement('img');
        imagem.src = "./assets/estrela.svg";
        const nota = document.createElement('span');
        nota.classList.add('movie__rating-rate');
        nota.textContent = listaFilmes.results[i].vote_average;

        spanNota.append(imagem, nota);
        infosFilme.append(tituloFilme, spanNota);
        divFilme.append(infosFilme);
        filmes.append(divFilme);
    }
}


promiseRespostaFilmes.then(function (resposta) {
    const promiseBody = resposta.json();

    promiseBody.then(function (body) {
        listaFilmes = body;
        for (let i = page; i < 5; i++) {
            const divFilme = document.createElement('div');
            divFilme.classList.add('movie');
            divFilme.style.backgroundImage = `url(${body.results[i].poster_path})`;
            divFilme.setAttribute("id", body.results[i].id);
            const infosFilme = document.createElement('div');
            infosFilme.classList.add('movie__info');
            const tituloFilme = document.createElement('span');
            tituloFilme.classList.add('movie__title');
            tituloFilme.textContent = body.results[i].title;
            const spanNota = document.createElement('span');
            spanNota.classList.add('movie__rating');
            const imagem = document.createElement('img');
            imagem.src = "./assets/estrela.svg";
            const nota = document.createElement('span');
            nota.classList.add('movie__rating-rate');
            nota.textContent = body.results[i].vote_average;

            spanNota.append(imagem, nota);
            infosFilme.append(tituloFilme, spanNota);
            divFilme.append(infosFilme);
            filmes.append(divFilme);
        }

    })
});


// Filme do dia

const promiseRespostaHighlight = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');

promiseRespostaHighlight.then(function (resposta) {
    const promiseBody = resposta.json();

    promiseBody.then(function (body) {
        tituloHighlight.textContent = body.title;
        descricaoHighlight.textContent = body.overview;
        notaHighlight.textContent = body.vote_average;
        let generos = '';
        let dataEstreia = '';
        body.genres.forEach(genero => {
            generos += `${genero.name.toUpperCase()}, `;
        });
        generos = generos.substr(0, generos.length - 2);
        generosHighlight.textContent = generos;
        dataEstreia = `${body.release_date.slice(-2)} DO ${body.release_date.slice(5, 7)} DE ${body.release_date.slice(0, 4)}`;
        estreiaHighlight.textContent = dataEstreia;
        videoHighlight.style.backgroundImage = `url(${body.backdrop_path})`;
    });
});

const promiseRespostaVideo = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

promiseRespostaVideo.then(function (resposta) {
    const promiseBody = resposta.json();

    promiseBody.then(function (body) {
        linkHighlight.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    });
});


// Modal de filme
filmes.addEventListener('click', function (event) {
    const id = event.target.id;

    const promiseRespostaModal = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

    promiseRespostaModal.then(function (resposta) {
        const promiseBody = resposta.json();

        promiseBody.then(function (body) {
            tituloModal.textContent = body.title;
            imagemModal.src = body.backdrop_path;
            descricaoModal.textContent = body.overview;
            body.genres.forEach(genero => {;
                const divGenero = document.createElement('div');
                divGenero.classList.add('modal__genre');
                divGenero.textContent = genero.name;

                generosModal.append(divGenero);
            });
            notaModal.textContent = body.vote_average;
        })
    })

    modal.classList.remove('hidden');
});

modal.addEventListener('click', function () {
    generosModal.innerHTML = '';
    modal.classList.add('hidden');
})


