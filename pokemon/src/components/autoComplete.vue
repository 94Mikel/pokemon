<template>

    <div class="autocomplete">
        <div class="popover">
            
            <input type="text" 
            v-model="query" 
            @keydown.up="up"
            @keydown.down="down"
            @keydown.enter="selectItem"
            placeholder="Escriba el nombre...">

            <div class="options">
                <ul>
                    <li 
                    v-for="(match, index) in matches"
                    :key="match[filterBy]" 
                    @click="itemClicked(index, match[filterBy])"
                    v-text="match[filterBy]"
                    ></li>
                </ul>
            </div>
        
        </div>
    </div>

</template>

<script>
    
    export default {
        props: ["items", "filterBy", "search"],
        data() {
            return {
                itemHeight: 39,
                selectedItem: null,
                selected: 0,
                query: '',
                visible:true
            }
        },
        methods: {
            itemClicked(index, item) {
                this.selected = index;
                this.query = item;
                this.selectItem();
                //console.log(this.matches[index])
            },
            selectItem() {
                if(!this.matches.length){
                    return;
                }

                this.selectedItem = this.matches[this.selected]

                if(this.shouldReset){
                    this.query = '';
                    this.selected = 0;
                }

                this.$emit('selected', JSON.parse(JSON.stringify(this.selectedItem)));

            },
            up() {
                if (this.selected == 0){
                    return;
                }

                this.selected -= 1;
                this.scrollToItem();
            },
            down() {
                if(this.selected >= this.matches.length - 1){
                    return;
                }

                this.selected += 1;
                this.scrollToItem();
            },
            scrollToItem() {
                this.$refs.optionsList.scrollTop = this.selected * this.itemHeight;
            }
        },
        computed: {
            matches() {

                this.$emit('change', this.query);

                if(this.query === '') {
                    return [];
                }

                return this.items.filter(item => item[this.filterBy].toLowerCase().includes(this.query.toLowerCase()))
            }
        },
        watch: {
            search: function(search) {
                if(!search){
                    //Vaciar buscador cuando se hace click en cualquier boton tipos.
                    this.query = ''
                }
            }
        }

    }
    

</script>

<style scoped>
.autocomplete {
    width: 30%;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
}

.popover {
    min-height: 50px;
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    border-radius: 3px;
    text-align: center;
}
.popover input {
    width: 95%;
    margin-top: 5px;
    height: 40px;
    font-size: 16px;
    border-radius: 30px;
    border: 1px solid lightgray;
    padding-left: 8px;
}
.options {
    max-height: 150px;
    overflow-y: scroll;
    margin-top: 5px;
}
.options ul {
    list-style-type: none;
    text-align: left;
    padding-left: 0;
}
.options ul li {
    border-bottom: 1px solid lightgray;
    padding: 10px;
    cursor: pointer;
    background: #f1f1f1;
}
.options ul li:first-child {
    border-top: 2px solid #d6d6d6;
}

.options ul li:not(.selected):hover {
    background: #8c8c8c;
    color: #fff;
}
.options ul li.selected {
    background: #58bd4c;
    color: #fff;
    font-weight: 600;
}

</style>