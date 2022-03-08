export const groupItems = (data, tag) => {
    const groups = data.reduce((groups, field) => {
        const groupByField = tag === 'created_on' ? field[tag].substring(0, field[tag].indexOf('T')) : field[tag];
        if (!groups[groupByField]) {
          groups[groupByField] = [];
        }
        groups[groupByField].push(field);
        return groups;
    }, {});
      
      // Edit: to add it in the array format instead
    return Object.keys(groups).map((group) => {
        return {
            group,
            data: groups[group]
        };
    });
}

export const formateAmount = (amount) => {
    return 'R ' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}