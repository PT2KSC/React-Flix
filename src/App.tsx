import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import axios from 'axios'

interface Filme {
  imdbID: string
  Title: string
  Poster: string
  Year: string
}

function App() {
  const chave = import.meta.env.VITE_API_KEY
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [termoBusca, setTermoBusca] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const buscaFilme = async (nomeFilme: string) => {
    if (!nomeFilme.trim()) {
      setErro('Digite o nome de um filme para buscar.')
      setFilmes([])
      return
    }

    setCarregando(true)
    setErro('')

    try {
      const resposta = await axios.get(
        `https://www.omdbapi.com/?apikey=${chave}&s=${encodeURIComponent(nomeFilme)}`
      )

      if (resposta.data.Response === 'False') {
        setFilmes([])
        setErro('Nenhum filme encontrado com esse nome.')
        return
      }

      setFilmes(resposta.data.Search ?? [])
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
      setErro('Não foi possível buscar os filmes. Tente novamente.')
      setFilmes([])
    } finally {
      setCarregando(false)
    }
  }

  const aoBuscarFilme = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    buscaFilme(termoBusca)
  }

  return (
    <main className="app">
      <h1>React Flix</h1>

      <form className="busca" onSubmit={aoBuscarFilme}>
        <input
          type="text"
          value={termoBusca}
          onChange={(evento) => setTermoBusca(evento.target.value)}
          placeholder="Ex.: Matrix"
          aria-label="Nome do filme"
        />
        <button type="submit" disabled={carregando}>
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {erro && <p className="mensagem erro">{erro}</p>}

      {!erro && !carregando && filmes.length === 0 && (
        <p className="mensagem">Pesquise pelo nome de um filme para ver os resultados.</p>
      )}

      <section className="grid-filmes">
        {filmes.map((filme) => (
          <article key={filme.imdbID} className="card-filme">
            <img
              src={filme.Poster !== 'N/A' ? filme.Poster : 'https://via.placeholder.com/300x445?text=Sem+Imagem'}
              alt={filme.Title}
            />
            <h2>{filme.Title}</h2>
            <p>{filme.Year}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App