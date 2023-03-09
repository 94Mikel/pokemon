<template>

    <div id="container">
        <div id="header">
            <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
            <!--TODO realizar busqueda con autocompletado-->

            <input type="text" placeholder="Escriba el nombre" v-model="search" list="searchs"/>
            <table>
                <tbody>
                    <tr v-for="item in searchHelp" v-bind:key="item.order">
                        <td><a @click="seachSelected(item.name)" target="_blank">{{item.name}}</a></td>
                    </tr>
                </tbody>
            </table>
        
        </div>

        <div id="types">
            <!--Boton para seleccionar todos-->
            <button :disabled="this.filter_type === '' ? true : false" :style="this.filter_type === '' ? { backgroundColor: 'rgba(100, 100, 230, 0.356)' } : {}" @click="$event => typeChange('all')">ALL</button>
            <!--Recorrer tipos de pokemon-->
            <div v-for="a in types" v-bind:key="a.id">
                <button :disabled="this.filter_type === a.name ? true : false" :style="this.filter_type === a.name ? { backgroundColor: 'rgba(100, 100, 230, 0.356)' } : {}" @click="typeChange(a.name)">{{ a.name }}</button>
            </div>
             
        </div>

        <div id="pokemons">
            <!--Recorrer los poquemos, en base al filtro-->
            <div v-for="a in typeFilter" v-bind:key="a.order">
                <div class="card" :style="{backgroundColor: a.color.name }">
                    <h4>#{{ a.order }}</h4>
                    <img :alt="a.name" :src="a.img">
                    <p>{{ a.name }}</p>
                    
                    <!--
                        name: {{ a.name }}
                    color: {{ a.color.name }}
                    types: {{ a.types }}
                    img: {{ a.img }}
                    -->
                </div>
            </div>
        </div>

        <div id="footer">
            <!--TODO Realizar paginador-->
        </div>
    </div>
    

</template>


<script>

//importar servicio para realizar peticiones rest a pokeapi.co
import pokemonService from '@/services/pokemonService'

export default {
    name: 'pokemonApp',
    data() {
        //Declarar variables
        return {
            pokemonsGeneration1: {},
            pokemons: [],
            types: [],
            search: '',
            filter_type: ''
        }
    },
    created(){
        //Despues de que se hayan creado las variables
        //Llamamos a la funcion getPokemons para obtener los pokemons
        this.getPokemonsGeneration1();
    },
    methods: {
        async getPokemonsGeneration1 () {
            //Obtener los pokemons y tipos de la primera generación.
            let response = await pokemonService.getPokemonsGeneration1()
            this.pokemonsGeneration1 = {
                pokemon_species: response.data.pokemon_species,
                types: response.data.types
            }
            console.log('get pokemon_species: '+JSON.stringify(this.pokemonsGeneration1.pokemon_species));
            console.log('get types: '+JSON.stringify(this.pokemonsGeneration1.types));
            this.getPokemons()
            this.getTypes()
        },
        async getPokemons() {
            //Obtener los pokemons de la primera generación. 
            for (const key in this.pokemonsGeneration1.pokemon_species) {
                //Obtener el id en base a la url, para los pokemos specie de la primera generación.
                let url = this.pokemonsGeneration1.pokemon_species[key].url
                let url_split = url.split('/');
                let id = url_split[6];
                let response = await pokemonService.getPokemonSpecieById(id)

                /*
                console.log(JSON.stringify(response.data))
                console.log('order: '+response.data.order)
                console.log('name: '+response.data.name)
                console.log('color: '+JSON.stringify(response.data.color))
                */
                
                //Realizar la petición a pokemon pasandole el id para obtener su imagen y sus tipos.
                let responsePokemon = await pokemonService.getPokemonById(response.data.order)

                let img = responsePokemon.data.sprites.front_default

                let types = [];
                
                for (const a in responsePokemon.data.types) {
                    types.push(responsePokemon.data.types[a].type.name);
                }

                this.pokemons.push({
                    order: response.data.order,
                    name: response.data.name,
                    color: response.data.color,
                    types: types,
                    img: img
                });
                
            }

            //console.log('pokemons: '+JSON.stringify(this.pokemons));
        },
        async getTypes() {
            for (const key in this.pokemonsGeneration1.types) {
                let url = this.pokemonsGeneration1.types[key].url
                let url_split = url.split('/');
                
                let id = url_split[6];
                let response = await pokemonService.getTypeById(id)

                this.types.push({
                    id: response.data.id,
                    name: response.data.name,
                    pokemon: response.data.pokemon
                })
            }
            console.log('types: '+JSON.stringify(this.types));
        },
        typeChange(type){
            //Si se ha seleccionado el boton 'all', se mostraran todos los poquemos
            if(type === 'all'){
                this.filter_type = ''
            }else{
                this.filter_type = type
            }
        },
        seachSelected(name){
            this.search = name;
        }
    },
    computed: {
        //Cuendo se detecte un cambio, realiza el filtro
        searchHelp(){
            //Filtrado para el autocompletado
            if(this.search){
                return this.pokemons.filter((item)=>{
                    return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                })
            }else{
                return this.pokemons
            }
        },
        typeFilter(){
            //Filtrado por busqueda y typos
            if(this.search){
                //Si el buscador esta rellenado filtra por este
                return this.pokemons.filter((item) => {
                    //return this.filter_type.every(v => item.type.includes(v))
                    return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                })
            }else if(this.filter_type){
                //Si el buscador esta vacio y se ha elegido un tipo, filtrar por este.
                return this.pokemons.filter((item) => {
                    return this.filter_type.toLowerCase().split(' ').every(v => item.types.includes(v))
                })
            }else{
                //Si no se cumplen las dos condiciones, devolver todos los pokemons.
                return this.pokemons
            }
        }
    }
}

</script>


<style scoped>
    #container {
        padding-left: 10%;
        padding-right: 10%;
        background-color: rgba(160, 156, 156, 0.411);
        width: 100%;
        height: 65em;
    }

    #header {
        height: 20em;
        background-color: rgba(15, 14, 14, 0.753);
    }

    #header input {
        margin-top: 5em;
        display: block; 
        margin-right: auto; 
        margin-left: auto;
    }

    #header img {
        display: block; 
        margin-right: auto; 
        margin-left: auto;
        width: 20em;
        height: 10em;
    }

    #header table td {
        border-style: solid;
        border-color: black;
    }

    #types {
        height: 14em;
        background-color: white
        
    }

    #pokemons {
        height: 30em;
        background-color: white;
        padding: 3em;
    }

    .card {
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        width: 15em;
        height: 10em;
        padding: 2em;
        margin: 1em 2em 1em 2em;
        float: left;
        border-radius: 30px;
        border-style: solid;
    }

    .card h1 {
        float: left;
        background-color: red;
    }

    
    .card img {
        position: absolute;
        left: 5em;
        top: 0em;
        width: 8em;
        height: 8em;
    }

    .card p {
        position: absolute;
        left: 7em;
        top: 7em;
        font-weight: bold;
    }

    .card img:hover {
        position: absolute;
        left: 3em;
        top: -4em;
        width: 12em;
        height: 12em;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

    #types button{
        float: left;
        background-color: rgb(168, 168, 168);
        border-radius: 30px;
        border-style: solid;
        border-color: yellow;
        padding: 1em 4em 1em 4em;
        margin: 1em 1em 0em 1em;
    }

    #header table {
        background-color: red;
    }

</style>