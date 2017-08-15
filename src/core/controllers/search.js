function search(searchField, searchText){
    return (item)=>(
        item[searchField].includes(searchText)
    )
}
export default search