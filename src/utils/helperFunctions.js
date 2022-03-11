const dev = true;

export const groupItems = (data, tag) => {
    const groups = data.reduce((groups, field) => {
        const groupByField = tag === 'created_on' ? field[tag].substring(0, field[tag].indexOf('T')) : field[tag];
        if (!groups[groupByField]) {
          groups[groupByField] = [];
        }
        groups[groupByField].push(field);
        return groups;
    }, {});

    const groupsWithDates = Object.keys(groups).map((group) => {
        return {
            group,
            data: groups[group]
        };
    });
      
      // Edit: to add it in the array format instead
    return tag === 'created_on' ? groupsWithDates.sort((a,b) => new Date(b.group) - new Date(a.group)) : groupsWithDates;
}

export const formateAmount = (amount, currency = true) => {
    return `${currency ? 'R ' : ''}` + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export const getBudgetsDeductedAmount = (storedDeductions, budgetID, showCuurency = true) => {
    return formateAmount(storedDeductions.filter(deduction => deduction.budgets_id === budgetID).reduce((a, b) => b.amount + a, 0), showCuurency);
}

let baseUrl = 'https://buget-123-new.herokuapp.com/api/v2'
if(dev) baseUrl = 'http://192.168.0.100:5000/api/v2'

export const url = 'https://buget-123-new.herokuapp.com/api/v2'

export const createDeduction = (deduction) => {
    return {
        ...deduction, 
        sign: 'temp',
        created_on: new Date(deduction.created_on).toISOString(), 
        id: Date.now()
    };
}