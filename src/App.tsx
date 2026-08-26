import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const chave = import.meta.env.VITE_API_KEY
  const [filmes, setFilmes] = useState([])

  const buscaFilme = async () => {
    try {
      const resposta = await axios.get(`https://www.omdbapi.com/?apikey=${chave}&s=2001`)
      setFilmes(resposta.data.Search)
    }catch (error){
      console.error('Erro ao buscar filmes:',error)
    }
  }

  return (
    <>
      {filmes.map((filme:any) => (
        <div key={filme.imdbID}>
          <h2>{filme.Title}</h2>
          <img src={filme.Poster} alt={filme.Title} />
        </div>
      ))}
      <button onClick={buscaFilme}>Buscar Filmes</button>
    </>
  )
}
export default App