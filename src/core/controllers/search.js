function search(searchField, searchText) {
    return (item) => {
        if(Array.isArray(searchField)){
            return searchField.find((field) => {
                const value = `${item[field]}`.toLowerCase();
                return value.includes(searchText.trim().toLowerCase());
            });
        }
        if(typeof searchField == 'string'){
            const value = `${item[searchField]}`.toLowerCase();
            return value.includes(searchText.trim().toLowerCase());
        }
    }
}
export default search;