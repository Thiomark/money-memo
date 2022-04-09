import { ToastAndroid } from "react-native";
import { format, formatDistanceToNow } from 'date-fns';

const dev = false;

export const uploadImage = async (deduction) => {
    if(deduction.image){
        try {
            const imageName = `budget-img-${Date.now()}-${deduction.amount}`
            
            const formData = new FormData();

            formData.append('featuredImage', {
                name: imageName,
                uri: deduction.image,
                type: 'image/jpg',
            });

            await fetch(url + '/deductions/image/' + id, {
                method: 'POST',
                body: formData,
            })

            return imageName
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset('Image not saved', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        }
    }
    return null;
}

export const groupItems = (data, tag, archiveItems) => {

    if(archiveItems) data = data.filter(x => !x.archived);

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
            formatedDate: tag === 'created_on' ? {
                date: format(new Date(group), 'PP'), 
                distance : formatDistanceToNow(new Date(group), {addSuffix: true})
            } : null,
            group,
            data: groups[group]
        };
    });
      
      // Edit: to add it in the array format instead
    return tag === 'created_on' ? groupsWithDates.sort((a,b) => new Date(b.group) - new Date(a.group)) : groupsWithDates;
}

export const formateAmount = (amount, currency = true) => {
    return `${currency ? 'R ' : ''}` + (Number(amount)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export const getBudgetsDeductedAmount = (storedDeductions, budgetID, showCuurency = true, forOnePerson = false, user_id) => {
    //forOnePerson ? b?.user_id && b?.user_id === user_id && b.amount / b.divide_by : b.amount
    return formateAmount(storedDeductions.filter(deduction => deduction.budgets_id === budgetID).reduce((a, b) => Number(forOnePerson ? (b.divide_by === 1 ? b?.user_id && b.user_id === user_id ? b.amount : 0 : b.amount / b.divide_by) : b.amount) + a, 0), showCuurency);
}

// const getRemaingAmount = () => {
//     1000 + (storedDeductions.filter(bg => bg.budgets_id === route.params.id).reduce((a, b) => b.amount + a, 0))
// }

let baseUrl = 'https://buget-123-new.herokuapp.com/api/v2'
if(dev) baseUrl = 'http://192.168.0.101:5000/api/v2'

export const url = baseUrl;

export const createDeduction = (deduction) => {
    return {
        ...deduction, 
        sign: 'temp',
        created_on: new Date(deduction.created_on).toISOString(), 
        id: Date.now()
    };
}

export const searchForItem = (orginalArray, updatedArray, field) => {
    for(var i = 0, l = orginalArray.length; i < l; i++) {
        for(var j = 0, ll = updatedArray.length; j < ll; j++) {
            if(orginalArray[i].name === updatedArray[j][field] && !orginalArray[i].temp) {
                orginalArray.splice(i, 1, updatedArray[j]);
                break;
            }
        }
    }
    return orginalArray
}