import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';

const IconButton = ({name, size = 25, color='white', event}) => {
    return (
        <TouchableOpacity onPress={event} style={[{height: 35, width: 35}, tw`flex flex-row items-center justify-center`]}>
            <Icon
                name={name}
                type='ionicon'
                color={color}
                size={size}
            />
        </TouchableOpacity>
    )
}

const SelectDeduction = ({deleteEvent, cancelEvent, selectedDeductions, editEvent, upload, canUpload, tageDeductions}) => {
    return (
        <View style={[tw`max-h-16 flex-1 flex items-center justify-between px-3 flex-row`, {backgroundColor: '#212121'}]}>
            <IconButton 
                event={cancelEvent} 
                name='close-outline' 
                size={35}
            />
            <IconButton 
                event={tageDeductions}
                name='archive-outline'
            />
            {selectedDeductions.length === 1 && (
                <IconButton 
                    name='create-outline' 
                    event={editEvent}
                />
            )}
            {selectedDeductions.length === 1 && (
                <IconButton 
                    name='trash-outline' 
                    color='red' 
                    event={deleteEvent}
                />
            )}
            {selectedDeductions.length === 1 &&  canUpload && (
                <IconButton 
                    name='cloud-upload-outline' 
                    color='white' 
                    event={upload}
                />
            )}
        </View>
    )
}

export default SelectDeduction