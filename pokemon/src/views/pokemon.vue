<template>

    <div id="container">
        <div id="header">
            <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
            <!--TODO realizar busqueda con autocompletado-->
            <autoComplete
            :items="pokemons"
            filterBy="name"
            @Change="onChangeSearch"
            title="Busca el pokemon"
            @selected="pokemonSelected"
            :search="search"
            />
            
        </div>

        <div id="types">
            <!--Boton para seleccionar todos-->
            <button :disabled="this.filter_type === '' ? true : false" :style="this.filter_type === '' ? { backgroundColor: 'rgba(100, 100, 230, 0.356)' } : {}" @click="$event => typeChange('all')"><div class="iconButton" style="padding: 0.9em 0em 0em 0em;">ALL</div></button>
            <!--Recorrer tipos de pokemon-->
            <div v-for="a in types" v-bind:key="a.id">
                <button :disabled="this.filter_type === a.name ? true : false" :style="this.filter_type === a.name ? { backgroundColor: 'rgba(100, 100, 230, 0.356)' } : {}" @click="typeChange(a.name)"><div class="iconButton"><icon :name="a.name"/><span>{{ a.name }}</span></div></button>
            </div>
             
        </div>

        <div id="pokemons">
            <!--Recorrer los poquemos, en base al filtro-->
            <div v-for="a in typeFilter" v-bind:key="a.order">
                <div class="card" :style="{backgroundColor: a.color.name }">
                    <h4>#{{ a.order }}</h4>
                    <img class="pokeImg" :alt="a.name" :src="a.img">
                    <p>{{ a.name }}</p>
                    <div class="iconContainer" v-for="t in a.types" v-bind:key="t">
                        <div>
                            <icon class="icon" :name="t"/>
                        </div>
                    </div>
                
                </div>
            </div>
            
        </div>

        <div id="footer">
            <!--TODO Realizar paginador-->
            <div class="pagination">
                <a @click="getDataPage('sub')">&laquo;</a>
                <a v-for="a in totalPages" v-bind:key="a" v-on:click="getDataPage(a)" :style="a === pageNumber ? {backgroundColor: '#4CAF50' } : {}">{{ a }} </a>
                <a @click="getDataPage('add')">&raquo;</a>
            </div>
        </div>
    </div>
    

</template>


<script>

//importar servicio para realizar peticiones rest a pokeapi.co
import pokemonService from '@/services/pokemonService'

//Importar componente para el autocompletado
import autoComplete from '@/components/autoComplete.vue'

//Importar componente para mostrar iconos svg dinamicamente
import icon from '@/components/icon.vue'

