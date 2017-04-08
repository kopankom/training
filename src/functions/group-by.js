export const groupBy = (subReducer, getInitial) =>
    (collection, key) => collection.reduce(
        (groupedItems, item) => {
            if (!groupedItems[item[key]]){
                groupedItems[item[key]] = getInitial();
            }
            groupedItems[item[key]] = subReducer(groupedItems[item[key]], item)
            return groupedItems;
        }, {});
