<template>
  <main>
    <div>
      <input type="text" placeholder="Search">
    </div>
    <template v-if="isLoading">
      Carregando...
    </template>
    <template v-else>
      <div>
        <ul>
          <li v-for="pokemon in pokemonList" :key="pokemon.id">
            <div>
              {{ pokemon.name }}
              <img :src="pokemon.image" :alt="pokemon.name+' image'">
            </div>
            <div v-if="pokemon.types">
              <div v-for="type in pokemon.types" :key="type">
                {{ type }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <div>
      {{ totalPages }} - {{ pagination.limit }}
    </div>
  </main>
</template>

<script>
export default {
  created() {
    this.fetchPokemons()
  },
  data() {
    return {
      isLoading: false,
      pokemonList: [],
      pagination: {
        offset: 0,
        limit: 9,
        totalItens: 0
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.totalItens / this.pagination.limit)
    }
  },
  methods: {
    async fetchPokemons() {
      this.isLoading = true
      const { offset, limit } = this.pagination
      const response = await this.$http.get(`/pokemon`, {
        params: {
          offset,
          limit,
        }
      })
      const { data } = response
      const { results } = data
      const pokemons = results.map(pokemon => {
        return {
          id: pokemon.url.split('/').reverse()[1],
          name: pokemon.name,
          url: pokemon.url,
        }
      })

      this.pokemonList = [...pokemons]
      this.pagination.totalItens = data.count
      await this.fetchPokemonsInfo(pokemons)
    },
    async fetchPokemonsInfo(pokemonsList) {
      const pokeInfo = []
      for (let pokemon of pokemonsList) {
        const response = await this.$http.get(pokemon.url)
        pokeInfo.push(response.data)
      }

      this.isLoading = false
      this.pokemonList = this.pokemonList.map(pokemon => {
        return {
          ...pokemon,
          types: pokeInfo
            .filter(info => {
              return info.id == pokemon.id
            })
              .map(info => info.types
                .map(types => types.type.name)
              )[0]
          ,
          image: pokeInfo
            .filter(info => info.id == pokemon.id)
            .map(info => info.sprites.front_default)
        }
      })
    }
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
  }
  li {
    list-style: none;
    margin-bottom: 10px;
  }
</style>