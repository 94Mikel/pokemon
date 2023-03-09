
import axios from 'axios'

export default () => {

    //Crear instancia de axios
    return axios.create({
        baseURL: 'https://pokeapi.co/api/v2',
        headers: {
            'Accept': 'application/json',
            "Content-type": 'application/json'
        }

    })
}