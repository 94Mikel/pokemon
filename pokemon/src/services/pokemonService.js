import Api from '@/services/Api'

/*
    Servicio para realizar peticiones rest con la instancia de axios.
*/

export default {
    getPokemons() {
        return Api().get('pokemon?limit=100000&offset=0')
    },
    getPokemonById(id) {
        return Api().get('/pokemon/'+id)
    },
    getPokemonsGeneration1(){
        return Api().get('/generation/1')
    },
    getPokemonSpecieById(id) {
        return Api().get('/pokemon-species/'+id)
    },
    getTypeById(id){
        return Api().get('/type/'+id)
    }
}
