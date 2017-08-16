function update(id, fieldName, value) {
    return (item) => {
        if(`${item.id}` == `${id}`){
            item[fieldName] = value;
        }
        return item;
    }
}
export default update;