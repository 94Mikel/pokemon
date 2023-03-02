# Prueba de selección 💻🎯

Queremos hacer una página web que nos ayude a consultar los **pokemon de primera generación** y para facilitarnos la vida vamos a desarrollar una serie de herramientas que nos ayuden en este trabajo.

Es importante indicar que **NO ES NECESARIO DESARROLLAR TODAS LAS FUNCIONALIDADES** que se muestran a continuación, ya que lo realmente importante en esta prueba es que podamos ver la forma de trabajar y resolver problemas que tienes.

![](/images/design.jpg)


## 📝 **LISTA DE TAREAS**
---

Vamos a separar las tareas en PRINCIPALES y EXTRAS, siendo las PRINCIPALES las que consideramos a priori más importantes y las EXTRAS funcionalidades más secundarias.

### **Tareas `PRINCIPALES`**:

1. **Carga de datos pokemon:** Nos tendremos que conectar a la API de pokemon para cargar los datos necesarios. Los datos que necesitaremos se explican más detalladamente en el apartado de 📖 **CARGA DE DATOS**.

2. **Listado con efecto :hover:** Un listado de pokemon en cards que muestre los siguientes atributos de cada uno de ellos:
    - La _imagen_ del pokemon
    - El _nombre_ del pokemon
    - La _posición_ en la lista
    - El _tipos_ del pokemon

    Cada una de las cards se pintará jugando con el color que más predomina en el pokemon como se muestra en la imagen de diseño.

3. **Un buscador con autocompletado:** Un buscador que al escribir filtre los pokemon por la coincidencia con el nombre. A medida que se escriba en el buscador se mostrarán tanto los nombres de los posibles pokemon como las cards de los mismos.


### **Tareas `EXTRA`**:
1. **Filtro por tipo de pokemon:** Un listado de tipos que permita filtrar los pokemons por el tipo (agua, fuego, eléctrico...).

2. **Paginación:** Una barra de paginación para poder navegar por las distintas páginas.


## 📖 **CARGA DE DATOS**

---

Los datos los cargaremos haciendo uso de la API de **POKEAPI** (documentación aquí 👉 https://pokeapi.co/).

La primera llamada será para obtener la lista de pokemon y tipos que hay en la primera generación. Debemos filtrar los datos para quedarnos únicamente con los atributos `pokemon_species` y `types`.

```json
// ENDPOINT => https://pokeapi.co/api/v2/generation/1
{
  "pokemon_species": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
    }
  ],
  "types": [
    {
      "name": "normal",
      "url": "https://pokeapi.co/api/v2/type/1/"
    }
  ]
}
```

Tanto los **_pokemon_** como los **_tipos_** vienen acompañados de un atributo `url` que indica cual es el endpoint con los detalles de cada uno de ellos.

> ⚠️ **IMPORTANTE**: El número que viene al final de cada url es el `id` (pokemon y tipo)

### 🐛 **DATOS DEL `POKEMON`**

---

Para los **_pokemon_** nos vale con los atributos `name`, `order` y `color` ( color que más predomina en ese pokemon que usaremos para el diseño de las cards).

```json
// ENDPOINT => https://pokeapi.co/api/v2/pokemon-species/1/
{
  "order": 1,
  "name": "bulbasaur",
  "color": {
    "name": "green"
  }
}
```

> Para la `imagen` del pokemon se puede usar esta url sustituyendo el último número por el correspondiente `id` del pokemon:
> https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg`


### ⚗️ **DATOS DEL `TIPO`**

---

Para los **_tipos_** tenemos los atributos `id`, `name` y `pokemon`. Este último contiene la lista de pokemon de ese mismo tipo ( en la lista no vienen solo los pokemon de la primera generación ).

```json
// https://pokeapi.co/api/v2/type/1/
{
  "id": 1,
  "name": "normal",
  "pokemon": [
    {
      "pokemon": {
        "name": "pidgey",
        "url": "https://pokeapi.co/api/v2/pokemon/16/"
      }
    }
  ]
}
```

## 📚 RECURSOS
---

En la carpeta `/images` están las imagenes de los tipos (agua, fuego, electrico...), el logo y el diseño de la aplicación.

![](/images/types/bug.svg)
![](/images/types/dragon.svg)
![](/images/types/electric.svg)
![](/images/types/fighting.svg)
![](/images/types/fire.svg)
![](/images/types/flying.svg)
![](/images/types/ghost.svg)
![](/images/types/grass.svg)
![](/images/types/ground.svg)
![](/images/types/ice.svg)
![](/images/types/normal.svg)
![](/images/types/poison.svg)
![](/images/types/psychic.svg)
![](/images/types/rock.svg)
![](/images/types/water.svg)