export default {
    name: 'pokemonApp',
    data() {
        //Declarar variables
        return {
            pokemonsGeneration1: {},
            pokemons: [],
            types: [],
            search: '',
            filter_type: '',
            totalPages: 0,
            dataPages: [],
            pageNumber: 1,
            pokemonsByPage: 10
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
            //console.log('get pokemon_species: '+JSON.stringify(this.pokemonsGeneration1.pokemon_species));
            //console.log('get types: '+JSON.stringify(this.pokemonsGeneration1.types));
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

            this.totalPages = Math.ceil(this.pokemons.length / 10)

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
            //console.log('types: '+JSON.stringify(this.types));
        },
        typeChange(type){
            //Si se ha seleccionado el boton 'all', se mostraran todos los poquemos
            this.search = ''
            this.pageNumber = 1
            if(type === 'all'){
                this.filter_type = ''
            }else{
                this.filter_type = type
            }
        },
        seachSelected(name){
            this.search = name;
        },
        pokemonSelected(pokemon) {
            //console.log('on selected')
            this.search = pokemon.name
            //console.log(`Pokemon Selected:\nid: ${pokemon.id}\nname: ${pokemon.name}`)
        },
        onChangeSearch(pokemon) {

            if(pokemon && typeof pokemon == 'object'){
                console.log('on change trusted')
            }else{
                this.filter_type = ''
                this.pageNumber = 1
                this.search = pokemon
            }
            
        },
        getDataPage(page){
            //Cambiar de página
            switch (page) {
                case 'sub':
                    if(this.pageNumber > 1) {
                        this.pageNumber -= 1
                    }
                    break;
                case 'add':
                    if(this.pageNumber < this.totalPages) {
                        this.pageNumber += 1
                    }
                    break;
                default:
                    this.pageNumber = page;
                    break;
            }
            
        },
        filterPagination: function(data){

            this.totalPages = Math.ceil(data.length / this.pokemonsByPage) 

            console.log('total pages filer pagination: '+this.totalPages)

            let result = [];

            let start = (this.pageNumber * this.pokemonsByPage) - this.pokemonsByPage;
            let end = (this.pageNumber * this.pokemonsByPage) 

            for (let index = 0; index < data.length; index++) {
                if(index >= start && index < end){
                    result.push(data[index]);
                }
            }

            return result

        }
    },
    computed: {
        typeFilter: function(){
            //Filtrado por busqueda y typos
            if(this.search && typeof this.search === 'string'){
                //Si el buscador esta rellenado filtra por este
                return this.filterPagination(this.pokemons.filter((item) => {
                    return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                }));
                
            }else if(this.filter_type && typeof this.search == 'string'){
                //Si el buscador esta vacio y se ha elegido un tipo, filtrar por este.
                return this.filterPagination(this.pokemons.filter((item) => {
                    //console.log('item: '+index);
                    return this.filter_type.toLowerCase().split(' ').every((v) => item.types.includes(v))
                }));
                
            }else{
                //Si no se cumplen las dos condiciones, devolver todos los pokemons.
                return this.filterPagination(this.pokemons)
            }
        }
    },
    watch: {
        typeFilter: function (){
            //Pokemons filtrados / 10 pokemos por página
            if(!this.seach && !this.filter_type){
                this.totalPages = Math.ceil(this.pokemons.length / this.pokemonsByPage) 
            }
            
        }
    },
    components: {
        autoComplete,
        icon
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
        height: 10em;
        background-color: white
        
    }

    #pokemons {
        height: 30em;
        background-color: white;
        padding: 3em;
        z-index: 1;
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

    .pokeImg {
        position: absolute;
        left: 5em;
        top: 0em;
        width: 8em;
        height: 8em;
    }

    .pokeImg:hover{
        position: absolute;
        left: 3em;
        top: -4em;
        width: 12em;
        height: 12em;
    }

    .card p {
        position: absolute;
        left: 7em;
        top: 7em;
        font-weight: bold;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

    .card span img {
        margin-left: 2em;
        width: 4em;
        height: 4em;
    }

    .iconContainer {
        float: left;
        height: 3em;
        padding: 0.5em 0.5em 2em 0.5em;
        margin-top: 4.8em;
        margin-left: 1.5em;
    }

    .iconContainer div {
        width: auto;
        padding: 0.3em 0.2em 0em 0.2em;
        border-radius: 30px;
        background-color: white;
    }

    #types button{
        float: left;
        background-color: rgb(168, 168, 168);
        border-radius: 30px;
        border-style: solid;
        border-color: yellow;
        padding: 0.5em 2.5em 0.5em 2.5em;
        margin: 1em 1em 0em 1em;
    }

    .iconButton {
        width: 7em;
    }

    .iconButton span {
        margin-left: 1em;
        font-size: 15px;
    }

    #header table {
        background-color: red;
    }

    .pagination {
        float: right;
        margin-right: auto; 
        margin-left: auto;
    }

    .pagination a {
        color: black;
        float: left;
        padding: 8px 16px;
        text-decoration: none;
        transition: background-color .3s;
        border: 1px solid #ddd;
        border-radius: 40px;
        margin: 0 4px;
    }

    .pagination a:hover {
        background-color: #4CAF50;
    }

    #footer {
        height: 5em;
        background-color: white;
    }

</style>