const API_KEY = "7d5909600d11b94c31492aeeebf2c09f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300";

const input = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btnBuscar");
const resultados = document.getElementById("resultados");
const lista = document.getElementById("lista");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const cerrar = document.getElementById("cerrar");

btnBuscar.addEventListener("click", buscarPeliculas);
cerrar.addEventListener("click", () => modal.style.display = "none");

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

async function buscarPeliculas() {
  const texto = input.value.trim();
  if (!texto) return;

  resultados.innerHTML = "Cargando...";
  lista.innerHTML = "";

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${texto}&language=es-ES`
  );
  const data = await res.json();

  resultados.innerHTML = "";
  data.results.slice(0, 8).forEach(peli => crearCard(peli));
}

function crearCard(peli) {
  const vistas = getStorage("peliculasVistas");
  const favoritas = getStorage("peliculasFavoritas");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${peli.poster_path ? IMG_URL + peli.poster_path : ""}">
    <div class="card-content">
      <h3>${peli.title}</h3>
      <p>Año: ${peli.release_date?.slice(0,4) || "N/D"}</p>
      <a href="#" class="detalle">Ver detalle</a>
      <div class="acciones">
        <button>Vista</button>
        <button>Favorita</button>
      </div>
    </div>
  `;

  card.querySelector(".detalle").addEventListener("click", e => {
    e.preventDefault();
    abrirModal(peli);
  });

  card.querySelectorAll("button")[0].onclick = () => {
    vistas.push({ id: peli.id, title: peli.title });
    setStorage("peliculasVistas", vistas);
  };

  card.querySelectorAll("button")[1].onclick = () => {
    favoritas.push({ id: peli.id, title: peli.title });
    setStorage("peliculasFavoritas", favoritas);
  };

  resultados.appendChild(card);
}

function abrirModal(peli) {
  modalBody.innerHTML = `
    <h3>${peli.title}</h3>
    <p>${peli.overview || "Sin descripción"}</p>
  `;
  modal.style.display = "block";
}

function mostrarVistas() {
  mostrarLista("peliculasVistas", "Vistas");
}

function mostrarFavoritas() {
  mostrarLista("peliculasFavoritas", "Favoritas");
}

function mostrarLista(key, titulo) {
  const datos = getStorage(key);
  lista.innerHTML = `<h3>${titulo}</h3>`;

  if (!datos.length) {
    lista.innerHTML += "<li>No hay películas</li>";
    return;
  }

  datos.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.title;
    lista.appendChild(li);
  });
}
