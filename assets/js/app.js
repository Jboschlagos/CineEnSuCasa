const API_KEY = "TU_API_KEY_AQUI";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300";

const input = document.getElementById("busqueda");
const btn = document.getElementById("btnBuscar");
const contenedor = document.getElementById("resultados");

btn.addEventListener("click", buscarPeliculas);

async function buscarPeliculas() {
  const texto = input.value.trim();
  if (!texto) return;

  contenedor.innerHTML = "Cargando...";

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${texto}&language=es-ES`
    );
    const data = await res.json();

    contenedor.innerHTML = "";

    for (const peli of data.results.slice(0, 8)) {
      const detalle = await obtenerDetalle(peli.id);
      crearCard(detalle);
    }

  } catch (error) {
    contenedor.innerHTML = "Error al buscar películas";
    console.error(error);
  }
}

async function obtenerDetalle(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`
  );
  return await res.json();
}

function crearCard(peli) {
  const director = peli.credits?.crew?.find(c => c.job === "Director");
  const pais = peli.production_countries?.[0]?.name || "N/D";

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${peli.poster_path ? IMG_URL + peli.poster_path : ""}">
    <div class="card-content">
      <h3>${peli.title}</h3>
      <p>Año: ${peli.release_date?.slice(0,4)}</p>
      <p>País: ${pais}</p>
      <a href="https://www.imdb.com/title/${peli.imdb_id}" target="_blank">
        Ver en IMDb
      </a>
    </div>
  `;

  contenedor.appendChild(card);
}
